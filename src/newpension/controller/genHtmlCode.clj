(ns newpension.controller.genHtmlCode
  (:use compojure.core)
  (:require [newpension.models.db :as db]
            [newpension.models.gen :as gen]
            [noir.response :as resp]
            [newpension.models.schema :as schema]
            )
  )




(defn get-user-menutree [req]
  (let [{params :params}req
        node (get params :node)
        id (get params :id)
        ni (if node node id)
        results (if ni (gen/menutree ni) (gen/menutree "businessmenu"))]
    (resp/json (map #(conj % {:leaf (if (=(get % :leaf) "true") true false) :state (if (=(get % :leaf) "true") "open" "closed")})results))
    )
  )


(defn get-function-by-id [id]
  (let [results (first (gen/get-function-by-id id))]
    (resp/json results)))

(defn create-function [req]
  (let [{params :params} req
        {functionid :functionid} params
        results (if (= functionid "-1") (gen/create-function params) (gen/update-function params functionid))
         ]
  (resp/json {:test "test"})))
(defn getenumbytype [type callback]
  (let [

         reuslts (gen/getenumeratebytype type)
         ]
    (if (nil? callback) (resp/json reuslts)(resp/jsonp callback reuslts))
    )

  )
