(ns shuangyong.models.db
  (:use korma.core
        [korma.db :only [defdb with-db transaction]])
  (:require [shuangyong.models.schema :as schema]))

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

(defn test-in []
  (select "t_personalrecords"
          (where {:pb 1})))
