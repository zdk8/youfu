(ns newpension.controller.manager
  (:use compojure.core)
  (:require
            [newpension.models.manager :as basemd]
            [noir.response :as resp]
            [noir.session :as session]
            [taoensso.timbre :as timbre]
            ))




(defn get-user-menutree-str [req]
  (let [{params :params}req
        node (get params :node)
        id (get params :id)
        ni (if node node id)
        loginname (:loginname (session/get :usermsg))
        results (if ni (basemd/menutree loginname ni) (basemd/menutree loginname "businessmenu"))]
    (map #(conj % {:leaf (if (=(get % :leaf) "true") true false) :state (if (=(get % :leaf) "true") "open" "closed")})results)
    )
  )
(defn get-function-by-id-str [req]
  (let [{params :params} req
        id (get params :id)
         results (first (basemd/get-function-by-id id))]
    (timbre/debug req)
    (println "*******************:::::" id)
    results))


(defn just-a-test
  []
  (let [results (basemd/menutree "admin" "bR8kBGp0A6lTmPkgOFxI")]
    (map #(conj % {:leaf (if (=(get % :leaf) "true") true false) :state (if (=(get % :leaf) "true") "open" "closed")})results)))

(defn get-user-menutree [req]
  (let [{params :params}req
        node (get params :node)
        id (get params :id)
        ni (if node node id)
        loginname (:loginname (session/get :usermsg))
        results (if ni (basemd/menutree loginname ni) (basemd/menutree loginname "businessmenu"))]
    (resp/json (map #(conj % {:leaf (if (=(get % :leaf) "true") true false) :state (if (=(get % :leaf) "true") "open" "closed")})results))
    )
  )


(defn get-all-user-menutree [req]
  (let [{params :params}req
        node (get params :node)
        id (get params :id)
        ni (if node node id)
        results (if ni (basemd/allmenutree  ni) (basemd/allmenutree  "totalroot"))]
    (resp/json (map #(conj % {:leaf (if (=(get % :leaf) "true") true false) :state (if (=(get % :leaf) "true") "open" "closed")})results))
    )
  )

(defn get-grant-menutree [req]
  (let [{params :params}req
        node (get params :node)
        roleid (get params :roleid)
        id (get params :id)
        ni (if node node id)
        results (if ni (basemd/grantmenutree roleid ni) (basemd/grantmenutree roleid "totalroot"))]
    (resp/json (map #(conj % {:leaf (if (=(get % :leaf) "true") true false) :state (if (=(get % :leaf) "true") "open" "closed")})results))
    )
  )
(defn save-grant [req]
  (let [{params :params}req
        node (get params :node)
        roleid (get params :roleid)
        ids (get params :functionids)]
    (basemd/save-grant roleid ids)
    (resp/json {:success true})
    )
  )
(defn save-role-user [req]
  (let [{params :params}req
        node (get params :node)
        userid (get params :userid)
        ids (get params :roleids)]
    (basemd/save-role-user userid ids)
    (resp/json {:success true})
    )
  )


(defn get-divisiontree [req]
  (let [{params :params}req
        node (get params :node)
        id (get params :id)
        ni (if node node id)
        current-xian (:dvcode (session/get :usermsg));(str (subs (:dvcode (session/get :usermsg)) 0 4) "00")
        results (if ni (basemd/divisiontree ni) (basemd/divisiontree current-xian))]
    (resp/json (map #(conj % {:leaf (if (=(get % :leaf) "true") true false) :state (if (=(get % :leaf) "true") "open" "closed")})results))
    )
  )


(defn get-function-by-id [id]
  (let [results (first (basemd/get-function-by-id id))]
    (resp/json results)))

(defn get-user-by-regionid [id]
  (let [results (basemd/get-user-by-regionid id)]
    (resp/json results)))
(defn get-user-by-id [id]
  (let [results (first (basemd/get-user-by-id id))]
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
(defn create-user [req]
  (let [{params :params} req
        {flag :flag} params
        {userid :userid} params
        params2 (dissoc params :flag)
        results (if (= flag "-1") (basemd/create-user params2) (basemd/update-user params userid))
        ]
    (resp/json {:success true})))
(defn del-user-by-id [id]
  (basemd/delete-user id)
  (resp/json {:success true})
  )


;;角色
(defn get-role [req]
  (let [{params :params} req
        {userid :userid} params
         results (if userid (basemd/get-role-by-userid userid) (basemd/get-role userid))]
    (resp/json results)))

(defn create-role [req]
  (let [{params :params} req
        {flag :flag} params
        {roleid :roleid} params
        params2 (dissoc params :flag)
        results (if (= flag "-1") (basemd/create-role params2) (basemd/update-role params roleid))
        ]
    (resp/json {:success true})))
(defn del-role-by-id [id]
  (basemd/delete-role id)
  (resp/json {:success true})
  )
(defn get-role-by-id [id]
  (let [results (first (basemd/get-role-by-id id))]
    (resp/json results)))


;;session test
(defn my-session-put [name]
  (session/put! :username name)
  (session/put!  :date "2014")
  (resp/json {:success (session/get :username)}))
(defn my-session-get []
  (resp/json {:success (session/get :username) :date (session/get :date) :loginname (session/get  :loginname) :username (session/get  :username)}))
(defn my-session-remove []
  (resp/json {:success (session/remove! :username)}))