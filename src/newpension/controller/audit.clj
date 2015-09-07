(ns newpension.controller.audit
  (:use compojure.core)
  (:use korma.core
        [korma.db :only [oracle]])
  (:require [newpension.models.db :as db]
               [newpension.common.common :as common]
               [newpension.controller.old :as old]
    ; [newpension.models.schema :as schema]
               [noir.response :as resp]
               [noir.session :as session]
    ;  [clj-time.local :as l]
    ;  [clj-time.coerce :as c]
    ;   [noir.io :as io]
               [clojure.string :as strs]
               [clojure.data.json :as json]
    ;      [newpension.layout :as layout]
               ))

(def applykeys [:name :identityid :gender :birthd :nation :culture :birthplace :marriage :live :economy :age :registration :address :postcode :telephone :mobilephone :agent
                :oprelation :agentaddr :agentphone :agentmobilephone :lr_id :ishandle :applydate :communityopinion :opiniontime :streetreview :reviewtime :countyaudit :audittime
                :rm_reason :rm_communityopinion :rm_opiniontime :rm_streetreview :rm_reviewtime :rm_countyaudit :rm_audittime :districtid :districtname :familynum :allowanceid
                :old_type :live_type :life_ability :userdistrictid :type :gt_name1 :gt_age1 :gt_relation1 :gt_workplace1 :gt_address1 :gt_monthincome1 :gt_name2 :gt_age2 :gt_relation2
                :gt_workplace2 :gt_address2 :gt_monthincome2 :gt_name3 :gt_age3 :gt_relation3 :gt_workplace3 :gt_address3 :gt_monthincome3 :sy_name1 :sy_age1 :sy_relation1 :sy_workplace1
                :sy_address1 :sy_monthincome1 :sy_name2 :sy_age2 :sy_relation2 :sy_workplace2 :sy_address2 :sy_monthincome2 :sy_name3 :sy_age3 :sy_relation3 :sy_workplace3 :sy_address3
                :sy_monthincome3 :servicetime :monthsubsidy :hospitalsubsidy :jdep_id :s_id :fw_type :jg_money :jj_time :lowmarginid :household :gt_isretire1 :gt_phone1 :gt_isretire2 :gt_phone2 :gt_isretire3 :gt_phone3 :sy_isretire1 :sy_phone1 :sy_isretire2 :sy_phone2 :sy_isretire3 :sy_phone3 :applycontent :apply_type])
(def opofapply [:name :identityid :gender :birthd :nation :culture :marriage :live :economy :age :registration :address :telephone :mobilephone])
(def  assess  [:jja_id :sh_jings :sh_yid :sh_weis :sh_ruc :sh_xiz :sh_xingz :sh_lout :sh_chuany :sh_dab :sh_xiaob :sh_zongf :sh_pingguf :sh_jiel :sh_pingguy
         :jj_shour :jj_fenl :jj_leix :jj_pingguf :jj_pingguy :jz_fenl :jz_zhaol :jz_pingguf :jz_pingguy :nl_fenl :nl_pingguf :nl_pingguy :gx_laom :gx_youf :gx_youf_kind
         :gx_chunjg :gx_ganb :gx_pingguf :gx_pingguy :cz_shil :cz_tingl :cz_zhit :cz_qit :cz_pingguy :zf_lianzf :zf_zhulf :zf_shiyf :zf_shangpf :zf_zijf :zf_qit :zf_pingguy
         :jb_gaoxy :jb_xinlsj :jb_guanxb :jb_xinlshic :jb_manxzhiqguany :jb_feiqz :jb_feixb :jb_feiy :jb_naoxguanyw :jb_pajshensz :jb_laonchidz :jb_youyz :jb_tangnb
         :jb_tongf :jb_zhitguz :jb_jianzy :jb_jinzb :jb_leifshigjiey :jb_gandjib :jb_bainz :jb_qinguany :jb_shiwmoxguanjib :jb_tangnbingswangmbingb :jb_shenzjib
         :jb_qit1name :jb_qit2name :jb_qit3name :jb_pingguy :jb_beiz :pinggusum :standard :startdate :enddate :facilitator :content :amount :operator_date :active :zf_pingguf
         :cz_pingguf :jb_pingguf :zf_shiyingfnum :zf_shangpinfnum :zf_zijianfnum :jb_qita1 :jb_qita2 :jb_qita3 :rz_jinqijy :rz_chengxujy :rz_dingxiangnl :rz_panduannl :rz_zongfen
         :rz_pingguf :rz_jiel :rz_pingguy :pgy_dianhua :pgy_danwei :jb_exingzhl :pinggy :finishdate :assesstype :servicetime2 :monthsubsidy2 :hospitalsubsidy2 :jdep_id2 :s_id2 :jdjy_allowance :jdjy_servicetime :jdjy_servicecontent])
(def suggest [:shys_songc :shys_songcbz :shys_zuoc :shys_zuocbz :shqj_chuangy :shqj_chuangybz :shqj_zhenglyw :shqj_zhenglywbz :shqj_fans :shqj_fansbz :shqj_ruc
        :shqj_rucbz :shzy_shangm :shzy_shangmbz :shzy_yus :shzy_yusbz :shws_yiw :shws_yiwbz :shws_chuangs :shws_chuangsbz :shws_shin :shws_shinbz
        :shdb_meiq :shdb_meiqbz :shdb_shoux :shdb_shouxbz :shdb_feiy :shdb_feiybz :shqt_name1 :shqt_fuwu1 :shqt_fuwu1bz :shqt_name2 :shqt_fuwu2 :shqt_fuwu2bz
        :shqt_name3 :shqt_fuwu3 :shqt_fuwu3bz :ylbj_yufzd :ylbj_yufzdbz :ylbj_yufzhis :ylbj_yufzhisbz :ylxz_fuyao :ylxz_fuyaobz :ylxz_peizhen :ylxz_peizhenbz :ylxz_xueyao
        :ylxz_xueyaobz :ylxz_tiwen :ylxz_tiwenbz :ylkf_zhidao :ylkf_zhidaobz :ylkf_xunlian :ylkf_xunlianbz :ylqt_fuwu1name :ylqt_fuwu1 :ylqt_fuwu1bz :ylqt_fuwu2name
        :ylqt_fuwu2 :ylqt_fuwu2bz :ylqt_fuwu3name :ylqt_fuwu3 :ylqt_fuwu3bz :jz_anzhweix :jz_anzhweixbz :jz_qingxi :jz_qingxibz :jz_shutong :jz_shutongbz
        :jz_qtfuwu1name :jz_qtfuwu1 :jz_qtfuwu1bz :jz_qtfuwu2name :jz_qtfuwu2 :jz_qtfuwu2bz :jz_qtfuwu3name :jz_qtfuwu3 :jz_qtfuwu3bz :jj_hujj :jj_hujjbz :jj_shouj
        :jj_shoujbz :jj_qtfuwu1name :jj_qtfuwu1 :jj_qtfuwu1bz :jj_qtfuwu2name :jj_qtfuwu2 :jj_qtfuwu2bz :jj_qtfuwu3name :jj_qtfuwu3 :jj_qtfuwu3bz :qt_fuwu1name
        :qt_fuwu1 :qt_fuwu1bz :qt_fuwu2name :qt_fuwu2 :qt_fuwu2bz :qt_fuwu3name :qt_fuwu3 :qt_fuwu3bz :qt_fuwu4name :qt_fuwu4 :qt_fuwu4bz :suggestservice :servicebz :jja_id])
