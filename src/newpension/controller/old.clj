(ns newpension.controller.old
  (:use compojure.core)
  (:use korma.core
        [korma.db :only [oracle]])
  (:require [newpension.models.db :as db]
            [noir.response :as resp]
            [newpension.layout :as layout]
            [noir.session :as session]
            [clojure.string :as strs]
            [newpension.common.common :as common]
            [clojure.data.json :as json]
            ;[newpension.controller.report :as report]
            ))

(def oldinfo [:jk_qibq :xq_aih :jk_jiyl :address :hjj_hjj :jz_erdianh :jz_lxdh :age :status :jk_gms :culture
              :jk_xuex  :jz_yis  :birthd  :xq_canjiast :telephone :xq_huod :hjj_kind :name :pensionimgpath
              :hjj_phone :jz_wuy  :xq_jiaos :jk_shil :jk_huod :identityid :type :operator_date :jz_menwdh
              :hjj_type :jz_yidianh :xq_tez :jk_tingl :jz_erxingm :jk_chux :jk_chuany :marriage :operators
              :vocation :jz_yiweiz :jz_erweiz :jz_sheqyy :jk_xuey :jk_jib :districtid :jk_dingx :xq_tec
              :gender :live :retirewage :registration :jk_xiz :economy :jz_yixingm :mobilephone :jz_zhibdh :nation
              :statusnum :datatype :mapguid :ismap])

(def checkinfo {:fwlx_jjyl "" :fwlx_fwj "" :fwlx_mftj "":fwlx_dylnb "":fwlx_jgyl "" :fwlx_tyfw "" :fwlx_hjj ""
                :fwlx_qt "" :jk_rcws_st "" :jk_rcws_xl "" :jk_rcws_xt "" :jk_rcws_sy "" :jk_rcws_xj "" :jk_rcws_tx ""
                :jk_rcws_xzj "" :jk_rcws_xy "" :jk_bs_gaoxy "" :jk_bs_tangnb "" :jk_bs_fengs "" :jk_bs_xinzb ""
                :jk_bs_chid "" :jk_bs_guz "" :jk_bs_qit ""})
(def fimallyrelinfo [:lrgx_id :guanx :gx_name :gx_identityid :gx_gender :gx_birth :gx_telephone :gx_mobilephone
                     :gx_economy :gx_culture :gx_registration :gx_nation :gx_work])
(def oldlrid [:lr_id])

(def oldpeople [:districtid  :name  :identityid  :birthd  :gender  :age  :nation  :address  :type  :registration  :live  :marriage  :economy  :vocation  :securitid
                        :culture  :mobilephone  :telephone  :hjj_hjj  :hjj_kind  :hjj_type  :hjj_phone  :jz_yixingm  :jz_yiweiz  :jz_yidianh  :jz_erxingm  :jz_erweiz  :jz_erdianh
                        :jz_wuy  :jz_menwdh  :jz_zhibdh  :jz_sheqyy  :jz_yis  :jk_xuex  :jk_xuey  :jk_qibq  :jk_gms  :jk_shil  :jk_tingl  :jk_huod  :jk_chux  :jk_jiyl  :jk_chuany
                        :jk_dingx  :jk_xiz  :jk_jib  :jk_bs_gaoxy  :jk_bs_tangnb  :jk_bs_fengs  :jk_bs_xinzb  :jk_bs_chid  :jk_bs_guz  :jk_bs_qit  :xq_tez  :xq_aih  :xq_tec
                        :xq_huod  :xq_canjiast  :xq_jiaos  :status  :operator_date  :operators  :active  :fwlx_jjyl  :fwlx_fwj  :fwlx_mftj  :fwlx_dylnb  :fwlx_jgyl  :fwlx_tyfw
                        :fwlx_hjj  :fwlx_qt  :retirewage  :jk_rcws_st  :jk_rcws_xl  :jk_rcws_xt  :jk_rcws_sy  :jk_rcws_xj  :jk_rcws_tx  :jk_rcws_xzj  :jk_rcws_xy  :pensionimgpath
                        :prseno  :jz_lxdh  :statusnum :datatype :mapguid :ismap])
(def approve [:bstablepk :bstablename :status :aulevel :auflag :bstime :auuser :audesc :dvcode :appoperators ])
(def oldestpeople [:gn_id :name :gender :marriage :culture :address :telephone :districtid :gn_number :birthd :nation :registration :gntype :disease :zn_name1 :zn_phone1
                   :zn_workplace1 :zn_name2 :zn_phone2 :zn_workplace2 :zn_name3 :zn_phone3 :zn_workplace3 :zn_name4 :zn_phone4 :zn_workplace4 :emptyreason
                   :xq_watchtv :xq_exercise :xq_chess :xq_nohobby :xq_other :visittime :jj_childprovide :jj_retirepay :jj_remolition :jj_pension :jj_assistance :jj_deposit :jj_other
                   :monthincome :kn_eat :kn_bathe :kn_floor :kn_housework :kn_walk :kn_transit :kn_toilet :kn_bed :kn_nothing :fw_housekeeping :fw_treatment :fw_meal :fw_tend
                   :fw_doctor :fw_dailyshop :fw_aid :fw_hotline :fw_entertainment :fw_law :fw_chat :fw_nothing :lack :ispair :volunteername :volunteerphone :former :formdata])
(def oldcarepeople [:name :gender :marriage :culture :address :telephone :districtid :gn_number :birthd :nation :registration :gntype :disease :zn_name1 :zn_phone1
                   :zn_workplace1 :zn_name2 :zn_phone2 :zn_workplace2 :zn_name3 :zn_phone3 :zn_workplace3 :zn_name4 :zn_phone4 :zn_workplace4 :emptyreason
                   :xq_watchtv :xq_exercise :xq_chess :xq_nohobby :xq_other :visittime :jj_childprovide :jj_retirepay :jj_remolition :jj_pension :jj_assistance :jj_deposit :jj_other
                   :monthincome :kn_eat :kn_bathe :kn_floor :kn_housework :kn_walk :kn_transit :kn_toilet :kn_bed :kn_nothing :fw_housekeeping :fw_treatment :fw_meal :fw_tend
                   :fw_doctor :fw_dailyshop :fw_aid :fw_hotline :fw_entertainment :fw_law :fw_chat :fw_nothing :lack :ispair :volunteername :volunteerphone :former :formdata])
(def emptynestpeople [:kc_id :gn_number :name :gender :marriage :culture :address :telephone :districtid :birthd :nation :registration :gntype :disease :zn_name1 :zn_phone1 :zn_workplace1 :zn_name2 :zn_phone2 :zn_workplace2 :zn_name3 :zn_phone3 :zn_workplace3 :zn_name4 :zn_phone4 :zn_workplace4 :emptyreason :xq_watchtv :xq_exercise :xq_chess :xq_nohobby :xq_other :visittime :jj_childprovide :jj_retirepay :jj_remolition :jj_pension :jj_assistance :jj_deposit :jj_other :monthincome :kn_eat :kn_bathe :kn_floor :kn_housework :kn_walk :kn_transit :kn_toilet :kn_bed :kn_nothing :fw_housekeeping :fw_treatment :fw_meal :fw_tend :fw_doctor :fw_dailyshop :fw_aid :fw_hotline :fw_entertainment :fw_law :fw_chat :fw_nothing :ispair :volunteername :volunteerphone :zq_barrierfree :zq_pensionagency :zq_homecare :zq_volunteers :zq_other :zq_othervalue :age :havechildren])

(def v_oldapprove "v_oldapprove")
(def t_oldpeople "t_oldpeople")

;;测试函数
(defn test-getdivisionid [req]
  (let[params (:params req)
       dvname (:dvname params)
        sql (str "select * from division where dvname like '%" dvname "%' " )]
    (println sql)
  (resp/json (db/get-results-bysql sql))))


(defn importdata [data]
  (db/baisuidata data)
  (str "success"))


(defn getdistrictname [request]
  (let[params (:params request)
       districtid (:districtid params)]
    (resp/json (db/getdistrictname districtid))))



;;用户登录
(defn home [request]
  (try
    (if (session/get :usermsg)
;      (do (layout/render "index2.html" {:username (:username (session/get :usermsg))}))
      (do (layout/render "index2.html" {:username (:username (session/get :usermsg)) :usermsg (json/json-str (dissoc (session/get :usermsg) :passwd)  :escape-unicode false)}))
      (do (layout/render "login.html")))
    (catch Exception e (layout/render "login.html" {:loginmsg "服务器连接不上！"}))))

