(ns partymgt.routes.home
  (:require [compojure.core :refer :all]
            [partymgt.layout :as layout]
            [partymgt.util :as util]
            [noir.session :as session]
            [clojure.data.json :as json]
            [ring.util.response :refer [redirect file-response]]
            [noir.response :as resp]

            [partymgt.controller.manager :as mymngctrl]
            [partymgt.controller.login :as login]
            ))

(defroutes home-routes
  (GET "/" req (login/home req))
  (POST "/login" req (login/login req)) ;;登录
  (GET "/logout" request (login/logout request)) ;;注销


  (GET "/menubar" [] (layout/render "menubar.html"))
  (GET "/manager" [] (layout/render "manager.html"))



  )
