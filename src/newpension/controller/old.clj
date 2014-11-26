(ns newpension.controller.old
  (:use compojure.core)
  (:use korma.core
        [korma.db :only [oracle]])
  (:require [newpension.models.db :as db]
            [noir.response :as resp]
            [newpension.layout :as layout]
            [noir.session :as session]
            [clojure.data.json :as json]
            ))

(def oldinfo [:jk_qibq :xq_aih :jk_jiyl :address :hjj_hjj :jz_erdianh :jz_lxdh :age :status :jk_gms :culture
              :jk_xuex  :jz_yis  :birthd  :xq_canjiast :telephone :xq_huod :hjj_kind :name :pensionimgpath
              :hjj_phone :jz_wuy  :xq_jiaos :jk_shil :jk_huod :identityid :type :operator_date :jz_menwdh
              :hjj_type :jz_yidianh :xq_tez :jk_tingl :jz_erxingm :jk_chux :jk_chuany :marriage :operators
              :vocation :jz_yiweiz :jz_erweiz :jz_sheqyy :jk_xuey :jk_jib :districtid :jk_dingx :xq_tec
              :gender :live :retirewage :registration :jk_xiz :economy :jz_yixingm :mobilephone :jz_zhibdh :nation
              ])

(def checkinfo {:fwlx_jjyl "" :fwlx_fwj "" :fwlx_mftj "":fwlx_dylnb "":fwlx_jgyl "" :fwlx_tyfw "" :fwlx_hjj ""
                :fwlx_qt "" :jk_rcws_st "" :jk_rcws_xl "" :jk_rcws_xt "" :jk_rcws_sy "" :jk_rcws_xj "" :jk_rcws_tx ""
                :jk_rcws_xzj "" :jk_rcws_xy "" :jk_bs_gaoxy "" :jk_bs_tangnb "" :jk_bs_fengs "" :jk_bs_xinzb ""
                :jk_bs_chid "" :jk_bs_guz "" :jk_bs_qit ""})
(def fimallyrelinfo [:lrgx_id :guanx :gx_name :gx_identityid :gx_gender :gx_birth :gx_telephone :gx_mobilephone
                     :gx_economy :gx_culture :gx_registration :gx_nation :gx_work])
(def oldlrid [:lr_id])

;;用户登录
(defn login [request]
  (try
    (let
      [{params :params} request
       {loginname :username} params
       {passwd :password} params
       result (db/get-user loginname passwd)
       {username :username} result
       {userid :userid} result]
      (if result
        (do (session/put! :user_id userid) (layout/render "dm.html" (session/put! :username username)))
        (layout/render "login.html"))
      (if (session/get :username)
        (layout/render "dm.html" {:username (session/get :username)})
        (layout/render "login.html")))
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
        (do (session/put! :username username) (session/put! :loginname loginname) (str true))
        (str false)))
    (catch Exception e (layout/render "login.html" {:loginmsg "服务器连接不上！"}))))
;;注销
(defn logout [request]
  (session/remove! :username))

;;查询所有养老信息
(defn get-olds
  ([page rows]
    (let [p (Integer/parseInt page)
          r (Integer/parseInt rows)
          c (count (db/get-olds ))]
      (if (<= (* p r) c)                              ;;分页
        (:body (resp/json {:total c :rows (subvec(db/get-olds) (* (dec p) r) (* p r))}))
        (:body (resp/json {:total c :rows (subvec(db/get-olds) (* (dec p) r) c)}))))))

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
  (let [{olds :params} request
        opseno (inc (:max (db/get-max "userlog")))        ;;获取自增主键
        digest (str "姓名" (:name (:params request))
                 " 身份证" (:identityid (:params request))
                 " 性别" (if (= (:gender (:params request)) "1") "男" "女"))
        tprkey (inc (:max (db/get-max "olds")))         ;;获取自增外键
        functionid "mHLcDiwTflgEshNKIiOV"
        dvcode (:dvcode (:params request))
        loginname (:loginname (:params request))
        username  (:operators (:params request))
        auditid (inc (:max (db/get-max "audits")))]       ;;获取自增主键
    (db/create-old (into {} (cons (select-keys olds (vec (keys checkinfo)))    ;;新增养老信息
                              (cons [:lr_id tprkey]
                                (select-keys olds oldinfo)))))
    (db/create-userlog opseno digest tprkey functionid dvcode loginname username)     ;;新增对应的操作日志
    (db/create-audit opseno auditid)             ;;新增对应的审核表
    (str "新增成功")))