(defn loginbtn [request]
  (try
    (let
      [{params :params} request
       {loginname :username} params
       {passwd :password} params
       result (db/get-user loginname passwd)
       {username :username} result
       {userid :userid} result]
      (if result
        (do
;          (session/put! :username username)
;          (session/put! :loginname loginname)
          (session/put! :usermsg result)

;          (println (str "************************" (:username (session/get :usermsg)) "(" (:loginname (session/get :usermsg)) ")"))
          (str true))
        (str false)))
    (catch Exception e (layout/render "login.html" {:loginmsg "服务器连接不上！"}))))

(defn loginbtn2 [request]
  (if (= (loginbtn request) "true")
    (resp/redirect "/")
    (layout/render "login.html" {:loginmsg "用户名或密码错误！"})
    ))
;;注销
(defn logout [request]
  (println (str "########################" (:username (session/get :usermsg)) "(" (:loginname (session/get :usermsg)) ")"))
  (session/remove! :usermsg)
  (resp/redirect "/"))

(defn getsession []
  (resp/json (session/get :usermsg)))

(defn get-hometown [identityid]
  (let [code (subs identityid 0 6)              ;            (Integer/parseInt (subs identityid 0 6))
        jgdata (first(db/get-hometown code))]
    ;(println "GGGGGGGGGGGG" jgdata)
    (resp/json jgdata)))


;;查询所有养老信息
(defn get-olds
  ([page rows]
    (let [p (Integer/parseInt page)
          r (Integer/parseInt rows)
          c (count (db/get-olds ))]
      (if (<= (* p r) c)                              ;;分页
        (:body (resp/json {:total c :rows (subvec(db/get-olds) (* (dec p) r) (* p r))}))
        (:body (resp/json {:total c :rows (subvec(db/get-olds) (* (dec p) r) c)}))))))

;;根据关键字查询老人信息
(defn search-oldpeople [request]
    (let [{params :params} request
          {name :name} params
          {identityid :identityid} params
          oldtype (:oldtype params)
          minage (:minage params)
          maxage (:maxage params)
          {page :page} params
          {rows :rows} params
           optypecond (if (> (count oldtype) 0)  (str " and datatype = '" oldtype "'"))
           minagecond (if (> (count minage) 0)  (str " and age > " minage ))
           maxagecond (if (> (count maxage) 0)  (str " and age <= " maxage ))
           cond (str (common/likecond "name" name) (common/likecond "identityid" identityid) optypecond minagecond maxagecond)
          order (str " order by lr_id desc")
          getresult (common/fenye rows page t_oldpeople "*" cond order)]
          ;p (Integer/parseInt page)
          ;r (Integer/parseInt rows)
          ;c (count (db/search-oldpeople name identityid))
      ;(if (<= (* p r) c)                              ;;分页
       ; (:body (resp/json {:total c :rows (subvec(db/search-oldpeople name identityid) (* (dec p) r) (* p r))}))
        ;(:body (resp/json {:total c :rows (subvec(db/search-oldpeople name identityid) (* (dec p) r) c)})))
      (resp/json {:total (:total getresult) :rows (common/time-before-list (:rows getresult) "birthd") })
      ))

(defn getoldpeopledata [request]
  (let[params (:params request)
       colsfieldls (:colsfield params)
       genderrep (str "(case gender   when '1' then '男' when '0' then '女'  else '空'   END) as gender")
       datatyperep (str "(case datatype   when 's' then '三低老人' when 'f' then '居家养老' when 'j' then '机构养老' when 'k' then '老人卡' else '未划分'   END) as datatype")
       colsfield  (strs/replace (strs/replace colsfieldls "gender" genderrep) "datatype" datatyperep)
       datatype (:datatype params)
       name (:name params)
       identityid (:identityid params)
       minage (:minage params)
       maxage (:maxage params)
       minagecond (if (> (count minage) 0)  (str " and age > " minage ))
       maxagecond (if (> (count maxage) 0)  (str " and age <= " maxage ))
       typecond (if (> (count datatype) 0)  (str " and datatype = '" datatype "'"))
       cond (str (common/likecond "name" name) (common/likecond "identityid" identityid) typecond minagecond maxagecond)
       resultsql (str "select " colsfield " from " t_oldpeople " where 1=1 " cond " order by lr_id desc")
       ]
    (common/time-before-list (db/get-results-bysql resultsql) "birthd")))

;;根据关键字查询
(defn get-oldname
  ([name page rows]
    (let [p (Integer/parseInt page)
          r (Integer/parseInt rows)
          c (count (db/get-olds name))]
      (if (<= (* p r) c)                              ;;分页
        (:body (resp/json {:total c :rows (subvec(db/get-olds name) (* (dec p) r) (* p r))}))
        (:body (resp/json {:total c :rows (subvec(db/get-olds name) (* (dec p) r) c)}))))))

;;根据主键查询养老信息
(defn get-old [id]
  (layout/render
    "addold.html"
    {:old (:body (resp/json  (db/get-old id)))}))

(defn get-oldid [id]
 (resp/json  (db/get-old id)))

;;根据身份证查询养老信息
(defn get-id [id page rows]
  (let [p (Integer/parseInt page)
        r (Integer/parseInt rows)
        c (count (db/get-ids id))]
    (if (<= (* p r) c)
      (:body (resp/json {:total c :rows (subvec (db/get-ids id) (* (dec p) r) (* p r))}))
      (:body (resp/json {:total c :rows (subvec (db/get-ids id) (* (dec p) r) c)})))))


;(defn get-max []
;  (let [a (db/get-olds)]
;    (apply max
;      (loop [b [0] i 0]
;        (if (< i (count a))
;          (recur (conj b (get (a i) :lr_id)) (inc i)) b)
;        )))
;  )

;;家庭成员信息表主键
(defn oldsocrelkey []
  (let [keywordfami "famillyref"
        lrgxid (inc (:max (db/get-max keywordfami)))] (str lrgxid)))

;;新增养老家庭成员信息
(defn insert-oldsocrel [fields]
  (let [{olds_gx :params} fields
        keyword "olds"
        keywordfami "famillyref"
        lrgxid (inc (:max (db/get-max keywordfami)))]
    (db/insert-oldsocrel  (into {} (cons [:lr_id  (:max (db/get-max keyword))]
                                          (select-keys olds_gx fimallyrelinfo))))
    (str "true")))

;;修改后新增养老家庭成员信息
(defn editadd-oldsocrel [fields]
  (let [{olds_gx :params} fields]
    (db/insert-oldsocrel olds_gx)
    (str "true")))

;;养老信息录入，参数为养老信息录入页面提交的所有信息
(defn create-old [request]
  (let [params (:params request)
         datatype (:datatype params)
         {olds :params} request
        opseno (inc (:max (db/get-max "userlog")))        ;;获取自增主键
        digest (str "姓名" (:name (:params request))
                 " 身份证" (:identityid (:params request))
                 " 性别" (if (= (:gender (:params request)) "1") "男" "女"))
       ; tprkey (inc (:max (db/get-max "olds")))         ;;获取自增外键
       tprkey (:nextval (first(db/get-results-bysql "select seq_t_oldpeople.nextval  from dual")))
        functionid "mHLcDiwTflgEshNKIiOV"
        dvcode (:dvcode (:params request))
        loginname (:loginname (:params request))
        username  (:operators (:params request))
        auditid (inc (:max (db/get-max "audits")))                                                  ;;获取自增主键
        brief (str "姓名：" (:name params) " 身份证："(:identityid params)  )
        appdata {:bstablepk tprkey :bstablename "t_oldpeople" :status "1" :aulevel "0" :auflag "新增数据" :bstime (common/get-nowtime)
                 :appoperators username :auuser loginname  :messagebrief brief :bstablepkname "lr_id"}]
    (println "ssssss" opseno  auditid)
    (println "DDDDDDDDDDDD" (conj (select-keys olds (vec (keys checkinfo)))  {:opseno opseno}  ;;新增养老信息
                              (conj {:lr_id tprkey}
                                (common/timefmt-bef-insert (common/timefmt-bef-insert (select-keys olds oldinfo) "birthd")"operator_date"))))
    (db/create-old (conj (select-keys olds (vec (keys checkinfo)))   ;;新增养老信息
                     (conj {:lr_id tprkey :datatype (if (= (count datatype) 0) "s" datatype)}
                       (common/timefmt-bef-insert (common/timefmt-bef-insert (select-keys olds oldinfo) "birthd")"operator_date"))))
    ;(cons (select-keys olds (vec (keys checkinfo)))    ;;新增养老信息
     ; (cons [:lr_id tprkey]
    ;    (common/timefmt-bef-insert (common/timefmt-bef-insert (select-keys olds oldinfo) "birthd")"operator_date")))
    (db/create-userlog opseno digest tprkey functionid dvcode loginname username)     ;;新增对应的操作日志
    (db/create-audit opseno auditid)             ;;新增对应的审核表
    (db/add-approve appdata)                                                                           ;;将新增数据添加到审核表中
;    (resp/json {:success true :msg "add success"})
    (str "true")
    ))


