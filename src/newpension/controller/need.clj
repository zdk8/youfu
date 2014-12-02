(ns newpension.controller.need
  (:use compojure.core)
  (:use korma.core
        [korma.db :only [oracle]])
  (:import (java.sql Timestamp))
  (:require [newpension.models.db :as db]
            [noir.response :as resp]
            [newpension.layout :as layout]
            ))

(def needinfo [:lr_id :dl_name :dl_relation :dl_telephone :dl_mobilephone :dl_beiz :sh_zongf :sh_pingguf :sh_pingguy
               :jj_pingguf :jj_pingguy :jz_pingguf :jz_pingguy :nl_pingguf :nl_pingguy  :gx_pingguf :gx_pingguy
               :zf_pingguy :cz_pingguy :jb_pingguy :pinggusum :standard :startdate :enddate :facilitator :content
               :amount :operator_date :active :zf_pingguf :cz_pingguf :jb_pingguf :prseno])
(def checkneed {:sh_jings "" :sh_yid "" :sh_weis "" :sh_ruc "" :sh_xiz "" :sh_xingz "" :sh_lout "" :sh_chuany ""
                :sh_dab "" :sh_xiaob "" :sh_jiel "" :jj_shour "" :jj_fenl "" :jj_leix "" :jz_fenl "" :jz_zhaol ""
                :nl_fenl "" :gx_laom "" :gx_youf "" :gx_youf_kind "" :gx_chunjg "" :gx_ganb "" :cz_shil "" :cz_tingl ""
                :cz_zhit "" :cz_qit "" :cz_shuom "" :zf_lianzf "" :zf_zhulf "" :zf_shiyf "" :zf_shangpf "" :zf_zijf ""
                :zf_qit "" :jb_gaoxy "" :jb_xinlsj "" :jb_guanxb "" :jb_xinlshic "" :jb_manxzhiqguany "" :jb_feiqz ""
                :jb_feixb "" :jb_feiy "" :jb_naoxguanyw "" :jb_pajshensz "" :jb_laonchidz "" :jb_youyz "" :jb_tangnb ""
                :jb_tongf "" :jb_zhitguz "" :jb_jianzy "" :jb_jinzb "" :jb_leifshigjiey "" :jb_gandjib "" :jb_bainz ""
                :jb_qinguany "" :jb_shiwmoxguanjib "" :jb_tangnbingswangmbingb "" :jb_shenzjib "" :jb_qit1 ""
                :jb_qit2 "" :jb_qit3 "" :jb_beiz ""})
(def needsuminfo [:canzhangqingkuang :zhufangqingkuang :zhongdajibing :pinggusum :standard :fuwuxingshi
                  :pingguyname :pingguyphone :pingguydept :servicedate :shequcomment :xianzhengcomment
                  :minzhengcomment ])
(def checksum {:sum_gx_chunjg "" :sum_gx_ganb "" :sum_gx_laom "" :sum_gx_youf "" :sum_jj_shour "" :sum_jz_fenl ""
               :sum_nl_fenl "" :sum_sh_jiel ""})

;;评估信息转换
(defn need [nd]
  (into (into (db/get-old (:lr_id nd)) nd) (db/get-needsum (:pg_id nd))))

