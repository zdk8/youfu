(ns partymgt.models.db
  (:use korma.core
        [korma.db :only [defdb with-db transaction]])
  (:require [partymgt.models.schema :as schema]))

(defdb dboracle schema/db-oracle)







;;分页
(defn getall-results
  "oracle分页"
  [start end sql]
  (let [sql (str "SELECT * FROM
(SELECT A.*, ROWNUM RN FROM
("sql") A
  WHERE ROWNUM <= " end ")
 WHERE RN >= " start)]
    (exec-raw [sql []] :results)))

(defn get-results-bysql
  "根据sql语句进行查找"
  [totalsql]
  (exec-raw [totalsql []] :results))

(defn insert-results-bysql
  "根据sql语句进行插入"
  [totalsql]
  (exec-raw [totalsql []] ))

(defn adddata-by-tablename
  "根据表名和数据进行数据添加"
  [tablename datas]
  (insert tablename
          (values datas)))

(defn updatedata-by-tablename
  "根据表名，条件进行更新数据"
  [tablename data conds]
  (update tablename
          (set-fields data)
          (where conds)))

(defn deletedata-by-tablename
  "根据id删除数据"
  [tablename conds]
  (delete tablename
          (where conds)))

(defn selectdatas-by-tablename
  "根据表名和条件查找数据"
  [tablename conds]
  (select tablename
          (where conds)))




(defn add-pensonrecords [prdata edudata familydata]
  (transaction
    (adddata-by-tablename "t_personalrecords" prdata)                              ;增加人事档案基础数据
    (dorun (map #(adddata-by-tablename "t_educationway" %) edudata))              ;增加人事档案相关的学历历程关联数据
    (dorun (map #(adddata-by-tablename "t_familymember" %) familydata))))         ;增加人事档案相关的人员关系关联数据

(defn update-pensonrecords [prdata edudata familydata pr_id]
  (transaction
    (deletedata-by-tablename "t_educationway" {:pr_id pr_id})                       ;删除原学历历程数据
    (deletedata-by-tablename "t_familymember" {:pr_id pr_id})                       ;删除原人员关系数据
    (updatedata-by-tablename "t_personalrecords" prdata {:pr_id pr_id})             ;更新人事档案基础数据
    (dorun (map #(adddata-by-tablename "t_educationway" %) edudata))               ;增加新的学历历程关联数据
    (dorun (map #(adddata-by-tablename "t_familymember" %) familydata))))          ;增加新的人员关系关联数据

(defn add-cerreceive [redata c_id]
  (transaction
    (adddata-by-tablename "t_certificatereceive" redata)
    (updatedata-by-tablename "t_certificate" {:isreceive "1"} {:c_id c_id})))

(defn return-cerreceive [returndate cr_id c_id]
  (transaction
    (updatedata-by-tablename "t_certificatereceive" returndate {:cr_id cr_id})
    (updatedata-by-tablename "t_certificate" {:isreceive nil} {:c_id c_id})))


(defn test-in [ids]
  (select "t_personalrecords"
          (where {:pr_id [in ids]})))

(defn add-people-to-group [tablename groupid peopleids]
  (update tablename
          (set-fields groupid)
          (where {:pr_id [in peopleids]})))
