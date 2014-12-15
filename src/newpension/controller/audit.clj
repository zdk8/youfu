(ns newpension.controller.audit
  (:use compojure.core)
  (:use korma.core
        [korma.db :only [oracle]])
  (:require [newpension.models.db :as db]
               [newpension.common.common :as common]
               [newpension.controller.old :as old]
               [newpension.models.schema :as schema]
               [noir.response :as resp]
               [noir.session :as session]
               [clj-time.local :as l]
               [clj-time.coerce :as c]
               [noir.io :as io]
               [newpension.layout :as layout]))

(def applykeys [:name :identityid :gender :birthd :nation :culture :birthplace :marriage :live :economy :age :registration :address :postcode :telephone :mobilephone
            :agent :oprelation :agentaddr :agentphone :agentmobilephone :lr_id :ishandle :applydate])
(def opofapply [:name :identityid :gender :birthd :nation :culture :marriage :live :economy :age :registration :address :telephone :mobilephone])
(def  assess  [:jja_id :sh_jings :sh_yid :sh_weis :sh_ruc :sh_xiz :sh_xingz :sh_lout :sh_chuany :sh_dab :sh_xiaob :sh_zongf :sh_pingguf :sh_jiel :sh_pingguy
         :jj_shour :jj_fenl :jj_leix :jj_pingguf :jj_pingguy :jz_fenl :jz_zhaol :jz_pingguf :jz_pingguy :nl_fenl :nl_pingguf :nl_pingguy :gx_laom :gx_youf :gx_youf_kind
         :gx_chunjg :gx_ganb :gx_pingguf :gx_pingguy :cz_shil :cz_tingl :cz_zhit :cz_qit :cz_pingguy :zf_lianzf :zf_zhulf :zf_shiyf :zf_shangpf :zf_zijf :zf_qit :zf_pingguy
         :jb_gaoxy :jb_xinlsj :jb_guanxb :jb_xinlshic :jb_manxzhiqguany :jb_feiqz :jb_feixb :jb_feiy :jb_naoxguanyw :jb_pajshensz :jb_laonchidz :jb_youyz :jb_tangnb
         :jb_tongf :jb_zhitguz :jb_jianzy :jb_jinzb :jb_leifshigjiey :jb_gandjib :jb_bainz :jb_qinguany :jb_shiwmoxguanjib :jb_tangnbingswangmbingb :jb_shenzjib
         :jb_qit1name :jb_qit2name :jb_qit3name :jb_pingguy :jb_beiz :pinggusum :standard :startdate :enddate :facilitator :content :amount :operator_date :active :zf_pingguf
         :cz_pingguf :jb_pingguf :zf_shiyingfnum :zf_shangpinfnum :zf_zijianfnum :jb_qita1 :jb_qita2 :jb_qita3 :rz_jinqijy :rz_chengxujy :rz_dingxiangnl :rz_panduannl :rz_zongfen :rz_pingguf :rz_jiel :rz_pingguy])
(def suggest [:shys_songc :shys_songcbz :shys_zuoc :shys_zuocbz :shqj_chuangy :shqj_chuangybz :shqj_zhenglyw :shqj_zhenglywbz :shqj_fans :shqj_fansbz :shqj_ruc
        :shqj_rucbz :shzy_shangm :shzy_shangmbz :shzy_yus :shzy_yusbz :shws_yiw :shws_yiwbz :shws_chuangs :shws_chuangsbz :shws_shin :shws_shinbz
        :shdb_meiq :shdb_meiqbz :shdb_shoux :shdb_shouxbz :shdb_feiy :shdb_feiybz :shqt_name1 :shqt_fuwu1 :shqt_fuwu1bz :shqt_name2 :shqt_fuwu2 :shqt_fuwu2bz
        :shqt_name3 :shqt_fuwu3 :shqt_fuwu3bz :ylbj_yufzd :ylbj_yufzdbz :ylbj_yufzhis :ylbj_yufzhisbz :ylxz_fuyao :ylxz_fuyaobz :ylxz_peizhen :ylxz_peizhenbz :ylxz_xueyao
        :ylxz_xueyaobz :ylxz_tiwen :ylxz_tiwenbz :ylkf_zhidao :ylkf_zhidaobz :ylkf_xunlian :ylkf_xunlianbz :ylqt_fuwu1name :ylqt_fuwu1 :ylqt_fuwu1bz :ylqt_fuwu2name
        :ylqt_fuwu2 :ylqt_fuwu2bz :ylqt_fuwu3name :ylqt_fuwu3 :ylqt_fuwu3bz :jz_anzhweix :jz_anzhweixbz :jz_qingxi :jz_qingxibz :jz_shutong :jz_shutongbz
        :jz_qtfuwu1name :jz_qtfuwu1 :jz_qtfuwu1bz :jz_qtfuwu2name :jz_qtfuwu2 :jz_qtfuwu2bz :jz_qtfuwu3name :jz_qtfuwu3 :jz_qtfuwu3bz :jj_hujj :jj_hujjbz :jj_shouj
        :jj_shoujbz :jj_qtfuwu1name :jj_qtfuwu1 :jj_qtfuwu1bz :jj_qtfuwu2name :jj_qtfuwu2 :jj_qtfuwu2bz :jj_qtfuwu3name :jj_qtfuwu3 :jj_qtfuwu3bz :qt_fuwu1name
        :qt_fuwu1 :qt_fuwu1bz :qt_fuwu2name :qt_fuwu2 :qt_fuwu2bz :qt_fuwu3name :qt_fuwu3 :qt_fuwu3bz :qt_fuwu4name :qt_fuwu4 :qt_fuwu4bz :suggestservice :servicebz :jja_id])

