(ns partymgt.controller.login
  (:use compojure.core)
  (:use korma.core
        [korma.db :only [oracle]])
  (:require [noir.response :as resp]
            [partymgt.layout :as layout]
            [noir.session :as session]
            [clojure.string :as strs]
            [clojure.data.json :as json]
            [partymgt.models.login :as login]
            ))

;;用户登录
(defn home [request]
  (try
    (if (session/get :usermsg)
      (do (layout/render "index.html" {:username (:username (session/get :usermsg)) :usermsg (json/json-str (dissoc (session/get :usermsg) :passwd)  :escape-unicode false)}))
      (do (layout/render "login.html")))
    (catch Exception e (layout/render "login.html" {:loginmsg "服务器连接不上！"}))))
(defn loginaction [request]
  (try
    (let
      [{params :params} request
       {loginname :username} params
       {passwd :password} params
       result (login/get-user loginname passwd)
       {username :username} result
       {userid :userid} result]
      (if result
        (do
          ;          (session/put! :username username)
          ;          (session/put! :loginname loginname)
          (session/put! :usermsg result)

          ;          (println (str "************************" (:username (session/get :usermsg)) "(" (:loginname (session/get :usermsg)) ")"))
          (str true))
        (str false)))
    (catch Exception e (layout/render "login.html" {:loginmsg "服务器连接不上！"}))))

(defn login [request]
  (if (= (loginaction request) "true")
    (resp/redirect "/")
    (layout/render "login.html" {:loginmsg "用户名或密码错误！"})
    ))
;;注销
(defn logout [request]
  (session/remove! :usermsg)
  (resp/redirect "/"))