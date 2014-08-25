(ns newpension.controller.need
  (:use compojure.core)
  (:use korma.core
        [korma.db :only [oracle]])
  (:require [newpension.models.db :as db]
            [noir.response :as resp]
            [newpension.layout :as layout]
            ))

;;评估信息转换
(defn need [nd]
  (into  nd (db/get-old (:lr_id nd))))

;;查询评估信息
(defn get-needs []
  (let [nd (db/get-needs)]
    (:body (resp/json {:total (count nd) :rows  (map #(need %) nd)}))))