(defn sele_oldsocrel [gx_name]
  (str (db/sele_oldsocrel gx_name)))

;;修改养老信息，参数为养老信息修改页面提交的所有信息
(defn update-old [request]
  (let [params (:params request)
         {olds :params} request
        opseno (inc (:max (db/get-max "userlog")))           ;;获取自增主键
        digest (str "姓名" (:name (:params request))
                 " 身份证" (:identityid (:params request))
                 " 性别" (if (= (:gender (:params request)) "1") "男" "女"))
        dvcode (:dvcode (:params request))
        loginname (:loginname (:params request))
        username (:operators (:params request))
        auditid (:auditid (db/get-audit (:lr_id (:params request))))       ;;根据外键查询审核表得到审核主键
       lr_id (:lr_id  params)
        brief (str "姓名：" (:name params) " 身份证："(:identityid params)  )
        appdata {:bstablepk lr_id :bstablename "t_oldpeople" :status "1" :aulevel "0" :auflag "修改数据" :bstime (common/get-nowtime)
                 :appoperators username :auuser loginname :messagebrief brief :bstablepkname "lr_id"}]
    ;(println lr_id  "    "  (select-keys olds oldinfo))
    ;(println (conj (conj checkinfo (select-keys  olds (vec (keys checkinfo)))) (select-keys olds oldinfo)))
    (db/update-old (conj (conj checkinfo (select-keys  olds (vec (keys checkinfo)))) (select-keys olds oldinfo)) lr_id)      ;;修改养老信息表
    ;(db/create-userlog opseno                    ;;新增对应的操作日志
     ; (str digest " 信息修改") (:lr_id (:params request)) "mHLcDiwTflgEshNKIiOV" dvcode loginname username)
    #_(if (= (:status (:params request)) "驳回")            ;;判断要修改养老信息的状态
      (do (db/update-oldstatus "自由" (:lr_id (:params request)))  ;;驳回的状态下
        (db/create-userlog (inc (:max (db/get-max "userlog")))    ;;新增对应的操作日志
          (str digest " 驳回处理") auditid "txFUV5pFpWVLv6Th4vQl" dvcode loginname username)
        (db/update-audit "0" "0" dvcode "驳回已处理" loginname    ;;修改对应的审核表
          (inc (:max (db/get-max "userlog"))) "0" auditid opseno))
      (db/update-audit "0" "0" "" "" "" "" "0" auditid opseno))    ;;自由的状态下，修改对应审核表

    (db/update-approveby-lrid  lr_id "t_oldpeople")                                    ;;修改审核表的状态
    (db/add-approve appdata)                                                 ;;添加新的审核表历史状态
    (str "true")))



;;修改养老家庭成员信息
(defn update-oldsorel [reuqest]
  (let [{oldsocrel :params} reuqest] (str oldsocrel )
    (resp/json (db/update-oldsorel  (into {} (cons (select-keys oldsocrel oldlrid)
                                               (select-keys oldsocrel fimallyrelinfo)))
                                    (:lrgx_id oldsocrel)))))

;;删除家庭成员关系表
(defn dele-oldsorel [lrgx_id]
  (resp/json (db/dele-oldsorel lrgx_id)))

;;删除养老信息，参数为用户页面提交的所有信息
(defn delete-old [request]
  (let [{olds :params} request
        opseno (inc (:max (db/get-max "userlog")))        ;;获取自增主键
        digest (str "姓名" (:name (:params request))
                 " 身份证" (:identityid (:params request))
                 " 性别" (if (= (:gender (:params request)) "1") "男" "女"))
        dvcode (:dvcode (:params request))
        loginname (:loginname (:params request))
        username (:operators (:params request))
        auditid (:auditid (db/get-audit (:lr_id (:params request))))]    ;;根据外键查询审核表得到审核主键
    (db/delete-old (:lr_id (:params request)))    ;;根据主键删除养老信息
    (db/create-userlog opseno (str digest " 信息删除")          ;;新增对应的操作日志
      (:lr_id (:params request)) "mHLcDiwTflgEshNKIiOV" dvcode loginname username)
    (db/delete-audit auditid)          ;;根据主键删除对应的审核表
    (db/create-userlog (inc (:max (db/get-max "userlog"))) (str digest " 信息删除") auditid "txFUV5pFpWVLv6Th4vQl" dvcode loginname username)
    (str "删除成功")))

;;待办业务查询
;(defn get-audits [functionid loginname dvcode page rows]
(defn get-audits [functionid page rows]
  (let [p (Integer/parseInt page)
        r (Integer/parseInt rows)
        loginname (:loginname (session/get :usermsg))
        dvcode (:dvcode (session/get :usermsg))
        c (+ (count (db/get-audits functionid loginname dvcode))
             (count (db/get-backaudits functionid loginname dvcode)))]
    (if (<= (* p r) c)                              ;;分页
      (:body (resp/json {:total c :rows (subvec (into(db/get-audits functionid loginname dvcode)
                                                   (db/get-backaudits functionid loginname dvcode))
                                        (* (dec p) r) (* p r))}))
      (:body (resp/json {:total c :rows (subvec (into(db/get-audits functionid loginname dvcode)
                                                  (db/get-backaudits functionid loginname dvcode))
                                          (* (dec p) r) c)})))))

;;修改审核表
(defn update-audit [flag aulevel digest tprkey auditid dvcode loginname username opseno]
  (let [status (nth ["自由" "提交" "审核" "审批"] (inc (Integer/parseInt aulevel)));;得到审核字段
        level   (str (inc (Integer/parseInt aulevel)))
        auopseno (inc (:max (db/get-max "userlog")))
        username1 (:username (session/get :usermsg))
        functionid "txFUV5pFpWVLv6Th4vQl"]
    (if (= flag "通过")
      (do (db/update-oldstatus  status tprkey)  ;;修改老人表状态
        (db/create-userlog auopseno (str digest " "status flag) auditid functionid dvcode loginname username1);;新增审核日志
        (if (= (inc (Integer/parseInt aulevel)) 3)  ;;修改审核表   (判断)
          (db/update-audit level "1" dvcode (str status flag) loginname auopseno "1" auditid opseno)
          (db/update-audit level "1" dvcode (str status flag) loginname auopseno "0" auditid opseno)))
      (do (db/update-oldstatus "驳回" tprkey)   ;;修改老人表状态为驳回
        (db/create-userlog auopseno (str digest " "status flag) auditid functionid dvcode loginname username1)      ;;新增审核日志
        (db/update-audit level "0" dvcode (str status flag) loginname auopseno "1" auditid opseno)))      ;;修改审核表
;    (layout/render "audit.html" {:funcid "txFUV5pFpWVLv6Th4vQl" :functionid "mHLcDiwTflgEshNKIiOV"})
    (resp/json {:success true :message "通过"})
    ))    ;;待办业务
;    (layout/render "audit.html" {:funcid "txFUV5pFpWVLv6Th4vQl" :functionid "mHLcDiwTflgEshNKIiOV"})))    ;;待办业务

;(defn add-approve [result]                                                                               "添加审核表的数据"
;  (db/add-approve result)
;  (str "add success"))

;(defn update-approve [sh_id result]                                                                  "修改审核表的状态"
;  (db/update-approve sh_id result)
;  (str "update success"))

;(defn update-approveby-lrid [bstablepk]                                                           "更改审核表的历史状态"
;  (db/update-approveby-lrid bstablepk)
;  (str "update success"))

;(defn update-tablestatus [idname id tablename]                                                 "审核完成修改被审批表的状态"
;  (db/set-tablestatus idname id tablename)
;  (str "update success"))



(defn add-approve0 [params]                                                                       "首次提交"
  (let[appdata (select-keys params approve)
        ;bstablepk (:bstablepk params)                                                                  ;获取被审批表的主键
       ;bstablename (:bstablename params)                                                           ;获取被审批表名
       ;status "1"                                                                                                     ;历史状态为1
       bstime (common/get-nowtime)                                                                ;获取审批时间
       ;auuser (:auuser params)                                                                             ;审批人
       ;audesc (:audesc params)                                                                           ;审批详细
       ;aulevel "1"                                                                                                   ;审批等级
       ;auflag "提交成功"                                                                              ;审核状态
       ;dvcode (:dvcode params)                                                                         ;行政区划
       ;sql (str "select operators from "bstablename" where lr_id = " bstablepk )    ;获取被审批表中的提交人姓名
       appoperators (:operators params)
       newappdata (conj appdata {:status "1" :bstime bstime :aulevel  "1"  :auflag "提交通过" :appoperators appoperators})
       ]
    ;;(update-approveby-lrid [bstablepk])                                                          ;;将上一条数据状态改变成历史状态
    ;{:bstablepk bstablepk :bstablename bstablename :status status :bstime bstime :auuser auuser :audesc audesc :aulevel aulevel :auflag auflag :dvcode dvcode :appoperators appoperators}
    newappdata
    ))

