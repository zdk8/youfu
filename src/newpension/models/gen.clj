(ns newpension.models.gen
  (:use korma.core
        [korma.db :only [defdb with-db]])
  (:import (java.util.UUID))
  (:require [clojure.string :as strs]
            [newpension.models.schema :as schema]
            ))


(defdb dboracle schema/db-oracle)

(defn read-functions []
  (with-db dboracle
    (exec-raw ["select * from xt_function"] :results)))


(defn menutree [node]
  (with-db dboracle
    (exec-raw ["select t.*,t.functionid id,t.title text,t.location value,(select (decode(count(1),0,'true','false')) from xt_function where parent=t.functionid) leaf  from xt_function t where t.parent=?" [node]] :results) ))

(defn get-function-by-id [id]
  (println "********" "select * from xt_function where functionid=" id)
  (with-db dboracle
    (exec-raw ["select * from xt_function where functionid=?" [id]] :results)))



(defentity xt_function
  (database dboracle)
  )

(defn create-function [function]
  (let [f (conj function {:functionid (strs/replace (str (java.util.UUID/randomUUID)) "-" "")}) ]
  (insert xt_function
    (values f))))



(defn update-function [function functionid]
  (update xt_function
    (set-fields function)
    (where {:functionid functionid})))
(defn getenumeratebytype [keyword ]
  (println "************\n" keyword)
  (with-db dboracle
    (exec-raw [(str "select lower(aaa100) enumeratetype,aaa102 enumeratevalue,aaa103 enumeratelabel from xt_combodt where lower(aaa100) like '" keyword "%'") []] :results)))



