(ns newpension.controller.old
  (:use compojure.core)
  (:use korma.core
        [korma.db :only [oracle]])
  (:require [newpension.models.db :as db]
            [noir.response :as resp]
            [newpension.layout :as layout]
            ))

(def oldinfo [:jk_qibq :xq_aih :jk_jiyl :address :hjj_hjj :jz_erdianh :jz_lxdh :age :status :jk_gms :culture  :jk_xuex  :jz_yis  :birthd  :xq_canjiast :telephone :xq_huod :hjj_kind :name :pensionimgpath :hjj_phone :jz_wuy  :xq_jiaos :jk_shil :jk_huod :identityid :type :operator_date :jz_menwdh :hjj_type :jz_yidianh :xq_tez :jk_tingl :jz_erxingm :jk_chux :jk_chuany :marriage :operators :vocation :jz_yiweiz :jz_erweiz :jz_sheqyy :jk_xuey :jk_jib :districtid :jk_dingx :xq_tec :gender :live :retirewage :registration :jk_xiz :economy :jz_yixingm :mobilephone :jz_zhibdh :nation])

(defn login [name pwd]
  (if (= name "")
    (if (= pwd "")
      (layout/render
        "login.html"
        {:loginmsg "用户名和密码不能为空"})
      (layout/render
        "login.html"
        {:loginmsg "用户名不能为空"}))
    (if (= pwd "")
      (layout/render
        "login.html"
        {:loginmsg "密码不能为空"})
      (if (= (db/get-user name) nil)
        (layout/render
          "login.html"
          {:loginmsg "用户不存在"})
        (if (= (db/get-user name pwd) nil)
          (layout/render
            "login.html"
            {:loginmsg "密码输入错误"})
          (layout/render
            "base.html"
            {:loginname (:loginname (db/get-user name pwd))
             :dvcode (:regionid (db/get-user name pwd))
             :username (:username (db/get-user name pwd))}))))))

(defn get-olds
  ([] (layout/render
        "old.html"
        {:olds (:body (resp/json {:total (count (db/get-olds )) :rows (db/get-olds)}))}))
  ([name] (layout/render
            "old.html"
            {:olds (:body (resp/json {:total (count (db/get-olds name)) :rows (db/get-olds name)}))})))

(defn get-old [id]
  (layout/render
    "addold.html"
    {:old (:body (resp/json  (db/get-old id)))}))

;(defn get-oldbyid [id]
;  (layout/render
;    "addold.html"
;    {:old (:body (resp/json  (db/get-oldbyid id)))}))

;(defn get-max []
;  (let [a (db/get-olds)]
;    (apply max
;      (loop [b [0] i 0]
;        (if (< i (count a))
;          (recur (conj b (get (a i) :lr_id)) (inc i)) b)
;        )))
;  )


(defn create-old [request]
  (let [{olds :params} request
        keyword "olds"
        opseno (inc (:max (db/get-max "userlog")))
        digest (str "姓名" (:name (:params request))
                 " 身份证" (:identityid (:params request))
                 " 性别" (if (= (:gender (:params request)) "1") "男" "女"))
        tprkey (inc (:max (db/get-max "olds")))
        functionid "mHLcDiwTflgEshNKIiOV"
        dvcode (:dvcode (:params request))
        loginname (:loginname (:params request))
        username  (:operators (:params request))
        auditid (inc (:max (db/get-max "audits")))]
    ;    (resp/json {:success true :msg (str
    (db/create-old
      (into {} (cons [:lr_id (inc (:max (db/get-max keyword)))]
                 (select-keys olds oldinfo))))
    (db/create-userlog opseno digest tprkey functionid dvcode loginname username)
    (db/create-audit opseno auditid)
    (str "录入成功")))


(defn update-old [request]
  ;  (str (:gender (:params request)) ))
  (let [{olds :params} request
        opseno (inc (:max (db/get-max "userlog")))
        digest (str "姓名" (:name (:params request))
                 " 身份证" (:identityid (:params request))
                 " 性别" (if (= (:gender (:params request)) "1") "男" "女"))
        dvcode (:dvcode (:params request))
        loginname (:loginname (:params request))
        username (:operators (:params request))
        auditid (:auditid (db/get-audit (:lr_id (:params request))))]
    (db/update-old (select-keys olds oldinfo) (:lr_id (:params request)))
    (db/create-userlog opseno (str digest " 信息修改") (:lr_id (:params request)) "mHLcDiwTflgEshNKIiOV" dvcode loginname username)
    (if (= (:status (:params request)) "驳回")
      (do (db/update-oldstatus "自由" (:lr_id (:params request)))
        (db/create-userlog (inc (:max (db/get-max "userlog"))) (str digest " 驳回处理") auditid "txFUV5pFpWVLv6Th4vQl" dvcode loginname username)
        (db/update-audit "0" "0" dvcode "驳回已处理" loginname (inc (:max (db/get-max "userlog"))) "0" auditid opseno))
      (db/update-audit "0" "0" "" "" "" "" "0" auditid opseno))
    (str "修改成功")))

(defn delete-old [request]
  (let [{olds :params} request
        opseno (inc (:max (db/get-max "userlog")))
        digest (str "姓名" (:name (:params request))
                 " 身份证" (:identityid (:params request))
                 " 性别" (if (= (:gender (:params request)) "1") "男" "女"))
        dvcode (:dvcode (:params request))
        loginname (:loginname (:params request))
        username (:operators (:params request))
        auditid (:auditid (db/get-audit (:lr_id (:params request))))]
    (db/delete-old (:lr_id (:params request)))
    (db/create-userlog opseno (str digest " 信息删除") (:lr_id (:params request)) "mHLcDiwTflgEshNKIiOV" dvcode loginname username)
    (db/delete-audit auditid)
    (db/create-userlog (inc (:max (db/get-max "userlog"))) (str digest " 信息删除") auditid "txFUV5pFpWVLv6Th4vQl" dvcode loginname username)
    (str "删除成功")))

(defn get-audits [functionid loginname dvcode]
  (layout/render
    "audit.html"
    {:audits (:body (resp/json {:total (count (db/get-audits functionid loginname dvcode)) :rows (db/get-audits functionid loginname dvcode)}))
     :bkaudits (:body (resp/json {:total (count (db/get-backaudits functionid loginname dvcode)) :rows (db/get-backaudits functionid loginname dvcode)}))}))

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
    (get-audits "mHLcDiwTflgEshNKIiOV" loginname dvcode)))    ;;待办业务

(defn get-logs [functionid]
  (layout/render
    "log.html"
    {:logs (:body (resp/json {:total (count (db/get-userlogs functionid)) :rows (db/get-userlogs functionid)}))}))

(defn get-funcs [username]
  (str (:functionid (nth (db/get-funcs username "businessmenu") 2))))