(def approvekeys [:bstablepk :bstablename :status :aulevel :auflag :bstime :auuser :audesc :dvcode :appoperators :messagebrief :bstablepkname :datatype])
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
(def jjapprove (str "(select j.userdistrictid,t.* from approve t,T_JJYLAPPLY j WHERE j.JJA_ID = t.BSTABLEPK AND t.BSTABLENAME = 't_jjylapply')"))


(defn apply3-commit
  "第三类居家养老服务申请进入审核流程"
  [params]
  (let [ishandle (:ishandle params)
        communityopinion (:communityopinion params)                                         ;;社区意见
        bstablepk  (:jja_id params)
        bstablename "t_jjylapply"
        bstablepkname      "jja_id"
        status   "1"
        aulevel    (if (= ishandle "r") "4" "1")
        auflag   "第三类居家养老服务申请提交"
        bstime      (common/get-nowtime)
        auuser   (:username (session/get :usermsg))
        ;AUDESC
        ;DVCODE
        appoperators  auuser
        messagebrief  (str "姓名：" (:name params) ",身份证："(:identityid params) ",第三类居家养老服务申请")
        approvedata {:bstablepk bstablepk :bstablename bstablename :bstablepkname bstablepkname :status status :aulevel aulevel :auflag auflag :bstime bstime :auuser auuser :appoperators appoperators :messagebrief messagebrief :audesc communityopinion :datatype "3"}
        ]
    (db/add-approve approvedata)))

(defn add-audit-apply [request]                                                                        "添加申请"
  (let[params (:params request)
       jja_id (:jja_id params)
       identityid (:identityid params)
       checkold (count (db/get-oldpeople identityid))
       opdata (select-keys params opofapply)
       userdistrictid (:regionid (session/get :usermsg))                                              ;REGIONID
       applydata (common/dateformat-bf-insert (conj (select-keys params applykeys) {:userdistrictid userdistrictid}) "birthd" "applydate")
       olddata (conj request {:params (conj params {:datatype "f"})})
       apply_type (:apply_type params)]
    (if (= checkold 0) (old/create-old olddata) )                                           ;如果老人数据没有此数据，将其添加到老人数据库中
    ;(db/add-apply (common/timefmt-bef-insert (common/timefmt-bef-insert applydata "birthd") "applydate"))
    ;(if (= apply_type "3") (apply3-commit params))                                                    ;如果是第三类，则直接进入审核流程中
    ;(if (= apply_type "3")
    ;  (let [jjylid (:nextval (first(db/get-results-bysql "select seq_t_jjylapply.nextval  from dual")))]
    ;    (if (> (count jja_id) 0) (db/updatedata-by-tablename "t_jjylapply" (conj applydata {:jja_id jjylid :ishandle "1"}) {:jja_id jja_id})
    ;                              (db/add-apply (conj applydata {:jja_id jjylid :ishandle "1"})))
    ;    (apply3-commit (conj params {:jja_id jjylid})))
    ;  (db/add-apply applydata))
    (if (> (count jja_id) 0)                                             ;jja_id是否存在（数据是否首次增加的）
      (if (= apply_type "3") (do (db/updatedata-by-tablename "t_jjylapply" (conj applydata {:ishandle "1"}) {:jja_id jja_id})
                                 (apply3-commit (conj params {:jja_id jja_id}))) ;第三类申请进入审核流程
                             (db/updatedata-by-tablename "t_jjylapply" (conj applydata {:ishandle "p"}) {:jja_id jja_id}))    ;一、二类申请进入评估流程
      (let [jjylid (:nextval (first(db/get-results-bysql "select seq_t_jjylapply.nextval  from dual")))]
        (if (= apply_type "3") (do (db/adddata-by-tablename "t_jjylapply" (conj applydata {:jja_id jjylid :ishandle "1"}))
                                   (apply3-commit (conj params {:jja_id jjylid})))
                               (db/add-apply (conj applydata {:jja_id jjylid :ishandle "p"}) ))))
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

(defn get-apply-list
  "获取未提交的申请列表"
  [request]
  (let [params (:params request)
        rows (:rows params)
        page (:page params)
        name (:name params)
        userdistrictid (:regionid (session/get :usermsg))
        identityid (:identityid params)
        conds (str " and ishandle is null and userdistrictid like '%" userdistrictid "%' "  (common/likecond "name" name) (common/likecond "identityid" identityid))
        getresult (common/fenye rows page t_jjylapply "*" conds " order by jja_id desc ")]
    (println "CCCCCCCCCCC" conds)
    (resp/json {:total (:total getresult) :rows (common/dateymd-bf-list (:rows getresult) "birthd" "applydate")})))

(defn delete-apply-byid [request]
  (let [params (:params request)
        jja_id (:jja_id params)]
    (db/deletedata-by-tablename "t_jjylapply" {:jja_id jja_id})
    (str "true")))

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
       userdistrictid (:regionid (session/get :usermsg))
       identityid (:identityid params)
       cond (str " and ( ishandle = 'p' or ishandle = 'r' ) and userdistrictid like '%" userdistrictid "%' and apply_type = '1' "  (common/likecond "name" name) (common/likecond "identityid" identityid))
       getresult (common/fenye rows page t_jjylapply "*" cond " order by jja_id desc ")]
    (resp/json {:total (:total getresult) :rows (common/time-before-list(common/time-before-list (:rows getresult) "birthd") "applydate")})))



(defn  update-apply [request]                                                                           "更新申请信息"
  (let [params (:params request)
        jja_id  (:jja_id params)
        userdistrictid (:regionid (session/get :usermsg))
        applydata (conj (select-keys params applykeys) {:userdistrictid userdistrictid})]
    (println "DDDDDDDDDDDD" applydata)
    (if (> (count jja_id) 0) (db/update-apply (common/timefmt-bef-insert (common/timefmt-bef-insert applydata "birthd") "applydate") jja_id)
                             (db/adddata-by-tablename "t_jjylapply" (common/dateformat-bf-insert applydata "birthd" "applydate")))                     ;首次保存新增申请数据，更新保存更新申请数据

;    (resp/json {:success true :message "update apply success"})
    (str "true")
    ))