(defn sele_oldsocrel [gx_name]
  (str (db/sele_oldsocrel gx_name)))

;;修改养老信息，参数为养老信息修改页面提交的所有信息
(defn update-old [request]
  (let [{olds :params} request
        opseno (inc (:max (db/get-max "userlog")))           ;;获取自增主键
        digest (str "姓名" (:name (:params request))
                 " 身份证" (:identityid (:params request))
                 " 性别" (if (= (:gender (:params request)) "1") "男" "女"))
        dvcode (:dvcode (:params request))
        loginname (:loginname (:params request))
        username (:operators (:params request))
        auditid (:auditid (db/get-audit (:lr_id (:params request))))]       ;;根据外键查询审核表得到审核主键
    (db/update-old (into {} (cons (conj checkinfo (select-keys  olds (vec (keys checkinfo)))) (select-keys olds oldinfo))) (:lr_id (:params request)))      ;;修改养老信息表
    (db/create-userlog opseno                    ;;新增对应的操作日志
      (str digest " 信息修改") (:lr_id (:params request)) "mHLcDiwTflgEshNKIiOV" dvcode loginname username)
    (if (= (:status (:params request)) "驳回")            ;;判断要修改养老信息的状态
      (do (db/update-oldstatus "自由" (:lr_id (:params request)))  ;;驳回的状态下
        (db/create-userlog (inc (:max (db/get-max "userlog")))    ;;新增对应的操作日志
          (str digest " 驳回处理") auditid "txFUV5pFpWVLv6Th4vQl" dvcode loginname username)
        (db/update-audit "0" "0" dvcode "驳回已处理" loginname    ;;修改对应的审核表
          (inc (:max (db/get-max "userlog"))) "0" auditid opseno))
      (db/update-audit "0" "0" "" "" "" "" "0" auditid opseno))    ;;自由的状态下，修改对应审核表
    (str "修改成功")))

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
(defn get-audits [functionid loginname dvcode page rows]
  (let [p (Integer/parseInt page)
        r (Integer/parseInt rows)
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
        functionid "txFUV5pFpWVLv6Th4vQl"]
    (if (= flag "通过")
      (do (db/update-oldstatus  status tprkey)  ;;修改老人表状态
        (db/create-userlog auopseno (str digest " "status flag) auditid functionid dvcode loginname username);;新增审核日志
        (if (= (inc (Integer/parseInt aulevel)) 3)  ;;修改审核表   (判断)
          (db/update-audit level "1" dvcode (str status flag) loginname auopseno "1" auditid opseno)
          (db/update-audit level "1" dvcode (str status flag) loginname auopseno "0" auditid opseno)))
      (do (db/update-oldstatus "驳回" tprkey)   ;;修改老人表状态为驳回
        (db/create-userlog auopseno (str digest " "status flag) auditid functionid dvcode loginname username)      ;;新增审核日志
        (db/update-audit level "0" dvcode (str status flag) loginname auopseno "1" auditid opseno)))      ;;修改审核表
    (layout/render "audit.html" {:funcid "txFUV5pFpWVLv6Th4vQl" :functionid "mHLcDiwTflgEshNKIiOV"})))    ;;待办业务

;;根据外键查询操作日志
(defn get-logs [functionid page rows]
  (let [p (Integer/parseInt page)
        r (Integer/parseInt rows)
        c (count (db/get-userlogs functionid))]
    (if (<= (* p r) c)                              ;;分页
      (:body (resp/json {:total c :rows (subvec (db/get-userlogs functionid) (* (dec p) r) (* p r))}))
      (:body (resp/json {:total c :rows (subvec (db/get-userlogs functionid) (* (dec p) r) c)})))))

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