(defn set-approve2 [params]                                                                           "审批通过"
  (let[appdata (select-keys params approve)
       ; bstablepk (:bstablepk params)
      ; bstablename (:bstablename params)
       ;idname (if (= bstablename "t_oldpeople") "lr_id")
      ;auuser (:auuser params)
      ;audesc (:audesc params)
      ;dvcode (:dvcode params)
      bstime (common/get-nowtime)
      appoperators  (:operators params)
      ; sql (str "select operators from "bstablename" where lr_id = " bstablepk )    ;获取被审批表中的提交人姓名
      ;appoperators (:operators params)
       ;newappdata (conj appdata {:aulevel "3" :auflag "审批通过" :bstime (common/get-nowtime) :auuser auuser :audesc audesc :dvcode dvcode :appoperators operators})
       newappdata (conj appdata {:status "0" :bstime bstime :aulevel "3" :auflag "审批通过"  :appoperators appoperators})
       ]
    newappdata))

(defn set-approve1 [params]
  (let[appdata (select-keys params approve)
       ; auuser (:auuser params)
      ;audesc (:audesc params)
      ;bstablename (:bstablename params)
     ; bstablepk (:bstablepk params)
      newaulevel (str(inc(read-string (:aulevel params))))
      ;dvcode (:dvcode params)
      ;sql (str "select operators from "bstablename" where lr_id = " bstablepk )    ;获取被审批表中的提交人姓名
      appoperators (:operators params)
      auflag (if (= newaulevel "1") "提交通过" "审核通过")
     ; newappdata (conj approvedate {:status "1"}{:aulevel newaulevel}{:auflag auflag}{:bstime (common/get-nowtime)}{:auuser auuser}{:audesc audesc}{:dvcode dvcode}{:appoperators appoperators} )
      newappdata (conj appdata {:status "1" :aulevel newaulevel :bstime (common/get-nowtime) :auflag auflag  :appoperators appoperators})
     ]
    ;{:bstablepk bstablepk :bstablename bstablename :status "1" :aulevel newaulevel :auflag auflag :bstime (common/get-nowtime) :auuser auuser :audesc audesc :dvcode dvcode :appoperators appoperators}
    ;(update-approveby-lrid  bstablepk)                                                            ;修改审批表的状态
    ;(add-approve newappdata)                                                                         ;添加一条审核记录
   ; (resp/json {:success true :message "approve success"})
    newappdata))

(defn set-audit [params]
  (let[appdata (select-keys params approve)
       newaulevel (str(inc(read-string (:aulevel params))))
       auflag (cond (= newaulevel "1") "提交成功"
                (= newaulevel "2") "审核成功"
                (= newaulevel "3") "审批成功")
       newappdata (conj appdata {:status "1" :aulevel newaulevel :bstime (common/get-nowtime) :auflag auflag})
       ]
    newappdata))

(defn set-approvefail [params]
  (let[appdata (select-keys params approve)
       ;sh_id (:sh_id params)
       ;auuser (:auuser params)
       ;audesc (:audesc params)
       ;bstablename (:bstablename params)
       ;bstablepk (:bstablepk params)
      ;dvcode (:dvcode params)
       ;sql (str "select operators from "bstablename" where lr_id = " bstablepk )    ;获取被审批表中的提交人姓名
       appoperators (:operators params)
      aulevel (:aulevel params)
      auflag (cond (= (count aulevel) 0) "提交不通过"
                          (= aulevel "0")   "提交不通过"
                          (= aulevel "1")   "审核不通过"
                          (= aulevel "2")   "审批不通过")
       ;newappdata (conj approvedate {:status "1"}{:aulevel "0"}{:auflag "不通过"}{:bstime (common/get-nowtime)}{:auuser auuser}{:audesc audesc}{:operators operators} )
       newappdata (conj appdata {:status "1" :aulevel "0" :bstime (common/get-nowtime) :auflag auflag :appoperators appoperators})
       ]
     ;(if (not= (count aulevel) 0) (update-approveby-lrid  bstablepk))                                                        ;修改审批表的状态
     ;(add-approve newappdata)                                                                         ;添加一条审核记录
    ;{:bstablepk bstablepk :bstablename bstablename :status "1" :aulevel "0" :auflag auflag :bstime (common/get-nowtime) :auuser auuser :audesc audesc :dvcode dvcode :appoperators appoperators}
    newappdata))

(defn set-auditfail [params]
  (let[appdata (select-keys params approve)
       aulevel (:aulevel params)
       auflag (cond (= aulevel "0")   "提交不通过"
                          (= aulevel "1")   "审核不通过"
                          (= aulevel "2")   "审批不通过")
       newappdata (conj appdata {:status "1" :aulevel "0" :bstime (common/get-nowtime) :auflag auflag })
       ]
    newappdata))




(defn set-audit-approve0 [params]                                                                    "老人信息首次提交"
  (let[appdata (add-approve0 params)
       ]
    (db/add-approve appdata)                                                                           ;添加一条审核信息
    (str "audit success")))

(defn set-audit-approve2 [params]                                                                    "老人信息待审批"
  (let[idname "lr_id"
      ;signname "status"
       bstablepk (:bstablepk params)
       bstablename (:bstablename params)
       appdata (set-approve2 params)]
    (db/update-approveby-lrid bstablepk "t_oldpeople")                                                        ;更新上一次评估信息为历史状态
    (db/add-approve appdata)                                                                          ;添加本次评估信息记录
    (db/set-tablestatus idname bstablepk bstablename)                                        ;将老人数据的状态更改为正式数据状态
    (str "audit success")))

(defn set-audit-approve1 [params]                                                                   "老人信息再次提交和审核"
  (let[bstablepk (:bstablepk params)
        appdata (set-approve1 params)
       ]
    (db/update-approveby-lrid bstablepk "t_oldpeople")                                                        ;更新上次评估信息的为历史状态
    (db/add-approve appdata)))                                                                        ;添加本次评估信息记录

(defn set-audit-approvefail [params]                                                                 "老人信息审核不通过"
  (let[aulevel (:aulevel params)
        bstablepk (:bstablepk params)
        appdata (set-approvefail params)]
    (if (not= (count aulevel) 0)  (db/update-approveby-lrid bstablepk "t_oldpeople"))                                                        ;修改审批表的状态
    (db/add-approve appdata)                                                                        ;添加一条审核记录
    (str "audit not pass")))

(defn audit-fun [request]                                                                                   "老人信息审核"
  (let[params (:params request)
       auflag (:auflag params)
       aulevel (:aulevel params)]
    (if (= auflag "通过")
      (cond (= (count aulevel) 0)   (set-audit-approve0 params)                                 ;首次提交
                (= aulevel "2")     (set-audit-approve2 params)                                         ;待审批
                 :else (set-audit-approve1 params))                                                          ;待提交和待审核
      (set-audit-approvefail params))                                                                            ;审核不通过
;    (resp/json {:success true :message "approve success"})
    (str "true")
    ))

(defn auditsuccess [params]                                                                               "审核通过"
  (let[bstablepk (:bstablepk params)
       appdata (set-audit  params)
       idname (:bstablepkname params)
       bstablename (:bstablename params)
       aulevel (:aulevel params)
       ]
    (db/update-approveby-lrid bstablepk "t_oldpeople")                                                        ;更新上次审核信息的为历史状态
    (db/add-approve appdata)                                                                          ;添加新的审核信息
    (if (= aulevel "3") (db/set-tablestatus idname bstablepk bstablename))        ;如果审批通过，将老人数据的状态更改为正式数据状态
    ))

(defn auditfailed [params]                                                                                  "审核不通过"
  (let[aulevel (:aulevel params)
       bstablepk (:bstablepk params)
       appdata (set-auditfail params)]
    (db/update-approveby-lrid bstablepk "t_oldpeople")                                                      ;修改审批表的状态
    (db/add-approve appdata)                                                                        ;添加一条审核记录
    (str "audit not pass")))

(defn new-audit-fun [request]                                                                           "审核"
  (let[params (:params request)
       auflag (:auflag params)]
    (if (= auflag "通过")
        (auditsuccess params)
        (auditfailed params))
    (resp/json {:success true :message "audit success"})))


(defn set-evaluate-approve0 [params]                                                               "首次评估"
  (let[appdata (add-approve0 params)
       ]
    (db/add-approve appdata)                                                                           ;添加一条审核信息
    (str "evaluate success")))

