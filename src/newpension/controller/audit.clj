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
               [clojure.data.json :as json]
               [newpension.layout :as layout]))

(def applykeys [:districtname :districtid :name :identityid :gender :birthd :nation :culture :birthplace :marriage :live :economy :age :registration :address :postcode :telephone :mobilephone
            :agent :oprelation :agentaddr :agentphone :agentmobilephone :lr_id :ishandle :applydate :communityopinion :opiniontime :streetreview :reviewtime
            :countyaudit :audittime :rm_reason :rm_communityopinion :rm_opiniontime :rm_streetreview :rm_reviewtime :rm_countyaudit :rm_audittime
            :familynum :allowanceid :old_type :live_type :life_ability])
(def opofapply [:name :identityid :gender :birthd :nation :culture :marriage :live :economy :age :registration :address :telephone :mobilephone])
(def  assess  [:jja_id :sh_jings :sh_yid :sh_weis :sh_ruc :sh_xiz :sh_xingz :sh_lout :sh_chuany :sh_dab :sh_xiaob :sh_zongf :sh_pingguf :sh_jiel :sh_pingguy
         :jj_shour :jj_fenl :jj_leix :jj_pingguf :jj_pingguy :jz_fenl :jz_zhaol :jz_pingguf :jz_pingguy :nl_fenl :nl_pingguf :nl_pingguy :gx_laom :gx_youf :gx_youf_kind
         :gx_chunjg :gx_ganb :gx_pingguf :gx_pingguy :cz_shil :cz_tingl :cz_zhit :cz_qit :cz_pingguy :zf_lianzf :zf_zhulf :zf_shiyf :zf_shangpf :zf_zijf :zf_qit :zf_pingguy
         :jb_gaoxy :jb_xinlsj :jb_guanxb :jb_xinlshic :jb_manxzhiqguany :jb_feiqz :jb_feixb :jb_feiy :jb_naoxguanyw :jb_pajshensz :jb_laonchidz :jb_youyz :jb_tangnb
         :jb_tongf :jb_zhitguz :jb_jianzy :jb_jinzb :jb_leifshigjiey :jb_gandjib :jb_bainz :jb_qinguany :jb_shiwmoxguanjib :jb_tangnbingswangmbingb :jb_shenzjib
         :jb_qit1name :jb_qit2name :jb_qit3name :jb_pingguy :jb_beiz :pinggusum :standard :startdate :enddate :facilitator :content :amount :operator_date :active :zf_pingguf
         :cz_pingguf :jb_pingguf :zf_shiyingfnum :zf_shangpinfnum :zf_zijianfnum :jb_qita1 :jb_qita2 :jb_qita3 :rz_jinqijy :rz_chengxujy :rz_dingxiangnl :rz_panduannl :rz_zongfen
         :rz_pingguf :rz_jiel :rz_pingguy :pgy_dianhua :pgy_danwei :jb_exingzhl :pinggy :finishdate :assesstype :servicetime :monthsubsidy :hospitalsubsidy :jdep_id :s_id])
