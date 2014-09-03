(ns newpension.controller.money
  (:use compojure.core)
  (:use korma.core
        [korma.db :only [oracle]])
  (:require [newpension.models.db :as db]
            [noir.response :as resp]
            [newpension.layout :as layout]))

;;资金发放表查询
(defn get-grantmoney [page rows]
    (let [p (Integer/parseInt page)
          r (Integer/parseInt rows)
          c (count (db/get-grantmoney))]
      (if (<= (* p r) c)                              ;;分页
        (:body (resp/json {:total c :rows (subvec(db/get-grantmoney) (* (dec p) r) (* p r))}))
        (:body (resp/json {:total c :rows (subvec(db/get-grantmoney) (* (dec p) r) c)})))))

;;资金发放条件查询
(defn get-grantmoneyByEle [name identityid bsnyue]
  (resp/json (db/get-grantmoneyByEle name identityid bsnyue)))

;;查询能够进行资金发放人员
(defn get-cangrantmoney [bsnyue page rows]
  (let [p (Integer/parseInt page)
        r (Integer/parseInt rows)
        c (count (db/get-cangrantmoney bsnyue))]
    (if (<= (* p r) c)                              ;;分页
      (:body (resp/json {:total c :rows (subvec(db/get-cangrantmoney bsnyue) (* (dec p) r) (* p r))}))
      (:body (resp/json {:total c :rows (subvec(db/get-cangrantmoney bsnyue) (* (dec p) r) c)})))))

;;新增已享受资金发放人员
(defn insert-grantmoney [fields]
  (let [{info :params} fields]
      (db/insert-grantmoney info)))

;;查询资金发放表主键
(defn sel-grantmoneyid []
    (if (= (db/sel-grantmoneyid) "0")
      (str "0")
      (str (inc (:max (db/sel-grantmoneyid))))))

;;取出需求评估信息表主键
(defn get-needsid []
  (resp/json (db/get-needsid )))

;;资金发放记录删除
(defn del-grantmoney [bsnyue]
  (resp/json (db/del-grantmoney bsnyue)))