(defn add-assessmessage [request]                                                                         "居家养老信息评估"
  (let[params (:params request)
       assessdata (common/timefmt-bef-insert(common/timefmt-bef-insert (common/timefmt-bef-insert (common/timefmt-bef-insert (select-keys params assess) "startdate") "enddate") "operator_date")"finishdate")                                    ;STARTDATE,ENDDATE,OPERATOR_DATE
       suggestdata (select-keys params suggest)                                ;
       applydata (select-keys params applykeys)
       ss_id (:ss_id params)
       pg_id (:pg_id params)
       jja_id (:jja_id params)
       ]
    (println "IIIIIIIIIIIIIIIIIIIIII"  " ss_id:" ss_id  " pg_id:" pg_id  "jja_id:" jja_id)
    (if (= (count ss_id) 0) (db/insert-suggest suggestdata)  (db/update-suggest suggestdata ss_id))                ;服务评估首次保存新增数据，以后保存数据
    (if (= (count pg_id) 0) (db/insert-assess assessdata) (db/update-assess assessdata pg_id))
    (if (> (count jja_id) 0) (db/updatedata-by-tablename "t_jjylapply" applydata {:jja_id jja_id}))                           ;更新评估中相关字段数据
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
       userdistrictid (:regionid (session/get :usermsg))
       usercond  (cond
                               (= (count userdistrictid) 6)  (str " and aulevel != '7' and aulevel != '8' ")              ;县级可以操作审核审批数据
                               (= (count userdistrictid) 9)  (str " and aulevel != '7' and aulevel != '8' and aulevel != '2' and aulevel != '5' ")               ;镇街级只能查看审核数据
                               (= (count userdistrictid) 12)  (str " and aulevel != 's' "))                                             ;社区级查看不了审核数据
       name (:name params)
       identityid (:identityid params)
       useridcond (if (> (count userdistrictid) 0) (str " and userdistrictid like '%" userdistrictid "%' "))
       cond (str " and bstablename = 't_jjylapply' and status = '1'  " usercond useridcond " and messagebrief LIKE '姓名%"name"%身份证%"identityid"%'")
       getresult (common/fenye rows page jjapprove "*" cond " order by sh_id desc ")]
    (println "CCCCCCCC" cond)
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
       minage (:minage params)
       maxage (:maxage params)
       datatype (:datatype params)
       userdistrictid (:regionid (session/get :usermsg))
       minagecond (if (> (count minage) 0)  (str " and age > " minage ))
       maxagecond (if (> (count maxage) 0)  (str " and age <= " maxage ))
       typecond (if (> (count datatype) 0)  (str " and economy = '" datatype "'"))
       cond (str " and ishandle = 'y'" (common/likecond "name" name) (common/likecond "userdistrictid" userdistrictid) (common/likecond "identityid" identityid) minagecond maxagecond typecond )
       getresult (common/fenye rows page t_jjylapply "*" cond " order by jja_id desc")]
    (resp/json {:total (:total getresult) :rows (common/time-before-list(common/time-before-list (:rows getresult) "birthd") "applydate")})))

(defn setexcel-auditdata [request]
  (let[params (:params request)
       ; colstxt (:colstxt params)
        colsfieldls (:colsfield params)
        genderrep (str "(case gender   when '1' then '男' when '0' then '女'  else '空'   END) as gender")
        economyrep (str "(case economy   when '0' then '低保特困职工' when '1' then '低保边缘户' when '2' then '低收入' when '3' then '无退休工资' when '4' then '有退休工资' when '5' then '特殊贡献' else '未划分'   END)  as economy")
        colsfield  (strs/replace (strs/replace colsfieldls "gender" genderrep) "economy" economyrep)
        datatype (:datatype params)
        name (:name params)
        identityid (:identityid params)
        minage (:minage params)
        maxage (:maxage params)
        minagecond (if (> (count minage) 0)  (str " and age > " minage ))
        maxagecond (if (> (count maxage) 0)  (str " and age <= " maxage ))
        typecond (if (> (count datatype) 0)  (str " and economy = '" datatype "'"))
        cond (str " ishandle = 'y'" (common/likecond "name" name) (common/likecond "identityid" identityid) minagecond maxagecond typecond )
        resultsql (str "select " colsfield " from " t_jjylapply " where " cond " order by jja_id desc")]
    (common/time-before-list(db/get-results-bysql resultsql) "birthd")))


(defn remove-submit [request]
  (let[params (:params request)
       jja_id (:jja_id params)
       rm_communityopinion (:rm_communityopinion params)
       jjyldata (select-keys params applykeys)
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
       name (:name params)
       userdistrictid (:regionid (session/get :usermsg))
       useridcond (cond
                    (= (count userdistrictid) 6)  (str " and (aulevel = 7 or aulevel = 8) ")
                    (= (count userdistrictid) 9)  (str " and aulevel = 7 ")
                    :else (str " and aulevel = 's' "))
       identityid (:identityid params)
       cond (str " and bstablename = 't_jjylapply' and status = '1' " useridcond " and messagebrief LIKE '姓名%"name"%身份证%"identityid"%'")
       getresult (common/fenye rows page jjapprove "*" cond " order by sh_id desc ")]
    (resp/json {:total (:total getresult) :rows (common/time-formatymd-before-list (:rows getresult)  "bstime")})))

(defn getall-auditrm [request]
  (let[params (:params request)
       rows (:rows params)
       page (:page params)
       name (:name params)
       userdistrictid (:regionid (session/get :usermsg))
       identityid (:identityid params)
       cond (str (common/likecond "name" name) (common/likecond "identityid" identityid) (common/likecond "userdistrictid" userdistrictid))
       getresult (common/fenye rows page (str "(SELECT *  from t_jjylapply  WHERE ishandle = 'n')")  "*" cond " order by jja_id desc ")]
    (resp/json {:total (:total getresult) :rows (common/time-before-list (:rows getresult)  "rm_audittime")})))


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
       cond (str " and ishandle = 'y'" (common/likecond "name" name) (common/likecond "identityid" identityid) " and jja_id NOT IN (SELECT jja_id FROM T_HOSPITALSUBSIDY WHERE ISPROVIDE != 'n')")
       getresult (common/fenye rows page t_jjylapply "*" cond " order by jja_id desc")]
    (resp/json {:total (:total getresult) :rows (common/time-before-list(common/time-before-list (:rows getresult) "birthd") "applydate")})))

