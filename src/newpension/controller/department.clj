(ns newpension.controller.department
  (:use compojure.core)
  (:use korma.core
        [korma.db :only [oracle]])
  (:require [newpension.models.db :as db]
               [newpension.common.common :as common]
               [newpension.controller.old :as old]
               [noir.response :as resp]
               [newpension.layout :as layout]))

(def depart [:departname :districtid :type :register :telephone :people :address :busline :coordinates :approvedbed :actualbed :livenumber :buildarea :function :runtime])
(def deppeople [:id :name :age :identityid :lr_id :dep_id :departname :checkintime :checkouttime :neednurse :districtid :address :registration :type :live :marriage :culture :economy])
(def oldpeople [:districtid :name :identityid :address :registration :type :live :marriage :economy :culture])


(defn add-department [request]
  (let [{params :params}request
        filter-fields (select-keys params depart)]
    (db/add-depart (common/timefmt-bef-insert   filter-fields "runtime"))
    (resp/json {:success true :message "add success"})))

(defn getall-department [request]
  (let[{params :params}request
       {type :type}params
       {page :page}params
       {rows :rows}params
       r   (read-string rows)
       p  (read-string page)
       start  (inc(* r (dec p)))
       end (* r p)
      sql (str "select * from t_pensiondepartment WHERE TYPE = '" type "'")
       results (db/getall-results start end sql)
      totalsql  (str "select count(*) as sum  from t_pensiondepartment where TYPE = '" type"'")
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
    (if (> (count opdate) 0)  (resp/json {:opdate opdate :message "数据存在"})  (resp/json {:message "数据不存在"}))
    ))

(defn add-oldpeople-depart [request]
  (let [{params :params}request
        {identityid :identityid}params
        checkop (get-oldpeople identityid)
        nowtime (common/get-nowtime)
        opddate (select-keys params deppeople)]
    (if (> (count checkop) 0) (let[opdate (select-keys params oldpeople)]   (old/create-old request))  )
    (db/add-oldpeopledep opddate)
    (resp/json {:success true :message "add success"})))
