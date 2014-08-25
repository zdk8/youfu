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

(defn log-page [functionid]
  (layout/render "log.html" {:functionid functionid}))

(defn audit-page []
  (layout/render "audit.html"))

(defroutes home-routes
  (GET "/" [] (login-page)) ;;登录页面
  (GET "/addold" [] (addold-page))   ;;养老信息录入页面
  (GET "/logs" [functionid] (log-page functionid))      ;;操作日志页面
  (GET "/audits" [] (audit-page))     ;;待办业务页面
  (GET "/olds" [] (old-page))      ;;养老信息查询页面
  (POST "/login" [username password] (old/login username password))  ;;用户登录
  (POST "/saveold" request (old/create-old request))  ;;养老信息录入
  (POST "/insert-oldsocrel" fields (old/insert-oldsocrel fields)) ;;新增养老家庭成员信息
  (GET "/sele_oldsocrel" [gx_name] (old/sele_oldsocrel gx_name))
  (GET "/old" [page rows] (old/get-olds page rows))       ;;养老信息查询
  (GET "/oldname" [name page rows] (old/get-oldname name page rows))       ;;根据关键字模糊查询养老信息
  (GET "/search" [id] (old/get-old id))          ;;根据主键查看养老详细信息
  (GET "/log" [functionid page rows] (old/get-logs functionid page rows))       ;;操作日志查询
  (POST "/updateold" request (old/update-old request))       ;;修改养老信息
  (POST "/deleteold" request (old/delete-old request))        ;;删除养老信息
  (GET "/audit" [functionid loginname dvcode page rows] (old/get-audits functionid loginname dvcode page rows))      ;;待办业务查询
  (POST "/checkaudit" [flag aulevel digest tprkey auditid dvcode loginname username opseno]      ;;待办业务操作
    (old/update-audit flag aulevel digest tprkey auditid dvcode loginname username opseno))
  (GET "/func" [username functionid] (old/get-funcs username functionid))
  ;;获取输入框下拉选项列表
  (GET "/get-inputlist" [aaa100] (old/get-inputlist aaa100))
  ;;获取行政区划下拉选项列表
  (GET "/get-divisionlist" [dvhigh] (old/get-divisionlist dvhigh))
  ;;查询家庭成员关系表
  (POST "/get-oldsocrel" [lr_id] (old/get-oldsocrel lr_id))

  )
