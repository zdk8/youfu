(ns newpension.controller.department
  (:use compojure.core)
  (:use korma.core
        [korma.db :only [oracle]])
  (:require [newpension.models.db :as db]
            [noir.response :as resp]
            [newpension.layout :as layout]
            ))

(def depart [:departname :districtid :type :register :telephone :people :address :busline :coordinates :approvedbed :actualbed :livenumber :buildarea :function :runtime])

(defn add-department [request]
  (let [{params :params}request
        filter-fields (select-keys params depart)]
    (db/add-depart filter-fields)
    (resp/json {:success true :message "add success"})))