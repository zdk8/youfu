(ns newpension.controller.department
  (:use compojure.core)
  (:use korma.core
        [korma.db :only [oracle]])
  (:require [newpension.models.db :as db]
               [newpension.common.common :as common]
               [newpension.controller.old :as old]
               [noir.response :as resp]
               [newpension.layout :as layout]))

(def depart [:departname :districtid :deptype :register :telephone :people :address :busline :coordinates :approvedbed :actualbed :livenumber :buildarea :function :runtime])
(def deppeople [:id :name :age :identityid :lr_id :dep_id :departname :checkintime :checkouttime :neednurse :districtid :address :registration :type :live :marriage :culture :economy])
(def oldpeople [:districtid :name :identityid :address :registration :type :live :marriage :economy :culture])


(defn add-department [request]
  (let [{params :params}request
        filter-fields (select-keys params depart)]
    (db/add-depart (common/timefmt-bef-insert   filter-fields "runtime"))
    (resp/json {:success true :message "add success"})))

(defn getall-department [request]
  (let[{params :params}request
       {deptype :deptype}params
       {page :page}params
       {rows :rows}params
       r   (read-string rows)
       p  (read-string page)
       start  (inc(* r (dec p)))
       end (* r p)
      sql (str "select * from t_pensiondepartment WHERE DEPTYPE = '" deptype "'")
       results (db/getall-results start end sql)
      totalsql  (str "select count(*) as sum  from t_pensiondepartment where DEPTYPE = '" deptype"'")
      total (get (first(db/get-total totalsql)) :sum)
       ]
    (resp/json {:total total :rows results})))

(defn get-departbyid [request]
  (let[{params :params}request
       {id :id}params]
    (resp/json (db/get-departbyid id))))

(defn update-departbyid [request]
  (let[{params :params}request
       filter-fields (select-keys params depart)
       {id :id}params]
    (db/update-departbyid filter-fields id)
    (resp/json {:success true :message "update success"})))

(defn delete-departbyid [request]
  (let[{params :params}request
       {id :id}params]
    (db/delete-departbyid id)
    (resp/json {:success true :message "delete success"})))

(defn get-oldpeople [identityid]
  (db/get-oldpeople identityid))

(defn checkidentityid [request]
  (let[{params :params}request
       {identityid :identityid}params
       opdate (get-oldpeople identityid)]
    (if (> (count opdate) 0)  (resp/json {:opdate opdate :message true})  (resp/json {:message false}))
    ))

(defn get-oldpeopledep [identityid]
  (db/get-oldpeopledep identityid))

(defn add-oldpeople-depart [request]
  (let [{params :params}request
        {identityid :identityid}params
        checkop (get-oldpeople identityid)
       checkopdep (get-depoldpeople identityid)
        nowtime (common/get-nowtime)
        opddate (conj (select-keys params deppeople) {:checkintime nowtime})]
    (println "DDDDDDD"  (select-keys params deppeople))
    (if (<= (count checkop) 0) (let[opdate (select-keys params oldpeople)]   (old/create-old request)))                 ;判断老年表是否存在，不存在添加数据到老年表
    (if (> (count checkopdep) 0)  (resp/json {:success false :message "user already checkin"})                              ;判断是否已经入住了
      (do (db/add-oldpeopledep opddate) (resp/json {:success true :message "checkin success"})))
))