(def suggest [:shys_songc :shys_songcbz :shys_zuoc :shys_zuocbz :shqj_chuangy :shqj_chuangybz :shqj_zhenglyw :shqj_zhenglywbz :shqj_fans :shqj_fansbz :shqj_ruc
        :shqj_rucbz :shzy_shangm :shzy_shangmbz :shzy_yus :shzy_yusbz :shws_yiw :shws_yiwbz :shws_chuangs :shws_chuangsbz :shws_shin :shws_shinbz
        :shdb_meiq :shdb_meiqbz :shdb_shoux :shdb_shouxbz :shdb_feiy :shdb_feiybz :shqt_name1 :shqt_fuwu1 :shqt_fuwu1bz :shqt_name2 :shqt_fuwu2 :shqt_fuwu2bz
        :shqt_name3 :shqt_fuwu3 :shqt_fuwu3bz :ylbj_yufzd :ylbj_yufzdbz :ylbj_yufzhis :ylbj_yufzhisbz :ylxz_fuyao :ylxz_fuyaobz :ylxz_peizhen :ylxz_peizhenbz :ylxz_xueyao
        :ylxz_xueyaobz :ylxz_tiwen :ylxz_tiwenbz :ylkf_zhidao :ylkf_zhidaobz :ylkf_xunlian :ylkf_xunlianbz :ylqt_fuwu1name :ylqt_fuwu1 :ylqt_fuwu1bz :ylqt_fuwu2name
        :ylqt_fuwu2 :ylqt_fuwu2bz :ylqt_fuwu3name :ylqt_fuwu3 :ylqt_fuwu3bz :jz_anzhweix :jz_anzhweixbz :jz_qingxi :jz_qingxibz :jz_shutong :jz_shutongbz
        :jz_qtfuwu1name :jz_qtfuwu1 :jz_qtfuwu1bz :jz_qtfuwu2name :jz_qtfuwu2 :jz_qtfuwu2bz :jz_qtfuwu3name :jz_qtfuwu3 :jz_qtfuwu3bz :jj_hujj :jj_hujjbz :jj_shouj
        :jj_shoujbz :jj_qtfuwu1name :jj_qtfuwu1 :jj_qtfuwu1bz :jj_qtfuwu2name :jj_qtfuwu2 :jj_qtfuwu2bz :jj_qtfuwu3name :jj_qtfuwu3 :jj_qtfuwu3bz :qt_fuwu1name
        :qt_fuwu1 :qt_fuwu1bz :qt_fuwu2name :qt_fuwu2 :qt_fuwu2bz :qt_fuwu3name :qt_fuwu3 :qt_fuwu3bz :qt_fuwu4name :qt_fuwu4 :qt_fuwu4bz :suggestservice :servicebz :jja_id])
(def approvekeys [:bstablepk :bstablename :status :aulevel :auflag :bstime :auuser :audesc :dvcode :appoperators :messagebrief :bstablepkname])
(def jjyldepartment [:departid :departname :responsible :telephone :corporate :founddata :servicearea :certificatenum :specialtynum :servicenum :registnumber :departcode
                     :businesslicense :taxnumber :billingunit :billingprice :starttime  :registnature :address :dailyavgnum  :departoverview :servicecontent])
(def depservice [:dep_id :servicername :servicephone :serviceaddress])
(def dolemoney [:jja_id :bsnyue :monthsubsidy :servicetime :hospitalsubsidy])
(def hospitalsubsidy [:hospital_days :subsidy_money :hospital_desc :hcommunityopinion :hopiniontime :hstreetreview :hreviewtime :hcountyaudit])

(def t_jjylapply "t_jjylapply")
(def t_jjylassessment "t_jjylassessment")
(def t_servicesuggest "t_servicesuggest")
(def approve "approve")
(def t_jjyldepartment "t_jjyldepartment")
(def t_depservice "t_depservice")
(def t_hospitalsubsidy "t_hospitalsubsidy")


(defn add-audit-apply [request]                                                                        "添加申请"
  (let[params (:params request)
       identityid (:identityid params)
       checkold (count (db/get-oldpeople identityid))
       opdata (select-keys params opofapply)
       applydata (select-keys params applykeys)]
    (println "TTTTTTT" checkold  "OOOOOOO"  opdata  (= checkold 0))
    (if (= checkold 0) (old/create-old request))                                           ;如果老人数据没有此数据，将其添加到老人数据库中
    (db/add-apply (common/timefmt-bef-insert (common/timefmt-bef-insert applydata "birthd") "applydate"))
;    (resp/json {:success true :message "apply success"})
    (str "true")
    ))

(defn applydateformat [data]
  (common/time-formatymd-before-list(common/time-formatymd-before-list(common/time-formatymd-before-list(common/time-formatymd-before-list
(common/time-formatymd-before-list(common/time-formatymd-before-list (common/time-before-list (common/time-before-list data "birthd")
"applydate")"opiniontime")"reviewtime")"audittime")"rm_opiniontime")"rm_reviewtime")"rm_audittime"))

(defn applydate-formatin [data]
  (common/timefmt-bef-insert(common/timefmt-bef-insert(common/timefmt-bef-insert(common/timefmt-bef-insert
  (common/timefmt-bef-insert(common/timefmt-bef-insert(common/timefmt-bef-insert (common/time-before-list data "birthd")
  "applydate")"opiniontime")"reviewtime")"audittime")"rm_opiniontime")"rm_reviewtime")"rm_audittime"))