(defn set-evaluate-approve2 [params]
  (let[idname "pg_id"
       ;signname "active"
       bstablepk (:bstablepk params)
       bstablename (:bstablename params)
       appdata (set-approve2 params)]
    (db/update-approveby-lrid bstablepk "t_oldpeople")                                                        ;更新上一次评估信息为历史状态
    (db/add-approve appdata)                                                                          ;添加本次评估信息记录
    (db/set-tablestatus idname bstablepk bstablename)                     ;将老人评估数据的状态更改为正式数据状态
    (str "evaluate success")))

(defn set-evaluate-approve1 [params]
  (let[bstablepk (:bstablepk params)
       appdata (set-approve1 params)
       ]
    (db/update-approveby-lrid bstablepk "t_oldpeople")                                                        ;更新上次评估信息的为历史状态
    (db/add-approve appdata)                                                                          ;添加一条审核记录
    (str "evaluate success")))

(defn set-evaluate-approvefail [params]
  (let[aulevel (:aulevel params)
       bstablepk (:bstablepk params)
       appdata (set-approvefail params)]
    (if (not= (count aulevel) 0)  (db/update-approveby-lrid bstablepk "t_oldpeople"))            ;修改审批表的状态
    (db/add-approve appdata)                                                                         ;添加一条审核记录
    (str "evaluate not pass")))

(defn evaluate-oldpeople [request]                                                                    "评估信息审核"
  (let[params (:params request)
       auflag (:auflag params)
       aulevel (:aulevel params)
       ]
    (if (= auflag "通过")
      (cond (= (count aulevel) 0)   (set-evaluate-approve0 params)                   ;首次提交
        (= aulevel "2")     (set-evaluate-approve2 params)                                  ;待审批
        :else (set-evaluate-approve1 params))                                                    ;待提交和待审核
      (set-evaluate-approvefail params))                                                          ;审核不通过
    (resp/json {:success true :message "approve success"})))




