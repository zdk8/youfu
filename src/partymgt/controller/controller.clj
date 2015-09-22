(ns partymgt.controller.controller
  (:use compojure.core)
  (:require
    [partymgt.models.db :as db]
    [partymgt.common.common :as common]
    [noir.response :as resp]
    [clojure.data.json :as json]
    ))



(defn add-pensonrecords
  "人事档案数据增加"
  [request]
  (let [params (:params request)
        getprdata (select-keys params (:t_personalrecords common/selectcols))
        getedudata  (json/read-str  (:educationway params) :key-fn keyword)
        getfamilydata (json/read-str  (:familymembers params) :key-fn keyword)
        prnextid (:nextval (first(db/get-results-bysql "select seq_t_personalrecords.nextval  from dual")))
        prdata (conj (common/dateformat-bf-insert getprdata  "worktime" "partytime" "employtime" "contractsigntime" "contractdeadline" "incumbenttime") {:pr_id prnextid})
        edudata (map #(conj % {:pr_id prnextid}) getedudata)
        familydata (map #(conj % {:pr_id prnextid}) getfamilydata)
        ]
    ;(println "PPPPPPPPPP" prdata)
    ;(println "EEEEEEEEEE" edudata)
    ;(println "FFFFFFFFFF" familydata)
    (db/add-pensonrecords prdata edudata familydata)
    (str "true")))

(defn get-record-list
  "人事档案数据列表查询"
  [request]
  (let [params (:params request)
        name (:name params)
        identityid (:identityid params)
        rows (:rows params)
        page (:page params)
        conds (str " and isdel is null" (common/likecond "name" name) (common/likecond "identityid" identityid))
        getresult (common/fenye rows page "t_personalrecords" "*" conds " order by pr_id desc")
        ]
    (resp/json {:total (:total getresult) :rows (common/dateymd-bf-list (:rows getresult) "worktime" "partytime" "employtime" "contractsigntime" "contractdeadline" "incumbenttime")})))


(defn update-record-byid
  "根据id更新人事档案的数据"
  [request]
  (let [params (:params request)
        pr_id (:pr_id params)
        getprdata (select-keys params (:t_personalrecords common/selectcols))
        getedudata  (json/read-str  (:educationway params) :key-fn keyword)
        getfamilydata (json/read-str  (:familymembers params) :key-fn keyword)
        prdata (common/dateformat-bf-insert getprdata  "worktime" "partytime" "employtime" "contractsigntime" "contractdeadline" "incumbenttime")
        edudata (map #(conj % {:pr_id pr_id}) getedudata)
        familydata (map #(conj % {:pr_id pr_id}) getfamilydata)
        ]
    (db/update-pensonrecords prdata edudata familydata pr_id)
    (str "ture")))

(defn delete-record-byid [request]
  (let [params (:params request)
        pr_id (:pr_id params)]
    (db/updatedata-by-tablename "t_personalrecords" {:isdel "1"} {:pr_id pr_id})
    (str "true")))

(defn get-record-byid [request]
  (let [params (:params request)
        pr_id (:pr_id params)
        getprdata    (db/selectdatas-by-tablename "t_personalrecords" {:pr_id pr_id})
        getedudata   (db/selectdatas-by-tablename "t_educationway" {:pr_id pr_id})
        getfamilydata (db/selectdatas-by-tablename "t_familymember" {:pr_id pr_id})
        prdata (conj (common/dateymd-bf-list getprdata "worktime" "partytime" "employtime" "contractsigntime" "contractdeadline" "incumbenttime") {:educationway getedudata :familymembers getfamilydata} )
        ]
    (resp/json prdata)))


(defn add-partybranch
  "新增党支部"
  [request]
  (let [params (:params request)
        partydata (select-keys params (:t_partybranch common/selectcols))]
    (db/adddata-by-tablename "t_partybranch" (common/dateformat-bf-insert partydata "pb_createtime"))
    (str "true")))

(defn update-party-byid [request]
  (let [params (:params request)
        pb_id (:pb_id params)
        partydata (select-keys params (:t_partybranch common/selectcols))]
    (db/updatedata-by-tablename "t_partybranch" (common/dateformat-bf-insert partydata "pb_createtime") {:pb_id pb_id})
    (str "true")))

(defn get-depart-list [request]
  (let [params (:params request)
        pb_name (:pb_name params)
        rows (:rows params)
        page (:page params)
        conds (str (common/likecond "pb_name" pb_name))
        getresult (common/fenye rows page "t_partybranch" "*" conds " order by pb_id desc")]
    (resp/json {:total (:total getresult) :rows (common/dateymd-bf-list (:rows getresult) "pb_createtime") })))

(defn add-people-to-party [request]
  (let [params (:params request)
        pb_id (:pb_id params)
        pr_id (:pr_id params)
        ]
    (db/updatedata-by-tablename "t_personalrecords" {:pb pb_id} {:pr_id pr_id})
    (str "true")))






(defn test-get-tablecols [tablename]
  (let[tcsql (str "select column_name from user_tab_columns where table_name = '" (.toUpperCase tablename) "'")
       cols (db/get-results-bysql tcsql)
       ;colskey (flatten (map #(keys %)cols))
       colskey (map #(keyword (first (vals % )) )cols) ]
    (println colskey)
    (resp/json {:success colskey})))