(defn get-apply-byid [request]                                                                          "根据id查询申请信息"
  (let[params (:params request)
       jja_id (:jja_id params)
       applydata (db/get-apply-byid jja_id)]
    (resp/json (applydateformat applydata))))

(defn getall-apply [request]                                                                               "查找所有的申请信息"
  (let[params (:params request)
       rows (:rows params)
       page (:page params)
       name (:name params)
       identityid (:identityid params)
       cond (str " and ( ishandle is null or ishandle = 'r' )" (common/likecond "name" name) (common/likecond "identityid" identityid))
       getresult (common/fenye rows page t_jjylapply "*" cond " order by jja_id desc ")]
    (resp/json {:total (:total getresult) :rows (common/time-before-list(common/time-before-list (:rows getresult) "birthd") "applydate")})))



(defn  update-apply [request]                                                                           "更新申请信息"
  (let [params (:params request)
        jja_id  (:jja_id params)
        applydata (select-keys params applykeys)]
    (db/update-apply (common/timefmt-bef-insert (common/timefmt-bef-insert applydata "birthd") "applydate") jja_id)
;    (resp/json {:success true :message "update apply success"})
    (str "true")
    ))

(defn add-assessmessage [request]                                                                         "居家养老信息评估"
  (let[params (:params request)
       assessdata (common/timefmt-bef-insert(common/timefmt-bef-insert (common/timefmt-bef-insert (common/timefmt-bef-insert (select-keys params assess) "startdate") "enddate") "operator_date")"finishdate")                                    ;STARTDATE,ENDDATE,OPERATOR_DATE
       suggestdata (select-keys params suggest)                                ;
       ss_id (:ss_id params)
       pg_id (:pg_id params)
       ]
    (println "IIIIIIIIIIIIIIIIIIIIII"  " ss_id:" ss_id  " pg_id:" pg_id  )
    (if (= (count ss_id) 0) (db/insert-suggest suggestdata)  (db/update-suggest suggestdata ss_id))
    (if (= (count pg_id) 0) (db/insert-assess assessdata) (db/update-assess assessdata pg_id))
;    (resp/json {:success true :message "assess save success"})
    (str "true")
    ))

;BIRTHD,APPLYDATE,STARTDATE,ENDDATE,OPERATOR_DATE ,opiniontime reviewtime  audittime rm_opiniontime rm_reviewtime rm_audittime

(defn assess-time-format[result]
  (common/time-before-list(common/time-formatymd-before-list(common/time-formatymd-before-list(common/time-formatymd-before-list(common/time-formatymd-before-list(common/time-formatymd-before-list
(common/time-formatymd-before-list(common/time-before-list (common/time-before-list(common/time-before-list (common/time-before-list
 (common/time-before-list result "birthd") "applydate") "startdate") "enddate") "operator_date")"opiniontime")
  "reviewtime")"audittime")"rm_opiniontime") "rm_reviewtime" )"rm_audittime")"finishdate"))

