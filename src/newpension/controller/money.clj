(ns newpension.controller.money
  (:use compojure.core)
  (:use korma.core
        [korma.db :only [oracle]])
  (:require [newpension.models.db :as db]
            [noir.response :as resp]
            [newpension.layout :as layout]))

;;资金发放表查询
(defn get-grantmoney []
  (resp/json (db/get-grantmoney)))

;;查询能够进行资金发放人员
(defn get-cangrantmoney [bsnyue pg_id]
  (let [hasbsnyue (resp/json (db/hasbsnyue bsnyue pg_id))]
    (if (= (count (:body hasbsnyue)) 2) (resp/json (db/get-cangrantmoney pg_id)) (str 0))))

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