(defn apply-hospitalsubsidy  [request]                                                 "住院补助申请"
  (let[params (:params request)
        hcommunityopinion (:hcommunityopinion params)
        appoperators (:username (session/get :usermsg))
        messagebrief  (str  "姓名：" (:name params) ",身份证：" (:identityid params))
        jjyldata (select-keys params applykeys)
        hsdata (select-keys params hospitalsubsidy)
        hs_id  (:max(first(db/get-hsmaxid)))
        jja_id (:jja_id params)
        newhs_id (if hs_id (inc hs_id)  10)
        appdata {:bstablepk newhs_id :bstablename "t_hospitalsubsidy" :status 1 :aulevel 1 :auflag "住院补助申请提交" :bstime (common/get-nowtime)  :audesc hcommunityopinion :appoperators appoperators :messagebrief messagebrief :bstablepkname "hs_id"}
        ]
    (db/add-hospitalsubsidy (conj hsdata {:hs_id newhs_id :jja_id jja_id :isprovide "1"}))             ;保存住院申请信息
    (db/update-apply jjyldata jja_id)                                                           ;保存老人信息
    (db/add-approve appdata)                                                                           ;将申请信息添加到审核流程中
    (str "true")))

(defn hospitalsubsidy-audit [request]
  (let[params (:params request)
       rows (:rows params)
       page (:page params)
       name (:name params)
       identityid (:identityid params)
       cond (str " and bstablename = 't_hospitalsubsidy' and status = '1' "  " and messagebrief LIKE '姓名%"name"%身份证%"identityid"%'")
       getresult (common/fenye rows page approve "*" cond " order by sh_id desc ")]
    (resp/json {:total (:total getresult) :rows (common/time-formatymd-before-list (:rows getresult)  "bstime")})))

(defn get-hsdatabyid [request]
  (let[params (:params request)
        hs_id (:hs_id params)
        hssql (str "select h.*,j.* from t_hospitalsubsidy h,t_jjylapply j where h.hs_id = " hs_id " and h.isprovide != 'n'  and h.jja_id = j.jja_id")]
    (resp/json (common/time-before-list (common/time-before-list (common/time-before-list (db/get-results-bysql hssql)"hopiniontime")"hreviewtime")"haudittime"))))


(defn hsapplyaudit1 [params]                                                                              "街镇审查"
  (let[issuccess (:issuccess params)
       approvedata (select-keys params approvekeys)
       hstreetreview (:audesc params)
       hreviewtime (common/get-nowtime)
       hs_id (:bstablepk params)
       sh_id   (:sh_id params)
       aulevel (if (= issuccess "0") "2" "0")
       auflag (if (= issuccess "0") "街镇审查通过" "街镇审查未通过")
       status  (if (= issuccess "0") "1" "0")
       auuser (:username (session/get :usermsg))
       newappdata (conj approvedata {:aulevel aulevel :auflag auflag :status status :bstime hreviewtime :auuser auuser :audesc hstreetreview})]
    (db/update-approve sh_id {:status "0"})                                                                                         ;;当前审核信息更改为历史状态
    (db/add-approve newappdata)                                                                                                       ;;添加新的审核信息状态
    (if (= issuccess "0") (db/update-hsapply {:hstreetreview hstreetreview :hreviewtime hreviewtime} hs_id)
      (db/update-hsapply {:hstreetreview hstreetreview :hreviewtime hreviewtime :isprovide "n"} hs_id))               ;;将社区意见添加申请表中
    (str "街镇审查")))

(defn hsapplyaudit2 [params]                                                                              "县民政局审核"
  (let[issuccess (:issuccess params)
       approvedata (select-keys params approvekeys)
       hcountyaudit (:audesc params)
       haudittime (common/get-nowtime)
       hs_id (:bstablepk params)
       sh_id   (:sh_id params)
       aulevel (if (= issuccess "0") "3" "0")
       auflag (if (= issuccess "0") "县民政局审核通过" "县民政局审核未通过")
       ;status  (if (= issuccess "0") "1" "0")
       auuser (:username (session/get :usermsg))
       newappdata (conj approvedata {:aulevel aulevel :status "0" :auflag auflag :bstime haudittime :auuser auuser :audesc hcountyaudit})]
    (db/update-approve sh_id {:status "0"})                                                                                         ;;当前审核信息更改为历史状态
    (db/add-approve newappdata)                                                                                                       ;;添加新的审核信息状态
    (if (= issuccess "0") (db/update-hsapply {:hcountyaudit hcountyaudit :haudittime haudittime :isprovide "y"} hs_id)
      (db/update-hsapply {:hcountyaudit hcountyaudit :haudittime haudittime :isprovide "n"} hs_id) )             ;;将社区意见添加申请表中
    (str "县民政局审核")))

(defn audit-hsapply [request]
  (let[params (:params request)
        aulevel (:aulevel params)
        ]
    (cond
      (= aulevel "1")        (hsapplyaudit1 params)
      (= aulevel "2")        (hsapplyaudit2 params)
      )
    (resp/json {:success true :message "hsapply audit success"})))