(defn get-assessbyid [request]                                                                           "获取评估信息"
  (let[params (:params request)
        jja_id (:jja_id params)
        ;sql (str "select a.jja_id,t.jja_id,s.jja_id from
        sql (str "select a.*,t.*,s.* from

                    (SELECT * FROM T_JJYLAPPLY WHERE jja_id = " jja_id ") a
                      left join T_JJYLASSESSMENT t  on a.jja_id=t.jja_id
                      left join T_SERVICESUGGEST s  on a.jja_id=s.jja_id")
        data (db/get-results-bysql sql)]
    ;(println "SSSSSSSSSSS" starttime " , "  endtime " " chatime)
    (resp/json (assess-time-format data))))

(defn get-assessbyid2 [request]                                                                           "获取评估信息"
  (let[params (:params request)
       jja_id (:jja_id params)
       ;sql (str "select a.jja_id,t.jja_id,s.jja_id from
       sql (str "select a.*,t.*,s.* from

                    (SELECT * FROM T_JJYLAPPLY WHERE jja_id = " jja_id ") a
                      left join T_JJYLASSESSMENT t  on a.jja_id=t.jja_id
                      left join T_SERVICESUGGEST s  on a.jja_id=s.jja_id")
       data (db/get-results-bysql sql)]
    ;(println "SSSSSSSSSSS" starttime " , "  endtime " " chatime)
    (assess-time-format data)))



(defn assess-complete [request]                                                                        "评估完成"
  (let[params (:params request)
       ishandle (:ishandle params)
       communityopinion (:communityopinion params)                                         ;;社区意见
       opiniontime      (common/get-nowtime)                                                   ;;提交时间
       bstablepk  (:jja_id params)
       bstablename "t_jjylapply"
       bstablepkname      "jja_id"
       status   "1"
       aulevel    (if (= ishandle "r") "4" "1")
       auflag   "评估完成"
       bstime      (common/get-nowtime)
       auuser   (:username (session/get :usermsg))
       ;AUDESC
      ;DVCODE
      appoperators  auuser
      messagebrief  (str "姓名：" (:name params) ",身份证："(:identityid params) )
      approvedata {:bstablepk bstablepk :bstablename bstablename :bstablepkname bstablepkname :status status :aulevel aulevel :auflag auflag :bstime bstime :auuser auuser :appoperators appoperators :messagebrief messagebrief :audesc communityopinion}
       ]
    (add-assessmessage request)                                                                     ;保存评估信息
    (db/add-approve approvedata)                                                                   ;添加到审核流程
    (db/update-apply {:ishandle "1" :communityopinion communityopinion :opiniontime opiniontime} bstablepk)                  ;更改申请表状态,添加社区意见
;    (resp/json {:success true :message "assess complete"})
    (str "true")
    ))

(defn get-assessaudit [request]                                                                           "查询评估信息中待审核的信息"
  (let[params (:params request)
       rows (:rows params)
       page (:page params)
       cond (str " and bstablename = 't_jjylapply' and status = '1' AND aulevel != '7' AND aulevel != '8' ")
       getresult (common/fenye rows page approve "*" cond " order by sh_id desc ")]
    (resp/json {:total (:total getresult) :rows (common/time-formatymd-before-list (:rows getresult)  "bstime")})))


#_(defn assessaudit0 [params]                                                                              "社区提交意见"
  (let [approvedata (select-keys params approvekeys)
        communityopinion (:audesc params)                                         ;;社区意见
        opiniontime      (common/get-nowtime)                                                   ;;提交时间
        ;audesc       communityopinion
        ;dvcode
        jja_id (:bstablepk params)
        sh_id   (:sh_id params)
        auuser (:username (session/get :usermsg))
        newappdata (conj approvedata {:aulevel "1" :status "1" :auflag "社区意见提交" :bstime opiniontime :auuser auuser :audesc communityopinion })
        ]
    (db/update-approve sh_id {:status "0"})                                                                                         ;;当前审核信息更改为历史状态
    (db/update-approveby-lrid jja_id "t_jjylapply")                                                                              ;;如果是评估不通过的，修改之前的审核表状态
    (db/add-approve newappdata)                                                                                                       ;;添加新的审核信息状态
    (db/update-apply {:communityopinion communityopinion :opiniontime opiniontime} jja_id)              ;;将社区意见添加申请表中
    (str "社区意见"))
)

(defn assessaudit1 [params]                                                                              "街镇审查"
  (let[aulevel (:aulevel params)
       issuccess (:issuccess params)
       approvedata (select-keys params approvekeys)
       streetreview (:audesc params)
       reviewtime (common/get-nowtime)
       jja_id (:bstablepk params)
       sh_id   (:sh_id params)
       newaulevel (if (= issuccess "0") (if (= aulevel "4") "5" "2") (if (= aulevel "4") "-3" "0"))
       auflag (if (= issuccess "0") "街镇审查通过" "街镇审查未通过")
       status  (if (= issuccess "0") "1" "0")
       auuser (:username (session/get :usermsg))
       ishandle   (if (= aulevel "4") "r" nil)
       newappdata (conj approvedata {:aulevel newaulevel :auflag auflag :status status :bstime reviewtime :auuser auuser :audesc streetreview})]
    (db/update-approve sh_id {:status "0"})                                                                                         ;;当前审核信息更改为历史状态
    (db/add-approve newappdata)                                                                                                       ;;添加新的审核信息状态
    (if (= issuccess "0") (db/update-apply {:streetreview streetreview :reviewtime reviewtime} jja_id)
                                        (db/update-apply {:streetreview streetreview :reviewtime reviewtime :ishandle ishandle} jja_id))               ;;将社区意见添加申请表中
    (str "街镇审查")))

(defn assessaudit2 [params]                                                                              "县民政局审核"
  (let[issuccess (:issuccess params)
       aulevel (:aulevel params)
       approvedata (select-keys params approvekeys)
       countyaudit (:audesc params)
       audittime (common/get-nowtime)
       jja_id (:bstablepk params)
       sh_id   (:sh_id params)
       newaulevel (if (= issuccess "0") (if (= aulevel "5") "6" "3") (if (= aulevel "5") "-3" "0"))
       auflag (if (= issuccess "0") "县民政局审核通过" "县民政局审核未通过")
       ;status  (if (= issuccess "0") "1" "0")
       auuser (:username (session/get :usermsg))
       ishandle (if (= aulevel "5") "n" nil)
       newappdata (conj approvedata {:aulevel newaulevel :status "0" :auflag auflag :bstime audittime :auuser auuser :audesc countyaudit})]
    (db/update-approve sh_id {:status "0"})                                                                                         ;;当前审核信息更改为历史状态
    (db/add-approve newappdata)                                                                                                       ;;添加新的审核信息状态
    (if (= issuccess "0") (db/update-apply {:countyaudit countyaudit :audittime audittime :ishandle "y"} jja_id)
                                        (db/update-apply {:countyaudit countyaudit :audittime audittime :ishandle ishandle} jja_id) )             ;;将社区意见添加申请表中
    (str "县民政局审核")))

(defn assess-audit [request]                                                                   "评估审核"
  (let[params (:params request)
       ;bstablepk (:bstablepk params)
       ;sh_id (:sh_id params)
       aulevel     (:aulevel params)
       ]
   ; (println "AAAAAAAAAAAAAAA"  aulevel "  "  (= aulevel "0")  params)
    (cond
      ;;(= aulevel "0")       (assessaudit0 params)
      (= aulevel "1")        (assessaudit1 params)
      (= aulevel "2")        (assessaudit2 params)
      (= aulevel "4")        (assessaudit1 params)
      (= aulevel "5")        (assessaudit2 params)
      )
    (resp/json {:success true :message "audit success"})))

(defn get-audtidata [request]                                                            "获取审核通过的数据"
  (let[params (:params request)
       rows (:rows params)
       page (:page params)
       name (:name params)
       identityid (:identityid params)
       cond (str " and ishandle = 'y'" (common/likecond "name" name) (common/likecond "identityid" identityid))
       getresult (common/fenye rows page t_jjylapply "*" cond " order by jja_id desc")]
    (resp/json {:total (:total getresult) :rows (common/time-before-list(common/time-before-list (:rows getresult) "birthd") "applydate")})))


(defn remove-submit [request]
  (let[params (:params request)
       jja_id (:jja_id params)
       rm_communityopinion (:rm_communityopinion params)
       jjyldata (select-keys params jjyldepartment)
       rm_opiniontime (common/get-nowtime)
       upjjyldata (conj jjyldata {:rm_opiniontime rm_opiniontime :ishandle "1"})
       appsql (str "select a.* from approve a where a.bstablepk = " jja_id " and a.bstablename = 't_jjylapply' and a.aulevel = 3")
       appdata (first(db/get-results-bysql appsql))
       auuser   (:username (session/get :usermsg))
       ;AUDESC
       ;DVCODE
       approvedata (conj appdata {:status   "1" :aulevel  "7" :auflag "社区注销意见"  :bstime rm_opiniontime :auuser auuser :audesc rm_communityopinion})
       ]
    (db/update-apply upjjyldata jja_id)     ;;更改申请表状态
    (db/add-approve approvedata)                                                                     ;;添加到注销审核流程
    (resp/json {:success true :message "remove audit submit"})))

(defn get-removeaudit [request]
  (let[params (:params request)
       rows (:rows params)
       page (:page params)
       cond (str " and bstablename = 't_jjylapply' and status = '1' AND (aulevel = 7 OR aulevel = 8)")
       getresult (common/fenye rows page approve "*" cond " order by sh_id desc ")]
    (resp/json {:total (:total getresult) :rows (common/time-formatymd-before-list (:rows getresult)  "bstime")})))


(defn assessaudit7 [params]                                                                              "街镇审查"
  (let[issuccess (:issuccess params)
       approvedata (select-keys params approvekeys)
       rm_streetreview (:audesc params)
       rm_reviewtime (common/get-nowtime)
       jja_id (:bstablepk params)
       sh_id   (:sh_id params)
       aulevel (if (= issuccess "0") "8" "-6")
       auflag (if (= issuccess "0") "街镇审查通过" "街镇审查未通过")
       status  (if (= issuccess "0") "1" "0")
       auuser (:username (session/get :usermsg))
       newappdata (conj approvedata {:aulevel aulevel :auflag auflag :status status :bstime rm_reviewtime :auuser auuser :audesc rm_streetreview})]
    (db/update-approve sh_id {:status "0"})                                                                                         ;;当前审核信息更改为历史状态
    (db/add-approve newappdata)                                                                                                       ;;添加新的审核信息状态
    (if (= issuccess "0") (db/update-apply {:rm_streetreview rm_streetreview :rm_reviewtime rm_reviewtime} jja_id)
      (db/update-apply {:rm_streetreview rm_streetreview :rm_reviewtime rm_reviewtime :ishandle "y"} jja_id))               ;;将社区意见添加申请表中
    (str "街镇审查")))

(defn assessaudit8 [params]                                                                              "县民政局审核"
  (let[issuccess (:issuccess params)
       approvedata (select-keys params approvekeys)
       rm_countyaudit (:audesc params)
       rm_audittime (common/get-nowtime)
       jja_id (:bstablepk params)
       sh_id   (:sh_id params)
       aulevel (if (= issuccess "0") "9" "-6")
       auflag (if (= issuccess "0") "县民政局审核通过" "县民政局审核未通过")
       ;status  (if (= issuccess "0") "1" "0")
       auuser (:username (session/get :usermsg))
       newappdata (conj approvedata {:aulevel aulevel :status "0" :auflag auflag :bstime rm_audittime :auuser auuser :audesc rm_countyaudit})]
    (db/update-approve sh_id {:status "0"})                                                                                         ;;当前审核信息更改为历史状态
    (db/add-approve newappdata)                                                                                                       ;;添加新的审核信息状态
    (if (= issuccess "0") (db/update-apply {:rm_countyaudit rm_countyaudit :rm_audittime rm_audittime :ishandle "n"} jja_id)
      (db/update-apply {:rm_countyaudit rm_countyaudit :rm_audittime rm_audittime :ishandle "y"} jja_id) )             ;;将社区意见添加申请表中
    (str "县民政局审核")))

(defn remove-audit [request]
  (let[params (:params request)
       aulevel   (:aulevel params)]
    (cond
      (= aulevel "7")        (assessaudit7 params)
      (= aulevel "8")        (assessaudit8 params)
      )
    (resp/json {:success true :message "remove audit success"})))

(defn  reassess [request]                                                                           "更新信息重新评估"
  (let [params (:params request)
        jja_id  (:jja_id params)
        changedata {:communityopinion nil :opiniontime nil :streetreview nil :reviewtime nil :countyaudit nil :audittime nil :ishandle "r"}
        applydata (conj (select-keys params applykeys) changedata)
        ]
    (db/update-apply (common/timefmt-bef-insert (common/timefmt-bef-insert applydata "birthd") "applydate") jja_id)
;    (resp/json {:success true :message "reassess apply success"})
    (str "true")
    ))

(defn add-jjyldepart [request]
  (let[params (:params request)
       depdata (common/timefmt-bef-insert(common/timefmt-bef-insert(select-keys params jjyldepartment) "founddata" )"starttime")]
    (db/add-jjyldepart depdata)
;    (resp/json {:success true :message "jjyldepart add success"})
    (str "true")
    ))

(defn getall-jjyldepart [request]
  (let[params (:params request)
       departname (:departname params)
       rows (:rows params)
       page (:page params)
       cond (str  (common/likecond "departname" departname))
       getresult (common/fenye rows page t_jjyldepartment "*" cond " order by jdep_id desc ")]
    (resp/json {:total (:total getresult) :rows (common/time-before-list(common/time-before-list (:rows getresult) "founddata") "starttime")})))

(defn get-jjyldepartbyid [request]
  (let[params (:params request)
       jdep_id (:jdep_id params)
       ]
    (resp/json (db/get-jjyldepartbyid jdep_id))))

(defn update-jjyldepart [request]
  (let[params (:params request)
       jdep_id (:jdep_id params)
       departdata (common/timefmt-bef-insert (common/timefmt-bef-insert (select-keys params jjyldepartment) "founddata") "starttime")]
    (db/update-jjyldepart departdata jdep_id)
;    (resp/json {:success true :message "jjyldepart update success"})
    (str "true")
    ))

(defn add-depservice [request]
  (let[params (:params request)
       depservicedata (select-keys params depservice)
       ]
    (db/add-depservice depservicedata)
    (str "true")))

(defn getall-depservice [request]
  (let[params (:params request)
       rows (:rows params)
       page (:page params)
      departname (:departname params)
      servicername (:servicername params)
      cond (str  (common/likecond "departname" departname) (common/likecond "servicername" servicername))
      getresult (common/fenye rows page " (SELECT s.*,p.departname FROM t_depservice s,t_jjyldepartment p where s.DEP_ID = p.JDEP_ID) " "*" cond " order by s_id desc ")
      ]
    (resp/json {:total (:total getresult) :rows (:rows getresult)})))

(defn update-dsbyid [request]                                   "更新结构服务人员信息"
  (let[params (:params request)
       s_id (:s_id params)
       dsdata (select-keys params depservice)]
    (db/update-dsbyid dsdata s_id)
    (str "true")))

(defn get-depservicebyid [request]                            "获取结构服务人员信息"
  (let[params (:params request)
       s_id (:s_id params)]
    (resp/json (db/get-depservicebyid s_id))))


(defn get-hospitaldata [request]                                                            "获取审核通过的数据"
  (let[params (:params request)
       rows (:rows params)
       page (:page params)
       name (:name params)
       identityid (:identityid params)
       cond (str " and ishandle = 'y'" (common/likecond "name" name) (common/likecond "identityid" identityid) " and jja_id NOT IN (SELECT jja_id FROM T_HOSPITALSUBSIDY WHERE ISPROVIDE IS NULL)")
       getresult (common/fenye rows page t_jjylapply "*" cond " order by jja_id desc")]
    (resp/json {:total (:total getresult) :rows (common/time-before-list(common/time-before-list (:rows getresult) "birthd") "applydate")})))

(defn apply-hospitalsubsidy  [request]                                                 "住院补助申请"
  (let[params (:params request)
        hcommunityopinion (:hcommunityopinion params)
        appoperators (:username (session/get :usermsg))
        messagebrief  (str  "姓名：" (:name params) ",身份证：" (:identityid params))
        jjyldata (select-keys params jjyldepartment)
        hsdata (select-keys params hospitalsubsidy)
        hs_id  (:max(first(db/get-hsmaxid)))
        jja_id (:jja_id params)
        newhs_id (if hs_id (inc hs_id)  10)
        appdata {:bstablepk newhs_id :bstablename "t_hospitalsubsidy" :status 1 :aulevel 1 :auflag "住院补助申请提交" :bstime (common/get-nowtime)  :audesc hcommunityopinion :appoperators appoperators :messagebrief messagebrief :bstablepkname "hs_id"}
        ]
    (db/add-hospitalsubsidy (conj hsdata {:hs_id newhs_id :jja_id jja_id}))             ;保存住院申请信息
    (db/update-jjyldepart jjyldata jja_id)                                                           ;保存老人信息
    (db/add-approve appdata)                                                                           ;将申请信息添加到审核流程中
    (str "true")))

(defn hospitalsubsidy-audit [request]
  (let[params (:params request)
       rows (:rows params)
       page (:page params)
       cond (str " and bstablename = 't_hospitalsubsidy' and status = '1' ")
       getresult (common/fenye rows page approve "*" cond " order by sh_id desc ")]
    (resp/json {:total (:total getresult) :rows (common/time-formatymd-before-list (:rows getresult)  "bstime")})))


(defn getqualifyop [request]
  (let[params (:params request)
        name (:name request)
        rows (:rows params)
        page (:page params)
        identityid (:identityid params)
        bsnyue (clojure.string/trim (:bsnyue params))
        ywq (if (> (count bsnyue) 0) bsnyue (common/ywq))
        condname (if (> (count name) 0) (str " and j.name like '%" name "%' "))
        condid (if (> (count identityid) 0) (str " and j.identityid like '%" identityid "%' "))
        qopsql (str "(SELECT j.JJA_ID,j.NAME,j.IDENTITYID,j.GENDER,j.BIRTHD,j.ADDRESS,j.AGE,a.MONTHSUBSIDY,a.SERVICETIME,a.HOSPITALSUBSIDY
FROM T_JJYLAPPLY j,T_JJYLASSESSMENT a WHERE j.ishandle = 'y' " condname  condid " AND j.JJA_ID = a.JJA_ID AND j.jja_id NOT IN
(SELECT jja_id FROM t_dolemoney WHERE bsnyue = '" ywq "'))")
        getresult (common/fenye rows page qopsql "*" "" " order by JJA_ID desc ")]
   ; (resp/json (common/time-before-list(db/get-results-bysql qopsql)"birthd"))
    (resp/json {:total (:total getresult) :rows (common/time-before-list (:rows getresult) "birthd")})))

(defn getcompleteqop [request]
  (let[params (:params request)
        name (:name params)
        identityid (:identityid params)
        bsnyue (:bsnyue params)
        rows (:rows params)
        page (:page params)
        condname (if (> (count name) 0) (str " AND j.NAME LIKE '%" name "%' ") )
        condid   (if (> (count identityid) 0)  (str " AND j.IDENTITYID LIKE '%" identityid "%' ") )
        condbsnyue  (if (> (count bsnyue) 0)  (str " AND t.BSNYUE LIKE '%" bsnyue "%' ") )
        cqopsql (str "( select t.*,j.NAME,j.IDENTITYID,j.GENDER,j.BIRTHD,j.ADDRESS,j.AGE
from t_dolemoney t ,T_JJYLAPPLY j WHERE t.JJA_ID = j.JJA_ID "condname condid condbsnyue ")")
        getresult (common/fenye rows page cqopsql "*" "" " order by doleid desc ")]
    ;(resp/json (common/time-before-list(db/get-results-bysql cqopsql)"birthd"))
    (resp/json {:total (:total getresult) :rows (common/time-before-list (:rows getresult) "birthd")})))

(defn sendmoney [request]
  (let[params (:params request)
       bsnyue (:bsnyue params)
       doledata   (json/read-str  (:dolledata params) :key-fn keyword)
       doledatas (map #(conj (select-keys % dolemoney) {:bsnyue bsnyue}) doledata)
       ;doledata (map #(select-keys % dolemoney) (:dolledata params))
       ]
   ; (println "DDDDDDDDDDDDDDD" bsnyue  doledatas (count doledatas) )
    (if (> (count doledatas) 0) (db/sendmoney (vec doledatas)))
    (str "true")))

(defn resendmoney [request]
  (let[params (:params request)
       doleid (:doleid params)
       bsnyue  (:bsnyue params)]
    (if (> (count doleid) 0)
         (db/resendmoney "doleid" doleid)
         (if (> (count bsnyue) 0)  (db/resendmoney "bsnyue" bsnyue)))
    (str "true")))



(defn testtime [request]
  (resp/json (:max(first(db/get-hsmaxid)))))