(defn get-auditpeople [request]
  (let[{params :params}request
       {page :page}params
       {rows :rows}params
       name (:name params)
       identityid (:identityid params)
       auuser  (:username (session/get :usermsg))
       cond (str (common/likecond "name" name) (common/likecond  "identityid" identityid))
       getresult (common/fenye rows page v_oldapprove "*" cond " order by lr_id desc")]
    (resp/json {:total (:total getresult) :rows (map #(conj % {:loginuser auuser} )(common/time-formatymd-before-list (:rows getresult) "bstime"))})))

;;根据外键查询操作日志
(defn get-logs [functionid page rows]
  (let [p (Integer/parseInt page)
        r (Integer/parseInt rows)
        c (count (db/get-userlogs functionid))]
    (if (<= (* p r) c)                              ;;分页
;      (:body (resp/json {:total c :rows (subvec (common/time-formatymd-before-list (db/get-userlogs functionid) "bstime") (* (dec p) r) (* p r))}))
;      (:body (resp/json {:total c :rows (subvec (common/time-formatymd-before-list (db/get-userlogs functionid) "bstime") (* (dec p) r) c)})))))
      (:body (resp/json {:total c :rows (subvec (db/get-userlogs functionid) (* (dec p) r) (* p r))}))
      (:body (resp/json {:total c :rows (subvec (db/get-userlogs functionid) (* (dec p) r) c)})))))
(defn get-operationlog [request]
  (let [{params :params} request
        {page :page} params
        {rows :rows} params
        loginname (session/get :usermsg)
        p (Integer/parseInt page)
        r (Integer/parseInt rows)
        c (count (db/get-operationlog loginname))]
    (if (<= (* p r) c)                              ;;分页
      (:body (resp/json {:total c :rows (subvec (db/get-operationlog loginname) (* (dec p) r) (* p r))}))
      (:body (resp/json {:total c :rows (subvec (db/get-operationlog loginname) (* (dec p) r) c)}))))
  )

;;折叠框转换
(defn accordion [ad username]
  (let [leaf (count (db/get-funcs username (:functionid ad)))]
    (assoc  ad :id (:functionid ad) :leaf (if (> leaf 0) false true) :leafcount leaf
           :state (if (> leaf 0) "closed" "open") :text (:title ad) :value (:location ad))))

;;获取折叠框
(defn get-funcs [username functionid]
  (let [ads (db/get-funcs username functionid)]
    (resp/json (map #(accordion % username) ads))))

;;获取输入框下拉选项列表
(defn get-inputlist [aaa100]
  (resp/json {:result true :msg (db/get-inputlist aaa100)}))

;;行政区树转换
(defn divisiontree [dv]
  (let [leaf (count (db/get-divisionlist (:dvcode dv)))]
    {:text (:dvname dv) :divisionpath (:totalname dv) :id (:dvrank dv) :parentid (:dvcode dv)
            :iconCls (if (> leaf 0) "" "division-tree-leaf") :leaf (if (> leaf 0) false true)
            :state (if (> leaf 0) "closed" "open")}))

;;获取行政区划下拉选项列表
(defn get-divisionlist [dvhigh]
  (let [dv (db/get-divisionlist dvhigh)]
    (resp/json (map #(divisiontree %) dv))))

;;查询家庭成员关系表
(defn get-oldsocrel [lr_id]
  (resp/json (db/get-oldsocrel lr_id)))

(defn get-yljg []
;  (exec-raw ["SELECT * FROM t_mpensionagence"] :results)
  (resp/json (db/get-yljg))
  )


;;老人信息统计

(defn op-dmstatis [params]
  (let[districtid (:districtid params)
       length (if(=(count districtid)6) 9 12)
       ]
    (if (> (count districtid) 9)
      (str "SELECT s.districtid,s.opsum,dv.dvname FROM division dv,
(SELECT districtid,SUM(opsum) AS opsum FROM
(SELECT d.dvcode AS districtid,0 opsum FROM division d WHERE d.dvcode = '" districtid "'
UNION ALL
SELECT districtid,COUNT(*) AS opsum FROM t_oldpeople WHERE districtid = '" districtid "' GROUP BY districtid )
GROUP BY districtid) s
WHERE s.districtid = dv.dvcode ORDER BY s.districtid")
      (str "SELECT s.districtid,s.opsum,dv.dvname FROM division dv,
(SELECT districtid,SUM(opsum) AS opsum FROM
(SELECT d.dvcode AS districtid,0 opsum FROM division d WHERE d.dvhigh = '" districtid "'
UNION ALL
SELECT substr(districtid,0," length ") AS districtid ,COUNT(*) AS opsum FROM t_oldpeople WHERE districtid like '" districtid "%'  GROUP BY substr(districtid,0," length "))
GROUP BY districtid) s
WHERE s.districtid = dv.dvcode ORDER BY s.districtid"))))

(defn op-xbstatis [params]
  (let[districtid (:districtid params)
        districtcond (if (> (count districtid) 0)  (str " and districtid LIKE '" districtid "%'"))
        ]
    (str "SELECT (case gender   when '1' then '男' when '0' then '女'  else '空'   END) AS sex,COUNT(*) AS opsum FROM T_OLDPEOPLE
    WHERE 1=1 " districtcond "  GROUP BY gender")))


(defn op-sjstatis [params]
  (let[districtid (:districtid params)
       timfun      (:timfun params)
       typetime   (:typetime params)
       starttime   (:starttime params)
       endtime   (:endtime params)]
    (condp = timfun
      "yyyy" (str "SELECT to_char(OPERATOR_DATE,'yyyy') AS tname,count(*) AS tsum FROM t_oldpeople where districtid like '" districtid "%' GROUP BY to_char(OPERATOR_DATE,'yyyy') ORDER BY to_number(to_char(OPERATOR_DATE,'yyyy')) ASC")
      "Q"     (str "SELECT CONCAT('" typetime "-',to_char(OPERATOR_DATE,'Q')) AS tname,count(*) AS tsum FROM t_oldpeople where  districtid  like '" districtid "%' and  to_char(OPERATOR_DATE,'yyyy') = '" typetime "'  GROUP BY to_char(OPERATOR_DATE,'Q') ORDER BY to_number(to_char(OPERATOR_DATE,'Q')) ASC")
      "mm"  (str "SELECT CONCAT('" typetime "-',to_char(OPERATOR_DATE,'mm')) AS tname,count(*) AS tsum FROM t_oldpeople where  districtid  like '" districtid "%' and   to_char(OPERATOR_DATE,'yyyy') = '" typetime "' GROUP BY to_char(OPERATOR_DATE,'mm') ORDER BY to_number(to_char(OPERATOR_DATE,'mm')) ASC")
      "md"   (str "SELECT to_char(OPERATOR_DATE,'yyyy-mm-dd') AS tname,count(*)  AS tsum  FROM t_oldpeople where  districtid  like '" districtid "%' and   to_char(OPERATOR_DATE,'yyyy-mm') = '" typetime "'  GROUP BY to_char(OPERATOR_DATE,'yyyy-mm-dd') ORDER BY to_date(to_char(OPERATOR_DATE,'yyyy-mm-dd'),'yyyy-mm-dd') ASC")
      "dd"    (str "SELECT to_char(OPERATOR_DATE,'yyyy-mm-dd') AS tname,count(*) AS tsum  FROM t_oldpeople where  districtid  like '" districtid "%' and   OPERATOR_DATE between to_date('" starttime "','yyyy-mm-dd') and to_date('" endtime "','yyyy-mm-dd')  GROUP BY to_char(OPERATOR_DATE,'yyyy-mm-dd') ORDER BY to_date(to_char(OPERATOR_DATE,'yyyy-mm-dd'),'yyyy-mm-dd') ASC")
      )))

(defn opstatistic [request]
  (let[params (:params request)
       statistype (:statistype params)
       opstatis-sql (condp = statistype
                    "dm" (op-dmstatis params)
                    "sj"   (op-sjstatis params)
                    "xb" (op-xbstatis params))
       ]
    (println opstatis-sql)
    (resp/json (db/get-results-bysql opstatis-sql))))




(defn opstatistic2 [request]
  (let[params (:params request)
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
       starttimecond   (if (> (count starttime) 0) (str " and OPERATOR_DATE >= to_date('" starttime "','yyyy-mm-dd') ")  )
       endtimecond   (if (> (count endtime) 0) (str " and OPERATOR_DATE <= to_date('" endtime "','yyyy-mm-dd') " ) )
       districtidcond (if (> (count districtid) 0) (str " and districtid like '" districtid "%' ")  )
       gendercond (if (> (count gender) 0 ) (str " and gender = '" gender "' ") )
       tjconds (str starttimecond endtimecond  districtidcond gendercond )            ;分组查询条件
       sjgroup (condp = sj                                                                                    ;时间分组
                     "Y"      (str " to_char(OPERATOR_DATE,'yyyy') ")
                      "Q"      (str " CONCAT(to_char(OPERATOR_DATE,'yyyy'),to_char(OPERATOR_DATE,'Q')) ")
                      "M"     (str " CONCAT(to_char(OPERATOR_DATE,'yyyy'),to_char(OPERATOR_DATE,'mm')) ")
                      "D"       (str " to_char(OPERATOR_DATE,'yyyy-mm-dd') ")
                       nil       )
       dqgroup (if (= dq "dq") (condp = dlength                                                   ;地区分组
                      6   (str " substr(districtid,0,9) ")
                      9   (str " substr(districtid,0,12) ")
                      12   " substr(districtid,0,12)  "
                      nil))

        xbgroup (if (= xb "xb") (str " (case gender   when '1' then '男' when '0' then '女'  else '空'   END) ")   nil)                   ;性别分组
        groups (str (if sjgroup (str sjgroup ",")) (if dqgroup (str dqgroup ",")) (if xbgroup (str xbgroup ",")))                            ;组合分组
        groupwith (if (> (count groups) 0) (subs groups 0 (dec(count groups)))  (str " substr(districtid,0,6) "))
        opstatissql (str "SELECT s.*,dv.dvname FROM (select " (if sjgroup sjgroup "null") " as operator ," (if dqgroup dqgroup (if (>(count districtid)0) districtid "330424") ) " as districtid, " (if xbgroup xbgroup "null") " as gender,count(*) as opsum
                                from " t_oldpeople " where 1=1 " starttimecond endtimecond districtidcond gendercond " group by " groupwith ") s LEFT JOIN division dv ON s.districtid = dv.dvcode")]
    (println "SSSSSSSSSSSSSS" opstatissql)
    (resp/json (common/fenye rows page (str "(" opstatissql ")") "*" ""  ""))))




(defn opstatistic3 [request]
  (let[params (:params request)
       minage (:minage params)
       maxage (:maxage params)
       districtid (:districtid params)
       gender (:gender params)
       datatype (:datatype params)
       dlength (count districtid)
       nl (:nl params)
       dq (:dq params)
       xb (:xb params)
       lb (:lb params)
       rows (:rows params)
       page (:page params)
       minagecond (if (> (count minage) 0) (str " and age > " minage)  )
       maxagecond   (if (> (count maxage) 0) (str " and age <= " maxage)  )
       ;starttimecond   (if (> (count starttime) 0) (str " and OPERATOR_DATE >= to_date('" starttime "','yyyy-mm-dd') ")  )
       ;endtimecond   (if (> (count endtime) 0) (str " and OPERATOR_DATE <= to_date('" endtime "','yyyy-mm-dd') " ) )
       districtidcond (if (> (count districtid) 0) (str " and districtid like '" districtid "%' ")  )
       gendercond (if (> (count gender) 0 ) (str " and gender = '" gender "' ") )
       datatypecond (if (> (count datatype) 0 )   (str " and datatype = '" datatype "' "))
       tjconds (str minagecond maxagecond  districtidcond gendercond datatypecond)            ;分组查询条件
       agevalue (cond
                        (and  (> (count minage) 0) (> (count maxage) 0))  (str  minage "-"maxage"岁")
                        (and (> (count minage) 0) (= (count maxage) 0))  (str minage "岁以上")
                        (and (= (count minage) 0) (> (count maxage) 0))  (str maxage "岁以下"))
       gendervalue (cond
                               (= gender "0")  "女"
                               (= gender "1")  "男")
       typevalue (cond
                             (= datatype "s") "三低老人"
                             (= datatype "f") "居家养老"
                            (= datatype "j")  "机构养老"
                           (= datatype "k")  "老年卡")
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
       lbgroup (if (= lb "lb") (str " (case datatype   when 's' then '三低老人' when 'f' then '居家养老' when 'j' then '机构养老' when 'k' then '老人卡' else '未划分'   END)  "))
       groups (str (if agegroup (str agegroup ",")) (if dqgroup (str dqgroup ",")) (if xbgroup (str xbgroup ",")) (if lbgroup (str lbgroup ",")))                            ;组合分组
       groupwith (if (> (count groups) 0) (subs groups 0 (dec(count groups)))  (str " substr(districtid,0,6) "))
       opstatissql (str "SELECT s.*,dv.dvname FROM (select " (if agegroup agegroup (str " '" agevalue "' ")) " as agevalue ," (if dqgroup dqgroup (if (>(count districtid)0) districtid "330424") ) " as districtid, " (if xbgroup xbgroup (str " '" gendervalue "' ")) " as gender, " (if lbgroup lbgroup (str " '" typevalue "' ")) " as oldtype, count(*) as opsum
                                from " t_oldpeople " where 1=1 " tjconds " group by " groupwith ") s LEFT JOIN division dv ON s.districtid = dv.dvcode")]
    (println "SSSSSSSSSSSSSS" opstatissql)
    (resp/json (common/fenye rows page (str "(" opstatissql ")") "*" ""  ""))
))

(defn emptynest-statistic
  "空巢老人数据统计"
  [request]
  (let[params (:params request)
       choicecols (select-keys params (:kccols common/selectcols))     ;其他条件
       statictype1 (:statictype params)   ;统计类型
       statictype (if (> (count statictype1) 0) statictype1 "xzqh")
       districtid (:districtid params)     ;地名（条件）
       minage (:minage params)             ;最小年龄（条件）
       maxage (:maxage params)             ;最大年龄（条件）

       districtvalue (if (> (count districtid) 0) districtid "330424")   ;如果districtid为空，设置默认为330424
       ;;查询条件
       districtidcond (if (> (count districtid) 0) (str " and districtid like '" districtid "%' ")  )
       minagecond (if (> (count minage) 0) (str " and age2 > " minage)  )
       maxagecond (if (> (count maxage) 0) (str " and age2 <= " maxage) )
       choicecond  (apply str (map #(if (> (count(second %)) 0) (str " and "  (name(first %)) " = " (second %))) choicecols))
       ;;合并查询条件
       tjconds (str districtidcond minagecond maxagecond choicecond)
       ;;根据所选分组分组处理数据字段

       encol (cond
               (= statictype "xzqh" ) (condp = (count districtvalue)                                                   ;地区分组
                                        6   (str " substr(districtid,0,9) ")
                                        9   (str " substr(districtid,0,12) ")
                                        12   " substr(districtid,0,12)  ")
               (= statictype "xb")    (str " (case gender   when '1' then '男' when '0' then '女'  else '未明确'   END) ")
               (= statictype "nl")    (str " (CASE WHEN age2 < 60 THEN '60 岁以下'
                                            WHEN age2 >= 60 AND age2 < 70 THEN '60-70岁'
                                            WHEN age2 >= 70 AND age2< 80 THEN '70-80岁'
                                            WHEN age2 >= 80 AND age2 < 90 THEN '80-90岁'
                                            WHEN age2 >= 90 THEN '90岁以上'
                                            ELSE '年龄未知' END)")
               (= statictype "lb")    (str " (case GNTYPE   when '1' then '低保' when '2' then '低保边缘户' when '3' then '低收入户' when '4' then '失独' when '5' then '重残' when '6' then '其他' else '未明确'   END) ")
               (= statictype "hy")    (str " (case MARRIAGE   when '1' then '未婚' when '2' then '已婚' when '3' then '离婚' when '4' then '分居' when '5' then '丧偶' when '6' then '其他'  else '未明确'   END) ")
               (= statictype "wh")    (str " (case CULTURE   when '1' then '文盲' when '2' then '小学 ' when '3' then '初中' when '4' then '高中' when '5' then '大专以上' else '未明确'   END) ")
               (= statictype "kcyy")  (str " (case EMPTYREASON   when '1' then '经济原因' when '2' then '家庭成员关系原因 ' when '3' then '生活习惯' when '4' then '其他'  else '未明确'   END) ")
               (= statictype "twpl")  (str " (case VISITTIME   when '1' then '一两天' when '2' then '一周' when '3' then '两周' when '4' then '一个月' when '5' then '二个月' when '6' then '一个季度' when '7' then '半年' when '8' then '一年及以上' else '未明确'   END) ")
               (= statictype "grysr") (str " (case MONTHINCOME   when '1' then '无收入' when '2' then '不足200' when '3' then '200~499' when '4' then '500~999' when '5' then '1000~1499' when '6' then '1500~2000' when '7' then '2000及以上'  else '未明确'   END) ")
               (= statictype "zn")    (str " (case havechildren   when '1' then '有子女' when '0' then '无子女'  else '未明确'   END) ")
               :else nil
               )
       ;;为查找统计数据信息添加数值
       enselect (cond
                 (= statictype "xzqh" )  (if (> (count encol) 0) encol " null ")
                 (= statictype "xb")     (if (> (count encol) 0) " gender " " null ")
                 (= statictype "nl")     (if (> (count encol) 0) encol " null ")
                 (= statictype "lb")     (if (> (count encol) 0) " gntype " " null ")
                 (= statictype "hy")     (if (> (count encol) 0) " marriage " " null ")
                 (= statictype "wh")     (if (> (count encol) 0) " culture " " null ")
                 (= statictype "kcyy")   (if (> (count encol) 0) " emptyreason " " null ")
                 (= statictype "twpl")   (if (> (count encol) 0) " visittime " " null ")
                 (= statictype "grysr")  (if (> (count encol) 0) " monthincome " " null ")
                 (= statictype "zn")     (if (> (count encol) 0) " havechildren " " null ")
                 :else " null "
                 )
       ;;根据所选分组设置查找字段
       envalue (cond
                 (= statictype "xqah") (conj [] (str " '看电视' as statictype,sum(XQ_WATCHTV) as sum,'XQ_WATCHTV' as staticvalue," districtvalue " as districtid ") (str " '锻炼' as statictype,sum(XQ_exercise) as sum,'XQ_exercise' as staticvalue," districtvalue " as districtid " ) (str " '下棋' as statictype,sum(XQ_chess) as sum,'XQ_chess' as staticvalue," districtvalue " as districtid ") (str " '没有爱好' as statictype,sum(XQ_nohobby) as sum,'XQ_nohobby' as staticvalue," districtvalue " as districtid ") (str " '其他爱好' as statictype,sum(XQ_other) as sum,'XQ_other' as staticvalue," districtvalue " as districtid "))
                 (= statictype "jjly") (conj [] (str " '子女提供' as statictype,sum(JJ_CHILDPROVIDE) as sum,'JJ_CHILDPROVIDE' as staticvalue," districtvalue " as districtid ") (str " '退休工资' as statictype,sum(JJ_RETIREPAY) as sum,'JJ_RETIREPAY' as staticvalue," districtvalue " as districtid " ) (str " '拆迁补偿' as statictype,sum(JJ_REMOLITION) as sum,'JJ_REMOLITION' as staticvalue," districtvalue " as districtid ") (str " '养老保险' as statictype,sum(JJ_PENSION) as sum,'JJ_PENSION' as staticvalue," districtvalue " as districtid ") (str " '社会救助' as statictype,sum(JJ_ASSISTANCE) as sum,'JJ_ASSISTANCE' as staticvalue," districtvalue " as districtid ") (str " '存款红利及租金' as statictype,sum(JJ_DEPOSIT) as sum,'JJ_DEPOSIT' as staticvalue," districtvalue " as districtid ") (str " '其他 ' as statictype,sum(JJ_OTHER) as sum,'JJ_OTHER' as staticvalue," districtvalue " as districtid "))
                 (= statictype "knhd") (conj [] (str " '吃饭' as statictype,sum(KN_EAT) as sum,'KN_EAT' as staticvalue," districtvalue " as districtid ") (str " '洗澡' as statictype,sum(KN_BATHE) as sum,'KN_BATHE' as staticvalue," districtvalue " as districtid " ) (str " '上下楼梯' as statictype,sum(KN_FLOOR) as sum,'KN_FLOOR' as staticvalue," districtvalue " as districtid ") (str " '简单家务' as statictype,sum(KN_HOUSEWORK) as sum,'KN_HOUSEWORK' as staticvalue," districtvalue " as districtid ") (str " '室内行走' as statictype,sum(KN_WALK) as sum,'KN_WALK' as staticvalue," districtvalue " as districtid ") (str " '乘公共交通工具' as statictype,sum(KN_TRANSIT) as sum,'KN_TRANSIT' as staticvalue," districtvalue " as districtid ")(str " '上厕所 ' as statictype,sum(KN_TOILET) as sum,'KN_TOILET' as staticvalue," districtvalue " as districtid ")(str " '上下床' as statictype,sum(KN_BED) as sum,'KN_BED' as staticvalue," districtvalue " as districtid ")(str " '以上都没有' as statictype,sum(KN_NOTHING) as sum,'KN_NOTHING' as staticvalue," districtvalue " as districtid "))
                 (= statictype "xyfw") (conj [] (str " '家政服务' as statictype,sum(FW_HOUSEKEEPING) as sum,'FW_HOUSEKEEPING' as staticvalue," districtvalue " as districtid ") (str " '送医送药上门' as statictype,sum(FW_TREATMENT) as sum,'FW_TREATMENT' as staticvalue," districtvalue " as districtid " ) (str " '送饭' as statictype,sum(FW_MEAL) as sum,'FW_MEAL' as staticvalue," districtvalue " as districtid ") (str " '日间照料中心' as statictype,sum(FW_TEND) as sum,'FW_TEND' as staticvalue," districtvalue " as districtid ") (str " '陪同看病' as statictype,sum(FW_DOCTOR) as sum,'FW_DOCTOR' as staticvalue," districtvalue " as districtid ")(str " '代购日常物品 ' as statictype,sum(FW_DAILYSHOP) as sum,'FW_DAILYSHOP' as staticvalue," districtvalue " as districtid ")(str " '紧急救助  ' as statictype,sum(FW_AID) as sum,'FW_AID' as staticvalue," districtvalue " as districtid ")(str " '老年人服务热线  ' as statictype,sum(FW_HOTLINE) as sum,'FW_HOTLINE' as staticvalue," districtvalue " as districtid ")(str " '文化娱乐  ' as statictype,sum(FW_ENTERTAINMENT) as sum,'FW_ENTERTAINMENT' as staticvalue," districtvalue " as districtid ")(str " '法律服务  ' as statictype,sum(FW_LAW) as sum,'FW_LAW' as staticvalue," districtvalue " as districtid ")(str " '聊天解闷  ' as statictype,sum(FW_CHAT) as sum,'FW_CHAT' as staticvalue," districtvalue " as districtid ")(str " '以上都不需要  ' as statictype,sum(FW_NOTHING) as sum,'FW_NOTHING' as staticvalue," districtvalue " as districtid "))
                 (= statictype "shzq")  (conj [] (str " '无障碍设施服务' as statictype,sum(ZQ_BARRIERFREE) as sum,'ZQ_BARRIERFREE' as staticvalue," districtvalue " as districtid ") (str " '入住养老机构' as statictype,sum(ZQ_PENSIONAGENCY) as sum,'ZQ_PENSIONAGENCY' as staticvalue," districtvalue " as districtid " ) (str " '居家养老服务' as statictype,sum(ZQ_HOMECARE) as sum,'ZQ_HOMECARE' as staticvalue," districtvalue " as districtid ") (str " '志愿者结对服务' as statictype,sum(ZQ_VOLUNTEERS) as sum,'ZQ_VOLUNTEERS' as staticvalue," districtvalue " as districtid ") (str " '其他' as statictype,sum(ZQ_OTHER) as sum,'ZQ_OTHER' as staticvalue," districtvalue " as districtid "))
                 :else (conj [] (str encol " as statictype,count(*) as sum ," enselect " as staticvalue," districtvalue " as districtid "))
                 )
       ;;如果是单选分类，就进行group by分类
       engroup  (if encol  (str " group by " encol "," enselect)  "")

       ;;将所有信息合成SQL语句
       enstatictsql (apply str (interpose " union all "(map #(str " SELECT s.*,dv.dvname FROM (select " %
                       " from (select floor(months_between(sysdate,t.birthd)/12) as age2,t.*  from t_emptynestpeople t where isdel is null )
                      where 1=1 " tjconds  engroup " ) s LEFT JOIN division dv ON s.districtid = dv.dvcode") envalue)))
       resultsql (if (= statictype "xzqh" ) (str "SELECT r.sum,r.dvname,r.districtid,r.staticvalue, dv2.dvname as statictype from( " enstatictsql " ) r     LEFT JOIN division dv2    ON r.statictype = dv2.dvcode order by statictype asc ")
                                            (str "select * from ("enstatictsql  ")order by statictype asc" ))
       ]
    (resp/json (db/get-results-bysql resultsql))
    ;(str resultsql)
    ))

(defn get-emptynest-detail
  "查看空巢老人统计数据详细信息"
  [request]
  (let[params (:params request)
       statictype (:statictype params)
       gender (:gender params)
       minage (:minage params)
       maxage (:maxage params)
       staticvalue (:staticvalue params)
       page (:page params)
       rows (:rows params)
       staticcond (cond
                    (= statictype "xzqh")  (if (= staticvalue "330424") (str " and districtid = 330424 ") (str " and districtid like '" staticvalue "%' "))
                    (= statictype "xb")    (if (= (count staticvalue) 0) (str " and gender is null ") (str " and gender = " staticvalue))
                    (= statictype "nl")  (cond
                                           (= staticvalue "60 岁以下") (str " and age2 < 60 ")
                                           (= staticvalue "60-70岁") (str " and age2 >= 60 and age2 < 70 ")
                                           (= staticvalue "70-80岁") (str " and age2 >= 70 and age2 < 80 ")
                                           (= staticvalue "80-90岁") (str " and age2 >= 80 and age2 < 90 ")
                                           (= staticvalue "90岁以上") (str " and age2 >= 90 ")
                                           :else " and age2 is null ")
                    (= statictype "lb") (if (= (count staticvalue) 0) (str " and GNTYPE is null ") (str " and GNTYPE = " staticvalue))
                    (= statictype "hy") (if (= (count staticvalue) 0) (str " and MARRIAGE is null ") (str " and MARRIAGE = " staticvalue))
                    (= statictype "wh") (if (= (count staticvalue) 0) (str " and CULTURE is null ") (str " and CULTURE = " staticvalue))
                    (= statictype "kcyy") (if (= (count staticvalue) 0) (str " and EMPTYREASON is null ") (str " and EMPTYREASON = " staticvalue))
                    (= statictype "twpl") (if (= (count staticvalue) 0) (str " and VISITTIME is null ") (str " and VISITTIME = " staticvalue))
                    (= statictype "grysr") (if (= (count staticvalue) 0) (str " and MONTHINCOME is null ") (str " and MONTHINCOME = " staticvalue))
                    (= statictype "zn")    (if (= (count staticvalue) 0) (str " and havechildren is null ") (str " and havechildren = " staticvalue))
                    :else (str " and " staticvalue " = 1 ")
                    )
       gendercond (if (or (= (count gender) 0)  (= statictype "xb")) " " (str " and gender = " gender) )
       minagecond (if (> (count minage) 0) (str " and age2 >= " minage))
       maxagecond (if (> (count maxage) 0) (str " and age2 < " maxage))
       selectcond (str staticcond gendercond minagecond maxagecond)
       getresult (common/fenye rows page " (select floor(months_between(sysdate,t.birthd)/12) as age2,t.*  from t_emptynestpeople t where isdel is null ) " "*" selectcond " order by kc_id desc")
       ]
    (resp/json {:total (:total getresult)  :rows (common/time-before-list (:rows getresult) "birthd")})))



(defn add-oldestpeople [request]
  (let[params (:params request)
        oldestdata (select-keys params oldestpeople)
        olddata (conj request {:params (conj params {:datatype "g"})})]
    (create-old olddata)                                               ;;添加到基础老人表
    (db/add-oldestpeople (common/timefmt-bef-insert (common/timefmt-bef-insert oldestdata "birthd") "formdata"))
    (str "success")))

(defn add-oldcarepeople [request]
  (let[params (:params request)
       oldestdata (select-keys params oldcarepeople)
       identityid   (:identityid params)                                     ;获取身份证信息
       ishave    (count (first (db/selectdatas-by-tablename "t_oldpeople" {:identityid identityid})))           ;查找老人数据库是否存在该身份证的老人
       olddata (conj request {:params (conj params {:datatype "f"})})]
    (println "OOOOOOOO" oldestdata identityid olddata)
    ;(create-old olddata)                                               ;;添加到基础老人表
    ; (db/add-oldestpeople (common/timefmt-bef-insert (common/timefmt-bef-insert oldestdata "birthd") "formdata"))
    (if (> (count identityid) 0)
      (if (> ishave 0) (db/updatedata-by-tablename "t_oldpeople" {:datatype "f"} {:identityid identityid}) (db/adddata-by-tablename "t_olepeople" olddata))) ;;老人库中存在该身份证信息，更新数据库数据类型，否则添加新的数据
    (db/adddata-by-tablename "t_oldcarepeople" (common/dateformat-bf-insert oldestdata "birthd" "formdata"))      ;添加优抚老人数据
    (str "success")))

(defn set-oldmap [request]
  (let[params (:params request)
        mapguid (:mapguid params)
        ismap (:ismap params)]
    (println "MMMMMMMMMMMMMM" mapguid  "   " ismap)
    (db/update-setoldmap ismap mapguid)
    (resp/json {:success true :message "map set success"})))

(defn add-emptynestpeople
  "添加空巢老人数据"
  [request]
  (let[params (:params request)
       endata (select-keys params emptynestpeople)
       olddata (conj request {:params (conj params {:datatype "e"})})               ;将空巢老人数据添加到老年人数据库中，空巢老人数据标识为e
       ]
    (create-old olddata)
    (db/add-emptynestpeople (common/timefmt-bef-insert endata "birthd"))
    (str "success")
    ))

(defn get-emptynestpeople
  "查找空巢老人数据"
  [request]
  (let[params (:params request)
       page (:page params)
       rows (:rows params)
       identityid (:identityid params)
       name (:name params)
       gender (:gender params)
       minage (:minage params)
       maxage (:maxage params)
       gendercond (if (>(count gender) 0) (str " and gender = " gender))
       minagecond (if (>(count minage) 0) (str " and age2 >= " minage))
       maxagecond (if (>(count maxage) 0) (str " and age2 < " maxage))
       cond (str (common/likecond "name" name)(common/likecond "identityid" identityid) gendercond minagecond maxagecond )
       getresult (common/fenye rows page " (select floor(months_between(sysdate,t.birthd)/12) as age2,t.*  from t_emptynestpeople t where isdel is null ) " "*" cond " order by kc_id desc")
       ]
    (resp/json {:total (:total getresult)  :rows (common/time-before-list (:rows getresult) "birthd")})))

(defn update-emptynestpeople
  "更新空巢老人数据"
  [request]
  (let[params (:params request)
       kc_id (:kc_id params)
       endata (select-keys params emptynestpeople)]
    (db/update-emptynestpeople (common/timefmt-bef-insert endata "birthd") kc_id)
    (str "success")))

(defn del-emptynestpeople
  "注销空巢老人数据"
  [request]
  (let[params (:params request)
       kc_id (:kc_id params)
       endata {:isdel "y"}]                     ;;将数据注销表示设置为：y
    (db/update-emptynestpeople endata kc_id)
    (str "success")))


(defn insert-olddata [sql]
  (db/insert-old-data  sql))


(defn getdivisionbyid [highid]
  (println (str "select t.*,t.DVNAME AS text from division t WHERE dvhigh =  " highid))
  (resp/json (db/get-results-bysql (str "select t.*,t.DVNAME AS text from division t WHERE dvhigh =  " highid))))



