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



(defn add-soilder [scdata-deal approvedata]
  (transaction
    (adddata-by-tablename "t_soldiercommon" scdata-deal)                      ;;新增双拥人员数据
    (adddata-by-tablename "approve" approvedata)))                            ;;将审核信息添加到审核表中


(defn deal-approve [sh_id sc_id scdata newappdata]
  (transaction
    (updatedata-by-tablename "approve" {:status "0"} {:sh_id sh_id})               ;;更改审核前审核信息状态为历史状态
    (updatedata-by-tablename "t_soldiercommon" scdata {:sc_id sc_id})              ;;更新双拥人员信息中街道审核的信息
    (adddata-by-tablename "approve" newappdata)))                                  ;;添加新的审核的信息

(defn report-soilder
  "数据上报"
  ([approvedata sdata]
    (let [sc_id (:nextval (first(get-results-bysql "select seq_t_soldiercommon.nextval  from dual")))]                ;新数据上报，需要先获取人员id
      (transaction
        (adddata-by-tablename "t_soldiercommon" (conj sdata {:sc_id sc_id}))                       ;新增人员信息
        (adddata-by-tablename "approve" (conj approvedata {:bstablepk sc_id})))))                  ;新增审核信息
  ([approvedata sc_id sdata]
    (transaction
      (updatedata-by-tablename "t_soldiercommon" sdata {:sc_id sc_id})                             ;更新人员信息
      (adddata-by-tablename "approve" approvedata))))                                              ;新增审核信息

(defn audit-soilder [sc_id approvedata sdata]
  (transaction
    (updatedata-by-tablename "approve" {:status "0"} {:bstablepk sc_id})                            ;更改审核表状态
    (adddata-by-tablename "approve" approvedata)                                                    ;新增审核信息
    (updatedata-by-tablename "t_soldiercommon" sdata {:sc_id sc_id})))                              ;更改人员表数据信息