(defn getallaudiths [request]
  (let[params (:params request)
        name (:name params)
        identityid (:identityid params)
        year (:year params)
        yearvalue (if (= (count year) 0) (common/get-nowyear) year)
        rows (:rows params)
        page (:page params)
        conds (str (common/likecond " name " name) (common/likecond " identityid " identityid))
        fromresults (str "select t.hs_id,t.hospital_days,t.subsidy_money,t.hospital_desc,j.name,j.identityid,j.address from t_hospitalsubsidy t,t_jjylapply j
                                 where t.jja_id = j.jja_id and t.isprovide = 'y' and  to_char(t.haudittime,'yyyy') = '" yearvalue "' ")]
    (println fromresults)
    (resp/json (common/fenye rows page (str "(" fromresults ")") "*" conds  " order by hs_id "))))

(defn getqualifyop [request]
  (let[params (:params request)
        name (:name params)
        rows (:rows params)
        page (:page params)
        identityid (:identityid params)
        bsnyue (clojure.string/trim (:bsnyue params))
        ywq (if (> (count bsnyue) 0) bsnyue (common/ywq))
        condname (if (> (count name) 0) (str " and j.name like '%" name "%' "))
        condid (if (> (count identityid) 0) (str " and j.identityid like '%" identityid "%' "))
        qopsql (str "SELECT t.JJA_ID,t.NAME,t.IDENTITYID,t.GENDER,t.BIRTHD,t.ADDRESS,t.AGE,t.MONTHSUBSIDY,t.SERVICETIME,t.HOSPITALSUBSIDY,h.SUBSIDY_MONEY FROM
(SELECT j.JJA_ID,j.NAME,j.IDENTITYID,j.GENDER,j.BIRTHD,j.ADDRESS,j.AGE,a.SERVICETIME,a.HOSPITALSUBSIDY,a.MONTHSUBSIDY
FROM T_JJYLAPPLY j,T_JJYLASSESSMENT a WHERE j.ishandle = 'y' " condname  condid "  AND j.JJA_ID = a.JJA_ID AND j.jja_id NOT IN
(SELECT jja_id FROM t_dolemoney WHERE bsnyue ='" ywq "')) t
LEFT JOIN t_hospitalsubsidy h
ON h.jja_id = t.jja_id
UNION ALL
SELECT t.JJA_ID,t.NAME,t.IDENTITYID,t.GENDER,t.BIRTHD,t.ADDRESS,t.AGE,t.MONTHSUBSIDY,t.SERVICETIME,t.HOSPITALSUBSIDY,h.SUBSIDY_MONEY FROM
(SELECT j.JJA_ID,j.NAME,j.IDENTITYID,j.GENDER,j.BIRTHD,j.ADDRESS,j.AGE,0 AS MONTHSUBSIDY,'0' AS SERVICETIME,0 AS HOSPITALSUBSIDY
FROM T_JJYLAPPLY j,T_JJYLASSESSMENT a WHERE j.ishandle = 'n' " condname  condid " AND to_char(RM_AUDITTIME,'yyyy')  = '" (subs ywq 0 4) "' AND j.JJA_ID = a.JJA_ID AND j.jja_id NOT IN
(SELECT jja_id FROM t_dolemoney WHERE bsnyue = '" ywq "')) t
LEFT JOIN t_hospitalsubsidy h
ON h.jja_id = t.jja_id")
        getresult (common/fenye rows page (str "(" qopsql ")") "*" "" " order by JJA_ID desc ")]
    (println name "RRRRRRR"  qopsql)
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

(defn sendallmoney [request]
  (let[params (:params request)
       name (:name params)
       ; rows (:rows params)
       ; page (:page params)
       identityid (:identityid params)
       bsnyue (clojure.string/trim (:bsnyue params))
       ywq (if (> (count bsnyue) 0) bsnyue (common/ywq))
       condname (if (> (count name) 0) (str " and j.name like '%" name "%' "))
       condid (if (> (count identityid) 0) (str " and j.identityid like '%" identityid "%' "))
       qopsql (str "(select t.jja_id,t.name,t.identityid,t.gender,t.birthd,t.address,t.age,t.monthsubsidy,t.servicetime,t.hospitalsubsidy,h.subsidy_money from
(select j.jja_id,j.name,j.identityid,j.gender,j.birthd,j.address,j.age,a.servicetime,a.hospitalsubsidy,a.monthsubsidy
from t_jjylapply j,t_jjylassessment a where j.ishandle = 'y' " condname  condid "  and j.jja_id = a.jja_id and j.jja_id not in
(select jja_id from t_dolemoney where bsnyue ='" ywq "')) t
left join t_hospitalsubsidy h
on h.jja_id = t.jja_id)
union all
(select t.jja_id,t.name,t.identityid,t.gender,t.birthd,t.address,t.age,t.monthsubsidy,t.servicetime,t.hospitalsubsidy,h.subsidy_money from
(select j.jja_id,j.name,j.identityid,j.gender,j.birthd,j.address,j.age,0 as monthsubsidy,'0' as servicetime,0 as hospitalsubsidy
from t_jjylapply j,t_jjylassessment a where j.ishandle = 'n' " condname  condid " and to_char(rm_audittime,'yyyy')  = '" (subs ywq 0 4) "' and j.jja_id = a.jja_id and j.jja_id not in
(select jja_id from t_dolemoney where bsnyue = '" ywq "')) t
left join t_hospitalsubsidy h
on h.jja_id = t.jja_id)")
       sendmsql (str "insert into t_dolemoney(jja_id,bsnyue,monthsubsidy,servicetime,hospitalsubsidy)
 select jja_id,'" ywq "' as bsnyue,monthsubsidy,servicetime,hospitalsubsidy from (" qopsql ")")]
    (db/insert-results-bysql sendmsql)
    (str "true")))

(defn resendmoney [request]
  (let[params (:params request)
       doleid (:doleid params)
       bsnyue  (:bsnyue params)]
    (if (> (count doleid) 0)
         (db/resendmoney "doleid" doleid)
         (if (> (count bsnyue) 0)  (db/resendmoney "bsnyue" bsnyue)))
    (str "true")))


;;居家养老统计

(defn jjyl-dmstatis [params]
  (let[districtid (:districtid params)
       length (if(=(count districtid)6) 9 12)
       ]
    (if (> (count districtid) 9)
      (str "SELECT s.districtid,s.opsum,dv.dvname FROM division dv,
(SELECT districtid,SUM(opsum) AS opsum FROM
(SELECT d.dvcode AS districtid,0 opsum FROM division d WHERE d.dvcode = '" districtid "'
UNION ALL
SELECT districtid,COUNT(*) AS opsum FROM " t_jjylapply " WHERE districtid = '" districtid "' GROUP BY districtid )
GROUP BY districtid) s
WHERE s.districtid = dv.dvcode ORDER BY s.districtid")
      (str "SELECT s.districtid,s.opsum,dv.dvname FROM division dv,
(SELECT districtid,SUM(opsum) AS opsum FROM
(SELECT d.dvcode AS districtid,0 opsum FROM division d WHERE d.dvhigh = '" districtid "'
UNION ALL
SELECT substr(districtid,0," length ") AS districtid ,COUNT(*) AS opsum FROM " t_jjylapply " WHERE districtid like '" districtid "%'  GROUP BY substr(districtid,0," length "))
GROUP BY districtid) s
WHERE s.districtid = dv.dvcode ORDER BY s.districtid"))))

(defn jjyl-xbstatis [params]
  (let[districtid (:districtid params)
       districtcond (if (> (count districtid) 0)  (str " and districtid LIKE '" districtid "%'"))
       ]
    (str "SELECT (case gender   when '1' then '男' when '0' then '女'  else '空'   END) AS sex,COUNT(*) AS opsum FROM " t_jjylapply "
    WHERE 1=1 " districtcond "  GROUP BY gender")))


(defn jjyl-sjstatis [params]
  (let[districtid (:districtid params)
       ishandle (:ishandle params)
       field  (condp = ishandle
                 "y"      "audittime"
                 "n"      "rm_audittime"
                           "applydate" )
       ishandlecond  (if (> (count ishandle) 0)  (str " and ishandle = '" ishandle "'"))
       timfun      (:timfun params)
       typetime   (:typetime params)
       starttime   (:starttime params)
       endtime    (:endtime params)]
    (condp = timfun
      "yyyy" (str "SELECT to_char(" field ",'yyyy') AS tname,count(*) AS tsum FROM " t_jjylapply " where districtid like '" districtid "%' " ishandlecond " GROUP BY to_char(" field ",'yyyy') ORDER BY to_number(to_char(" field ",'yyyy')) ASC")
      "Q"     (str "SELECT CONCAT('" typetime "-',to_char(" field ",'Q')) AS tname,count(*) AS tsum FROM " t_jjylapply " where  districtid  like '" districtid "%' " ishandlecond " and  to_char(" field ",'yyyy') = '" typetime "'  GROUP BY to_char(" field ",'Q') ORDER BY to_number(to_char(" field ",'Q')) ASC")
      "mm"  (str "SELECT CONCAT('" typetime "-',to_char(" field ",'mm')) AS tname,count(*) AS tsum FROM " t_jjylapply " where  districtid  like '" districtid "%' " ishandlecond " and   to_char(" field ",'yyyy') = '" typetime "' GROUP BY to_char(" field ",'mm') ORDER BY to_number(to_char(" field ",'mm')) ASC")
      "md"   (str "SELECT to_char(" field ",'yyyy-mm-dd') AS tname,count(*)  AS tsum  FROM " t_jjylapply " where  districtid  like '" districtid "%' " ishandlecond " and   to_char(" field ",'yyyy-mm') = '" typetime "'  GROUP BY to_char(" field ",'yyyy-mm-dd') ORDER BY to_date(to_char(" field ",'yyyy-mm-dd'),'yyyy-mm-dd') ASC")
      "dd"    (str "SELECT to_char(" field ",'yyyy-mm-dd') AS tname,count(*) AS tsum  FROM " t_jjylapply " where  districtid  like '" districtid "%' " ishandlecond " and   " field " between to_date('" starttime "','yyyy-mm-dd') and to_date('" endtime "','yyyy-mm-dd')  GROUP BY to_char(" field ",'yyyy-mm-dd') ORDER BY to_date(to_char(" field ",'yyyy-mm-dd'),'yyyy-mm-dd') ASC")
      )))

(defn jjyl-statistic [request]
  (let[params (:params request)
       statistype (:statistype params)
       jjlystatis-sql (condp = statistype
                        "dm" (jjyl-dmstatis params)
                        "sj"   (jjyl-sjstatis params)
                        "xb" (jjyl-xbstatis params))]
    (resp/json (db/get-results-bysql jjlystatis-sql))))

(defn jjyl-statistic2 [request]
  (let[params (:params request)
       datetp (:datetype params)
       datetype (if (= (count datetp) 0)  "APPLYDATE" datetp)
       starttime (:starttime params)
       endtime (:endtime params)
       districtid (:districtid params)
       gender (:gender params)
       dlength (count districtid)
       sj (:sj params)
       dq (:dq params)
       xb (:xb params)
       rows (:rows params)
       page (:page params)
       starttimecond   (if (> (count starttime) 0) (str " and " datetype " >= to_date('" starttime "','yyyy-mm-dd') ")  )
       endtimecond   (if (> (count endtime) 0) (str " and " datetype " <= to_date('" endtime "','yyyy-mm-dd') " ) )
       districtidcond (if (> (count districtid) 0) (str " and districtid like '" districtid "%' ")  )
       gendercond (if (> (count gender) 0 ) (str " and gender = '" gender "' ") )
       tjconds (str starttimecond endtimecond  districtidcond gendercond )            ;分组查询条件
       sjgroup (condp = sj                                                                                    ;时间分组
                 "Y"      (str " to_char(" datetype ",'yyyy') ")
                 "Q"      (str " CONCAT(to_char(" datetype ",'yyyy'),to_char(" datetype ",'Q')) ")
                 "M"     (str " CONCAT(to_char(" datetype ",'yyyy'),to_char(" datetype ",'mm')) ")
                 "D"       (str " to_char(" datetype ",'yyyy-mm-dd') ")
                 nil       )
       dqgroup (if (= dq "dq") (condp = dlength                                                   ;地区分组
                                 6   (str " substr(districtid,0,9) ")
                                 9   (str " substr(districtid,0,12) ")
                                 12   " substr(districtid,0,12)  "
                                 nil))

       xbgroup (if (= xb "xb") (str " (case gender   when '1' then '男' when '0' then '女'  else '空'   END) ")   nil)                   ;性别分组
       groups (str (if sjgroup (str sjgroup ",")) (if dqgroup (str dqgroup ",")) (if xbgroup (str xbgroup ",")))                            ;组合分组
       groupwith (if (> (count groups) 0) (subs groups 0 (dec(count groups)))  (str " substr(districtid,0,6) "))
       opstatissql (str "SELECT s.*,dv.dvname FROM (select " (if sjgroup sjgroup "null") " as operator ,"(if dqgroup dqgroup (if (>(count districtid)0) districtid "330424") ) " as districtid, " (if xbgroup xbgroup "null") " as gender,count(*) as opsum
                                from " t_jjylapply " where 1=1 " starttimecond endtimecond districtidcond gendercond " group by " groupwith ") s LEFT JOIN division dv ON s.districtid = dv.dvcode")]
    (println "SSSSSSSSSSSSSS" opstatissql)
    (resp/json (common/fenye rows page (str "(" opstatissql ")") "*" ""  ""))))


(defn jjyl-statistic3 [request]
  (let[params (:params request)
       minage (:minage params)
       maxage (:maxage params)
       districtid (:districtid params)
       gender (:gender params)
       economy (:economy params)
       dlength (count districtid)
       nl (:nl params)
       dq (:dq params)
       xb (:xb params)
       lb (:lb params)
       rows (:rows params)
       page (:page params)
       userdistrictid (:regionid (session/get :usermsg))
       minagecond (if (> (count minage) 0) (str " and age > " minage)  )
       maxagecond   (if (> (count maxage) 0) (str " and age <= " maxage)  )
       ;starttimecond   (if (> (count starttime) 0) (str " and OPERATOR_DATE >= to_date('" starttime "','yyyy-mm-dd') ")  )
       ;endtimecond   (if (> (count endtime) 0) (str " and OPERATOR_DATE <= to_date('" endtime "','yyyy-mm-dd') " ) )
       districtidcond (if (> (count districtid) 0) (str " and districtid like '" districtid "%' ")  )
       gendercond (if (> (count gender) 0 ) (str " and gender = '" gender "' ") )
       economycond (if (> (count economy) 0 )   (str " and economy = '" economy "' "))
       tjconds (str minagecond maxagecond  districtidcond gendercond economycond (common/likecond "userdistrictid" userdistrictid))            ;分组查询条件
       agevalue (cond
                  (and  (> (count minage) 0) (> (count maxage) 0))  (str  minage "-"maxage"岁")
                  (and (> (count minage) 0) (= (count maxage) 0))  (str minage "岁以上")
                  (and (= (count minage) 0) (> (count maxage) 0))  (str maxage "岁以下"))
       gendervalue (cond
                     (= gender "0")  "女"
                     (= gender "1")  "男")
       typevalue (cond
                   (= economy "0") "低保特困职工"
                   (= economy "1") "低保边缘户"
                   (= economy "2")  "低收入"
                   (= economy "3")  "无退休工资"
                   (= economy "4")  "有退休工资"
                   (= economy "5")  "特殊贡献")
       agegroup (if (and (= nl "nl")(= (count minage) 0) (= (count maxage) 0))
                  (str " (CASE WHEN age <= 60 THEN '60岁以下'
	                                    WHEN age > 60 AND age <= 70 THEN '60-70岁'
	                                    WHEN age > 70 AND age<= 80 THEN '70-80岁'
	                                    WHEN age > 80 AND age <= 90 THEN '80-90岁'
	                                     WHEN age > 90 THEN '90岁以上'
	                                     ELSE '年龄未知' END)" ))
       dqgroup (if (= dq "dq") (condp = dlength                                                   ;地区分组
                                 6   (str " substr(districtid,0,9) ")
                                 9   (str " substr(districtid,0,12) ")
                                 12   " substr(districtid,0,12)  "
                                 nil))
       xbgroup (if (= xb "xb") (str " (case gender   when '1' then '男' when '0' then '女'  else '空'   END) ")   nil)                   ;性别分组
       lbgroup (if (= lb "lb") (str " (case economy   when '0' then '低保特困职工' when '1' then '低保边缘户' when '2' then '低收入' when '3' then '无退休工资' when '4' then '有退休工资' when '5' then '特殊贡献' else '未划分'   END)  "))
       groups (str (if agegroup (str agegroup ",")) (if dqgroup (str dqgroup ",")) (if xbgroup (str xbgroup ",")) (if lbgroup (str lbgroup ",")))                            ;组合分组
       groupwith (if (> (count groups) 0) (subs groups 0 (dec(count groups)))  (str " substr(districtid,0,6) "))
       opstatissql (str "SELECT s.*,dv.dvname FROM (select " (if agegroup agegroup (str " '" agevalue "' ")) " as agevalue ," (if dqgroup dqgroup (if (>(count districtid)0) districtid "330424") ) " as districtid, " (if xbgroup xbgroup (str " '" gendervalue "' ")) " as gender, " (if lbgroup lbgroup (str " '" typevalue "' ")) " as oldtype, count(*) as opsum
                                from " t_jjylapply " where 1=1 " tjconds " group by " groupwith ") s LEFT JOIN division dv ON s.districtid = dv.dvcode")]
    (println "SSSSSSSSSSSSSS" opstatissql)
    (resp/json (common/fenye rows page (str "(" opstatissql ")") "*" ""  ""))
    ))





















(def  choice [",MONTHSUBSIDY AS " ",0 AS "])



(defn testtime [request]
  (resp/json (:max(first(db/get-hsmaxid)))))

(defn get-monthsql [num month]
  (println num month)
  (let[msql (loop [cnt (count month) acc (conj [] "jja_id")]
              (if (zero? cnt)
                acc
                (recur (dec cnt)
                  (if (= cnt  num)(conj  acc (choice 0) (str "a" (get month (dec cnt))))(conj  acc (choice 1)(str "a" (get month (dec cnt)))) ))))]
    msql ))

(defn unionsql [month ym]
  (let [usql (interpose " union all " (loop [cnt (count month) acc []]
                                        (if(zero? cnt)
                                          acc
                                          (recur (dec cnt)
                                            (conj acc
                                              (str "(SELECT "
                                                (apply str (get-monthsql cnt month))
                                                " FROM T_DOLEMONEY  WHERE  bsnyue = '"
                                                (get ym (dec cnt))
                                                "')"))))))]
    usql))

(defn get-moneyreport [request]
  (let[params (:params request)
       months (:months params)
       nums (:nums params)
       f (strs/split months #",")
       sf (strs/split nums #",")
       year (:year params)
       ym (vec(map #(str year %)sf))
       col (apply str (interpose "," (map #(str "sum(a" %1 ") as " %2 " ") sf f)))
       sumcol (apply str (interpose "," (map #(str "sum(" % ") as " % " ") f)))
       get-mreportsql (apply str (unionsql sf ym))
       get-moneysql (str "select jja_id," col "from (" get-mreportsql ") group by jja_id")
       get-resultsql (str "select jm.name,jm.identityid,jm.address,jm.servicername,jm.servicephone,jm.serviceaddress,  s.*,jm.servicetime,(case jm.economy   when '0' then '低保特困职工' when '1' then '低保边缘户' when '2' then '低收入' when '3' then '无退休工资' when '4' then '有退休工资' when '5' then '特殊贡献' else ''   end) as economy,jm.districtid,h.subsidy_money,dv.dvname  from ( " get-moneysql ") s
                           left join  (select j.jja_id,j.name,j.identityid,j.address,j.districtid,j.economy,a.servicername,a.servicephone,a.serviceaddress,a.servicetime from t_jjylapply j
                                         left join   (select ds.servicername,ds.servicephone,ds.serviceaddress,t.jja_id,t.servicetime from t_jjylassessment t
                                                 left join t_depservice ds on t.s_id = ds.s_id) a
                                         on j.jja_id = a.jja_id) jm
                           on s.jja_id = jm.jja_id
                           left join (select * from t_hospitalsubsidy  where isprovide = 'y' ) h
                           on s.jja_id = h.jja_id
                           LEFT JOIN division dv
	                        ON dv.dvcode = substr(jm.districtid,0,9)" )
       get-resultsumsql (str "SELECT * FROM(SELECT '' AS NAME,'' AS identityid,'' AS address,CONCAT('',count(*)) AS servicername,'' AS servicephone,'' AS serviceaddress,0 AS jja_id," sumcol ",'' AS servicetime,'' AS economy,'' AS districtid,SUM(subsidy_money) AS subsidy_money, '澉总计' AS dvname FROM ("
                          get-resultsql ") union all "
                          get-resultsql " union all "
                          "SELECT '' AS NAME,'' AS identityid,'' AS address,CONCAT('',count(*)) AS servicername,'' AS servicephone,'' AS serviceaddress,0 AS jja_id," sumcol ",'' AS servicetime,'' AS economy,'' AS districtid,SUM(subsidy_money) AS subsidy_money, CONCAT(dvname,'小计')AS dvname FROM ("
                          get-resultsql ") GROUP BY dvname
                          )ORDER BY dvname ASC")]
    (println col f sf year sumcol)
    (println get-resultsumsql)
    (db/get-results-bysql get-resultsumsql)))


(defn get-yearmoneyreport [request]
  (let[params (:params request)
       f ["一" "二" "三" "四" "五" "六" "七" "八" "九" "十" "十一" "十二"]
       sf ["01" "02" "03" "04" "05" "06" "07" "08" "09" "10" "11" "12"]
       year (:year params)
       ym (vec(map #(str year %)sf))
       col (apply str (interpose "," (map #(str "sum(a" %1 ") as " %2 " ") sf f)))
       get-mreportsql (apply str (unionsql sf ym))
       get-moneysql (str "select jja_id," col "from (" get-mreportsql ") group by jja_id")
       get-resultsql (str "select jm.name,jm.identityid,jm.address,jm.servicername,jm.servicephone,jm.serviceaddress, s.*,jm.servicetime,jm.assesstype,jm.districtid,h.subsidy_money,dv.dvname  from ( " get-moneysql ") s
                           left join  (select j.jja_id,j.name,j.identityid,j.address,j.districtid,a.servicername,a.servicephone,a.serviceaddress,a.servicetime,a.assesstype from t_jjylapply j
                                         left join   (select ds.servicername,ds.servicephone,ds.serviceaddress,t.jja_id,t.servicetime,t.assesstype from t_jjylassessment t
                                                 left join t_depservice ds on t.s_id = ds.s_id) a
                                         on j.jja_id = a.jja_id) jm
                           on s.jja_id = jm.jja_id
                           left join (select * from t_hospitalsubsidy  where isprovide = 'y' ) h
                           on s.jja_id = h.jja_id
                           LEFT JOIN division dv
	                        ON dv.dvcode = substr(jm.districtid,0,9)" )
       get-yearmrsql (str "SELECT dvname,count(*) as opsum,SUM(一) as 一,SUM(二) as 二,SUM(三) as 三,SUM(四) as 四,SUM(五) as 五,SUM(六) as 六,SUM(七) as 七,SUM(八) as 八,SUM(九) as 九,SUM(十) as 十,SUM(十一) as 十一,SUM(十二) as 十二,SUM(subsidy_money) AS subsidy_money FROM ("
                       get-resultsql ") GROUP BY dvname")]
;    (println get-yearmrsql)
    (db/get-results-bysql get-yearmrsql)
    ))

(defn get-moneyreporttab [request]
  (let[params (:params request)
       months (:months params)
       nums (:nums params)
       rows (:rows params)
       page (:page params)
       f (strs/split months #",")
       sf (strs/split nums #",")
       year (:year params)
       ym (vec(map #(str year %)sf))
       col (apply str (interpose "," (map #(str "sum(a" %1 ") as " %2 " ") sf f)))
       sumcol (apply str (interpose "," (map #(str "sum(" % ") as " % " ") f)))
       get-mreportsql (apply str (unionsql sf ym))
       get-moneysql (str "select jja_id," col "from (" get-mreportsql ") group by jja_id")
       get-resultsql (str "select jm.name,jm.identityid,jm.address,jm.servicername,jm.servicephone,jm.serviceaddress,  (case jm.economy   when '0' then '低保特困职工' when '1' then '低保边缘户' when '2' then '低收入' when '3' then '无退休工资' when '4' then '有退休工资' when '5' then '特殊贡献' else ''   end) as economy,s.*,jm.servicetime,jm.districtid,h.subsidy_money,dv.dvname  from ( " get-moneysql ") s
                           left join  (select j.jja_id,j.name,j.identityid,j.address,j.districtid,j.economy,a.servicername,a.servicephone,a.serviceaddress,a.servicetime from t_jjylapply j
                                         left join   (select ds.servicername,ds.servicephone,ds.serviceaddress,t.jja_id,t.servicetime from t_jjylassessment t
                                                 left join t_depservice ds on t.s_id = ds.s_id) a
                                         on j.jja_id = a.jja_id) jm
                           on s.jja_id = jm.jja_id
                           left join (select * from t_hospitalsubsidy  where isprovide = 'y' ) h
                           on s.jja_id = h.jja_id
                           LEFT JOIN division dv
	                        ON dv.dvcode = substr(jm.districtid,0,9)" )
      ]
    (println get-resultsql)
    (resp/json (common/fenye rows page (str "(" get-resultsql ")") "*" ""  ""))))

(defn get-yearmoneyreporttab [request]
  (let[params (:params request)
       f ["一" "二" "三" "四" "五" "六" "七" "八" "九" "十" "十一" "十二"]
       sf ["01" "02" "03" "04" "05" "06" "07" "08" "09" "10" "11" "12"]
       year (:year params)
       rows (:rows params)
       page (:page params)
       ym (vec(map #(str year %)sf))
       col (apply str (interpose "," (map #(str "sum(a" %1 ") as " %2 " ") sf f)))
       get-mreportsql (apply str (unionsql sf ym))
       get-moneysql (str "select jja_id," col "from (" get-mreportsql ") group by jja_id")
       get-resultsql (str "select jm.name,jm.identityid,jm.address,jm.servicername,jm.servicephone,jm.serviceaddress, s.*,jm.servicetime,jm.assesstype,jm.districtid,h.subsidy_money,dv.dvname  from ( " get-moneysql ") s
                           left join  (select j.jja_id,j.name,j.identityid,j.address,j.districtid,a.servicername,a.servicephone,a.serviceaddress,a.servicetime,a.assesstype from t_jjylapply j
                                         left join   (select ds.servicername,ds.servicephone,ds.serviceaddress,t.jja_id,t.servicetime,t.assesstype from t_jjylassessment t
                                                 left join t_depservice ds on t.s_id = ds.s_id) a
                                         on j.jja_id = a.jja_id) jm
                           on s.jja_id = jm.jja_id
                           left join (select * from t_hospitalsubsidy  where isprovide = 'y' ) h
                           on s.jja_id = h.jja_id
                           LEFT JOIN division dv
	                        ON dv.dvcode = substr(jm.districtid,0,9)" )
       get-yearmrsql (str "SELECT dvname,count(*) as opsum,SUM(一) as 一,SUM(二) as 二,SUM(三) as 三,SUM(四) as 四,SUM(五) as 五,SUM(六) as 六,SUM(七) as 七,SUM(八) as 八,SUM(九) as 九,SUM(十) as 十,SUM(十一) as 十一,SUM(十二) as 十二,SUM(subsidy_money) AS subsidy_money FROM ("
                       get-resultsql ") GROUP BY dvname")]
    (println get-yearmrsql)
    (resp/json (common/fenye rows page (str "(" get-yearmrsql ")") "*" ""  ""))
    ))





