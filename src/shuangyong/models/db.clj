(ns shuangyong.models.db
  (:use korma.core
        [korma.db :only [defdb with-db transaction]])
  (:import (java.sql Timestamp)
           (java.text SimpleDateFormat)
           (java.text DateFormat))
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


(defn  time-before-insert [results timekey]    "before insert"
  (let [sdf (new SimpleDateFormat "yyyy-MM-dd")]
    ;(println  results  "   TMTMTMTMTTMTTTTMTTTTT  "  timekey)
    (if (or  (= (timekey  results) "") (nil? (timekey  results)))
      (dissoc results timekey)
      (conj results {timekey  (new Timestamp (.getTime (.parse sdf (timekey results))))}{})
      )))

(defn insert-soldierdata [soldierdata sctype sixtydeal]
  (let [sex (:sex soldierdata)
        hktype (:hktype soldierdata)
        persontype (if (> (count sctype) 0) sctype "100")
        sixtydealtype (if (> (count sixtydeal)0) sixtydeal nil)
        sexdata (condp = sex
                  "男" "0"
                  "女" "1"
                  nil)
        hktypedata (condp = hktype
                     "城镇" "0"
                     "农村" "1"
                     nil)
        insert-data (conj (time-before-insert (time-before-insert (dissoc soldierdata :xhid) :joindate) :retiredate) {:sex sexdata :hktype hktypedata :persontype persontype :ishandle "3" :sixtydeal sixtydealtype})   ]
    (insert "t_soldiercommon"
            (values insert-data))
    ))


(defn import-data-of-excel [updata sctype sixtydeal]
  (transaction
    (dorun (map #(insert-soldierdata % sctype sixtydeal) updata ))))