;;查询评估信息
(defn get-needs []
  (let [nd (db/get-needs)]
    (:body (resp/json {:total (count nd) :rows (map #(need %) nd)}))))

;;人员评估信息查询
(defn search-oldassessment [request]
  (let [{params :params} request
        {name :name} params
        {identityid :identityid} params
        {page :page} params
        {rows :rows} params
        p (Integer/parseInt page)
        r (Integer/parseInt rows)
        c (count (db/search-oldassessment name identityid))
        ]
    (println "%%%%%%%%%%%%%%%%%%" (db/search-oldassessment name identityid))
;    )
    (if (<= (* p r) c)                              ;;分页
      (:body (resp/json {:total c :rows (subvec(db/search-oldassessment name identityid) (* (dec p) r) (* p r))}))
      (:body (resp/json {:total c :rows (subvec(db/search-oldassessment name identityid) (* (dec p) r) c)}))))
  )

(defn tneed [id]
  (layout/render
    "addneed.html"
    {:id id}))

;;根据主键查询评估信息
(defn get-need [id]
  (resp/json (into (into (db/get-old (:lr_id (db/get-need id))) (db/get-need id)) (db/get-needsum id))))

;;评估信息录入
(defn create-need [request]
  (let [{needs :params} request
        id (inc (:max (db/get-max "needs")))
        opseno (inc (:max (db/get-max "userlog")))        ;;获取自增主键
        digest (str "姓名" (:name (:params request))
                 " 身份证" (:identityid (:params request))
                 " 性别" (if (= (:gender (:params request)) "1") "男" "女"))
;        tprkey (inc (: (db/get-max "olds")))         ;;获取自增外键
        functionid "wJhlMNIq8C20mH7Bm6tj"
        dvcode (:dvcode (:params request))
        loginname (:loginname (:params request))
        username  (:operators (:params request))
        auditid (inc (:max (db/get-max "audits")))
        date (new Timestamp (System/currentTimeMillis))]
    (db/create-need (into {} (cons (select-keys needs (vec (keys checkneed)))
                               (cons [:pg_id id] (select-keys needs needinfo)))))
    (db/create-needsum (into {} (cons (select-keys needs (vec (keys checksum)))
                                  (cons [:pingguenddate date] (cons [:pg_id id] (select-keys needs needsuminfo))))))
    (db/create-userlog opseno digest id functionid dvcode loginname username)     ;;新增对应的操作日志
    (db/create-audit opseno auditid)             ;;新增对应的审核表
    (str "成功")))

;评估信息修改
(defn update-need [request]
  (let [{needs :params} request
        opseno (inc (:max (db/get-max "userlog")))           ;;获取自增主键
        digest (str "姓名" (:name (:params request))
                 " 身份证" (:identityid (:params request))
                 " 性别" (if (= (:gender (:params request)) "1") "男" "女"))
        dvcode (:dvcode (:params request))
        loginname (:loginname (:params request))
        username (:operators (:params request))
        auditid (:auditid (db/get-audit (:pg_id (:params request))))
        date (new Timestamp (System/currentTimeMillis))]       ;;根据外键查询审核表得到审核主键
    (db/update-need (into {} (cons (conj checkneed
                                     (select-keys  needs (vec (keys checkneed))))
                               (select-keys needs needinfo))) (:pg_id (:params request)))          ;;修改评估信息
    (db/update-needsum (into {} (cons [:pingguenddate date]
                                  (cons (conj checksum (select-keys  needs (vec (keys checksum))))
                                    (select-keys needs needsuminfo)))) (:pg_id (:params request)))          ;;修改汇总信息
    (db/create-userlog opseno                    ;;新增对应的操作日志
      (str digest " 信息修改") (:pg_id (:params request)) "wJhlMNIq8C20mH7Bm6tj" dvcode loginname username)
    (if (= (:active (:params request)) "2")            ;;判断要修改评估信息的状态
      (do (db/update-active "" (:pg_id (:params request)))  ;;驳回的状态下
        (db/create-userlog (inc (:max (db/get-max "userlog")))    ;;新增对应的操作日志
          (str digest " 驳回处理") auditid "RsYYAyoMAWG70Gt5GeH6" dvcode loginname username)
        (db/update-audit "0" "0" dvcode "驳回已处理" loginname    ;;修改对应的审核表
          (inc (:max (db/get-max "userlog"))) "0" auditid opseno))
      (db/update-audit "0" "0" "" "" "" "" "0" auditid opseno))    ;;自由状态下,修改对应审核表
    (str "成功")))

;;评估信息注销
(defn need-logout [request]
  (let [{needs :params} request
        opseno (inc (:max (db/get-max "userlog")))        ;;获取自增主键
        digest (str "姓名" (:name (:params request))
                 " 身份证" (:identityid (:params request))
                 " 性别" (if (= (:gender (:params request)) "1") "男" "女"))
        dvcode (:dvcode (:params request))
        loginname (:loginname (:params request))
        username (:operators (:params request))
        auditid (:auditid (db/get-audit (:pg_id (:params request))))]    ;;根据外键查询审核表得到审核主键
    (db/update-active "3" (:pg_id (:params request)))    ;;根据主键修改评估信息状态
    (db/create-userlog opseno (str digest " 信息注销")          ;;新增对应的操作日志
      (:pg_id (:params request)) "wJhlMNIq8C20mH7Bm6tj" dvcode loginname username)
    (db/create-userlog (inc (:max (db/get-max "userlog"))) (str digest " 信息注销") auditid "RsYYAyoMAWG70Gt5GeH6" dvcode loginname username)
    (db/update-audit "0" "0" dvcode "注销" loginname    ;;修改对应的审核表
        (inc (:max (db/get-max "userlog"))) "0" auditid opseno)
    (str "注销成功")))


;;修改审核表
(defn update-audit [flag aulevel digest tprkey auditid dvcode loginname username opseno]
  (let [status (nth ["自由" "提交" "审核" "审批"] (inc (Integer/parseInt aulevel)));;得到审核字段
        level   (str (inc (Integer/parseInt aulevel)))
        auopseno (inc (:max (db/get-max "userlog")))
        functionid "RsYYAyoMAWG70Gt5GeH6"]
    (if (= flag "通过")
      (do (db/update-active  "0" tprkey)  ;;修改评估表状态
        (db/create-userlog auopseno (str digest " "status flag) auditid functionid dvcode loginname username);;新增审核日志
        (if (= (inc (Integer/parseInt aulevel)) 3)  ;;修改审核表   (判断)
          (do (db/update-active  "1" tprkey)  ;;修改评估表状态
            (db/update-audit level "1" dvcode (str status flag) loginname auopseno "1" auditid opseno))
          (db/update-audit level "1" dvcode (str status flag) loginname auopseno "0" auditid opseno)))
      (do (db/update-active  "2" tprkey)  ;;修改评估表状态
        (db/create-userlog auopseno (str digest " "status flag) auditid functionid dvcode loginname username)      ;;新增审核日志
        (db/update-audit level "0" dvcode (str status flag) loginname auopseno "1" auditid opseno)))      ;;修改审核表
;    (layout/render "audit.html" {:funcid "RsYYAyoMAWG70Gt5GeH6" :functionid "wJhlMNIq8C20mH7Bm6tj"})
    (resp/json {:success true :message "通过"})
    ))    ;;待办业务
;    (layout/render "audit.html" {:funcid "RsYYAyoMAWG70Gt5GeH6" :functionid "wJhlMNIq8C20mH7Bm6tj"})))    ;;待办业务
