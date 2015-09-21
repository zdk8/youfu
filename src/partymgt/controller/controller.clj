(ns partymgt.controller.controller
  (:use compojure.core)
  (:require
    [partymgt.models.db :as db]
    [partymgt.common.common :as common]
    [noir.response :as resp]
    ))



(defn add-pensonrecords [request]
  (let [params (:params request)
        prdata (select-keys params (:t_personalrecords common/selectcols))
        edudata (:educationway params)
        familydata (:familymembers params)]
    (println "PPPPPPPPPP" params)))














(defn test-get-tablecols [tablename]
  (let[tcsql (str "select column_name from user_tab_columns where table_name = '" (.toUpperCase tablename) "'")
       cols (db/get-results-bysql tcsql)
       ;colskey (flatten (map #(keys %)cols))
       colskey (map #(keyword (first (vals % )) )cols) ]
    (println colskey)
    (resp/json {:success colskey})))