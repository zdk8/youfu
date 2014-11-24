(ns newpension.controller.manager
  (:use compojure.core)
  (:require
            [newpension.models.manager :as basemd]
            [noir.response :as resp]
            [newpension.models.schema :as schema];;这里是不需要接连数据库的,仅方便而已,应该交model去操作
            )
  )




(defn get-user-menutree [req]
  (let [{params :params}req
        node (get params :node)
        id (get params :id)
        ni (if node node id)
        results (if ni (basemd/menutree ni) (basemd/menutree "businessmenu"))]
    (resp/json (map #(conj % {:leaf (if (=(get % :leaf) "true") true false) :state (if (=(get % :leaf) "true") "open" "closed")})results))
    )
  )


(defn get-function-by-id [id]
  (let [results (first (basemd/get-function-by-id id))]
    (resp/json results)))

(defn del-function-by-id [id]
  (basemd/del-function-by-id id))

(defn create-function [req]
  (let [{params :params} req
        {functionid :functionid} params
        results (if (= functionid "-1") (basemd/create-function params) (basemd/update-function params functionid))
        ]
    (resp/json {:test "test"})))

(defn create-combo [req]
  (let [{params :params} req
        {flag :flag} params
        {aaa100 :aaa100} params
        params2 (dissoc params :flag)
        results (if (= flag "-1") (basemd/create-combo params2) (basemd/update-combo params aaa100))
        ]
    (resp/json {:success true})))
(defn create-combodt [req]
  (let [{params :params} req
        {flag :flag} params
        {aaz093 :aaz093} params
        params2 (dissoc params :flag)
        results (if (= flag "-1") (basemd/create-combodt params2) (basemd/update-combodt params aaz093))
        ]
    (resp/json {:success true})))

#_(defn delete-function [id]
    (let [results (basemd/delete-function id)]
      (resp/json {:test "test"})))

(defn get-combo [req]
  (let [ results (basemd/get-combos req)]
    (resp/json results)))
(defn get-combo-by-pr [req]
  (let [ {params :params} req
         {aaa100 :aaa100} params
         results (basemd/get-combo-by-pr aaa100)]
    (resp/json (first results))))
(defn get-combodt-by-pr [req]
  (let [ {params :params} req
         {aaz093 :aaz093} params
         results (basemd/get-combodt-by-pr aaz093)]
    (resp/json (first results))))
(defn get-combodt [req]
  (let [{params :params} req
        {aaa100 :aaa100} params
        results (basemd/get-combodts aaa100)
        ]
    (resp/json results)))


(defn getenumbytype [type callback]
  (let [

         reuslts (basemd/getenumeratebytype type)
         ]
    (if (nil? callback) (resp/json reuslts)(resp/jsonp callback reuslts))
    )

  )
