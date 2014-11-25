(ns newpension.controller.department
  (:use compojure.core)
  (:use korma.core
        [korma.db :only [oracle]])
  (:require [newpension.models.db :as db]
               [newpension.common.common :as common]
               [noir.response :as resp]
               [newpension.layout :as layout]))

(def depart [:departname :districtid :type :register :telephone :people :address :busline :coordinates :approvedbed :actualbed :livenumber :buildarea :function :runtime])

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
    (resp/json {total :total :rows results})))

(defn get-departbyid [request]
  (let[{params :params}request
       {id :id}params]
    (resp/json (db/get-departbyid id))))