(def t_jjylapply "t_jjylapply")
(def t_jjylassessment "t_jjylassessment")
(def t_servicesuggest "t_servicesuggest")
(def approve "approve")


(defn add-audit-apply [request]                                                                        "添加申请"
  (let[params (:params request)
       identityid (:identityid params)
       checkold (count (db/get-oldpeople identityid))
       opdata (select-keys params opofapply)
       applydata (select-keys params applykeys)]
    (if (= checkold 0) (old/add-oldpeople opdata))                                           ;如果老人数据没有此数据，将其添加到老人数据库中
    (db/add-apply (common/timefmt-bef-insert (common/timefmt-bef-insert applydata "birthd") "applydate"))
    (resp/json {:success true :message "apply success"})))

(defn get-apply-byid [request]                                                                          "根据id查询申请信息"
  (let[params (:params request)
       jja_id (:jja_id params)
       applydata (db/get-apply-byid jja_id)]
    (resp/json (common/time-before-list (common/time-before-list applydata "birthd") "applydate"))))

(defn getall-apply [request]                                                                               "查找所有的申请信息"
  (let[params (:params request)
       rows (:rows params)
       page (:page params)
       name (:name params)
       identityid (:identityid params)
       cond (str " and (ishandle != '1' or ishandle is null)" (common/likecond "name" name) (common/likecond "identityid" identityid))
       getresult (common/fenye rows page t_jjylapply cond " order by jja_id ")]
    (resp/json {:total (:total getresult) :rows (common/time-before-list(common/time-before-list (:rows getresult) "birthd") "applydate")})))

(defn  update-apply [request]                                                                           "更新申请信息"
  (let [params (:params request)
        jja_id  (:jja_id params)
        applydata (select-keys params applykeys)]
    (db/update-apply (common/timefmt-bef-insert (common/timefmt-bef-insert applydata "birthd") "applydate") jja_id)
    (resp/json {:success true :message "update apply success"})))

(defn add-assessmessage [request]                                                                         "居家养老信息评估"
  (let[params (:params request)
       assessdata (common/timefmt-bef-insert (common/timefmt-bef-insert (common/timefmt-bef-insert (select-keys params assess) "startdate") "enddate") "operator_date")                                    ;STARTDATE,ENDDATE,OPERATOR_DATE
       suggestdata (select-keys params suggest)                                ;
       ss_id (:ss_id params)
       pg_id (:pg_id params)
       ]
    (println "IIIIIIIIIIIIIIIIIIIIII"  " ss_id:" ss_id  " pg_id:" pg_id  )
    (if (= (count ss_id) 0) (db/insert-suggest suggestdata)  (db/update-suggest suggestdata ss_id))
    (if (= (count pg_id) 0) (db/insert-assess assessdata) (db/update-assess assessdata pg_id))
    (resp/json {:success true :message "assess save success"})))

;BIRTHD,APPLYDATE,STARTDATE,ENDDATE,OPERATOR_DATE

(defn assess-time-format[result]
  (common/time-before-list (common/time-before-list
  (common/time-before-list (common/time-before-list
 (common/time-before-list result "birthd") "applydate") "startdate") "enddate") "operator_date"))

(defn get-assessbyid [request]                                                                           "获取评估信息"
  (let[params (:params request)
        jja_id (:jja_id params)
        sql (str "select a.*,t.*,s.* from
                    (SELECT * FROM T_JJYLAPPLY WHERE jja_id = " jja_id ") a
                      left join T_JJYLASSESSMENT t  on a.jja_id=t.jja_id
                      left join T_SERVICESUGGEST s  on a.jja_id=s.jja_id")
        data (db/get-results-bysql sql)]
    ;(println "SSSSSSSSSSS" starttime " , "  endtime " " chatime)
    (resp/json (assess-time-format data))))



(defn assess-complete [request]                                                                        "评估完成"
  (let[params (:params request)
       bstablepk  (:jja_id params)
       bstablename "t_jjylapply"
       bstablepkname      "jja_id"
       status   "1"
       aulevel     "0"
       auflag   "评估完成"
       bstime      (common/get-nowtime)
       auuser   (:username (session/get :usermsg))
       ;AUDESC
      ;DVCODE
      appoperators  auuser
      messagebrief  (str "姓名：" (:name params) ",身份证："(:identityid params) )
      approvedata {:bstablepk bstablepk :bstablename bstablename :bstablepkname bstablepkname :status status :aulevel aulevel :auflag auflag :bstime bstime :auuser auuser :appoperators appoperators :messagebrief messagebrief}
       ]
    (add-assessmessage request)                                                                     ;保存评估信息
    (db/add-approve approvedata)                                                                   ;添加到审核流程
    (db/update-apply {:ishandle "1"} bstablepk)                                                ;更改申请表状态
    (resp/json {:success true :message "assess complete"})))
