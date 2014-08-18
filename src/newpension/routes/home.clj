(ns newpension.routes.home
  (:require [compojure.core :refer :all]
            [newpension.layout :as layout]
            [newpension.util :as util]
            [newpension.controller.old :as old]))

(defn home-page []
  (layout/render
    "home.html" {:content (util/md->html "/md/docs.md")}))

(defn update-page []
  (layout/render "update.html"))

(defn addold-page []
  (layout/render "addold.html"))

(defn old-page []
  (layout/render "old.html"))

(defn login-page []
  (layout/render "login.html"))

(defroutes home-routes
  (GET "/" [] (login-page))
  ;    (home-page))
  (POST "/login" [username password] (old/login username password))
  (GET "/update" [] (update-page))
  (GET "/addold" [] (addold-page))
  (POST "/saveold" request (old/create-old request))
  (GET "/old" [] (old/get-olds))
  (POST "/old" [name] (old/get-olds name))
  (GET "/search" [id] (home/get-old id))
  ;  (GET "/searchid" [id] (home/get-oldbyid id))
  (GET "/log" [functionid] (old/get-logs functionid))
  (POST "/updateold" request (old/update-old request))
  (POST "/deleteold" request (old/delete-old request))
  (GET "/audit" [functionid loginname dvcode] (old/get-audits functionid loginname dvcode))
  (POST "/checkaudit" [flag aulevel digest tprkey auditid dvcode loginname username opseno] (old/update-audit flag aulevel digest tprkey auditid dvcode loginname username opseno))
  (GET "/log" [functionid] (old/get-logs functionid))
  (GET "/func" [username] (old/get-funcs username))
  )
