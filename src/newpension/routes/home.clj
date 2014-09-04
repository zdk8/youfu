(ns newpension.routes.home
  (:require [compojure.core :refer :all]
            [newpension.layout :as layout]
            [newpension.util :as util]
            [newpension.controller.old :as old]
            [newpension.controller.need :as need]
            [newpension.controller.money :as money]))

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

(defn audit-page [functionid funcid]
  (layout/render "audit.html" {:functionid functionid :funcid funcid}))

(defn need-page []
  (layout/render "need.html"))

(defn addneed-page []
  (layout/render "addneed.html"))

(defroutes home-routes
  (GET "/test" [] (layout/render "GrantMoneyMng.html"))
  (GET "/" [] (login-page)) ;;登录页面
  (GET "/addold" [] (addold-page))   ;;养老信息录入页面
  (GET "/logs" [functionid] (log-page functionid))      ;;操作日志页面
  (GET "/audits" [functionid funcid] (audit-page functionid funcid))     ;;待办业务页面
  (GET "/olds" [] (old-page))      ;;养老信息查询页面
  (GET "/need" [] (need-page))      ;;人员评估信息查询页面
  (GET "/addneed" [] (addneed-page))      ;;人员评估信息录入页面
  (GET "/GrantMoneyMng" [] (layout/render "GrantMoneyMng.html"))  ;;资金发放页面
  (POST "/login" [username password] (old/login username password))  ;;用户登录
  (POST "/saveold" request (old/create-old request))  ;;养老信息录入
  (POST "/insert-oldsocrel" fields (old/insert-oldsocrel fields)) ;;新增养老家庭成员信息
  (POST "/editadd-oldsocrel" fields (old/editadd-oldsocrel fields));;修改后新增养老家庭成员信息
  (GET "/sele_oldsocrel" [gx_name] (old/sele_oldsocrel gx_name))
  (GET "/old" [page rows] (old/get-olds page rows))       ;;养老信息查询
  (POST "/oldid" [q page rows] (old/get-id q page rows))
  (GET "/oldname" [name page rows] (old/get-oldname name page rows))       ;;根据关键字模糊查询养老信息
  (GET "/search" [id] (old/get-old id))          ;;根据主键查看养老详细信息
  (GET "/searchid" [id] (old/get-oldid id))          ;;根据主键查看养老详细信息
  (GET "/log" [functionid page rows] (old/get-logs functionid page rows))       ;;操作日志查询
  (POST "/updateold" request (old/update-old request))       ;;修改养老信息
  (POST "/deleteold" request (old/delete-old request))        ;;删除养老信息
  (GET "/audit" [functionid loginname dvcode page rows] (old/get-audits functionid loginname dvcode page rows))      ;;待办业务查询
  (POST "/checkaudit" [flag aulevel digest tprkey auditid dvcode loginname username opseno]      ;;养老信息待办业务操作
    (old/update-audit flag aulevel digest tprkey auditid dvcode loginname username opseno))
  (GET "/func" [username functionid] (old/get-funcs username functionid))
  (GET "/get-inputlist" [aaa100] (old/get-inputlist aaa100))  ;;获取输入框下拉选项列表
  (GET "/get-divisionlist" [dvhigh] (old/get-divisionlist dvhigh))  ;;获取行政区划下拉选项列表
  (POST "/get-oldsocrel" [lr_id] (old/get-oldsocrel lr_id))   ;;查询家庭成员关系表
  (POST "/update-oldsorel" reuqest (old/update-oldsorel reuqest))    ;;修改养老家庭成员信息
  (POST "/oldsocrelkey" [] (old/oldsocrelkey))    ;;家庭成员信息表主键
  (POST "/dele-oldsorel" [lrgx_id] (old/dele-oldsorel lrgx_id))   ;;删除家庭成员关系表
  (GET "/needs" [] (need/get-needs))             ;;人员评估信息查询
  (GET "/tneed" [id] (need/tneed id))
  (GET "/searchneed" [id] (need/get-need id))                  ;;根据主键查询人员评估信息
  (POST "/saveneed" request (need/create-need request))
  (POST "/updateneed" request (need/update-need request))
  (POST "/checkneed" [flag aulevel digest tprkey auditid dvcode loginname username opseno]      ;;评估信息待办业务操作
    (need/update-audit flag aulevel digest tprkey auditid dvcode loginname username opseno))
  (POST "/needlogout" request (need/need-logout request))
  (GET "/addnewgrantwin" [] (layout/render "addnewgrantwin.html")) ;;资金发放窗口
  (GET "/searchGrant" [] (layout/render "searchGrant.html")) ;;搜索框
  (GET "/get-grantmoney" [page rows] (money/get-grantmoney page rows))    ;;资金发放表查询
  (POST "/get-grantmoneyByEle" [name identityid bsnyue] (money/get-grantmoneyByEle name identityid bsnyue));;资金发放条件查询
  (GET "/get-cangrantmoney" [bsnyue page rows] (money/get-cangrantmoney bsnyue page rows))  ;;查询能够进行资金发放人员
  (POST "/insert-grantmoney" fields (money/insert-grantmoney fields))    ;;新增已享受资金发放人员
  (POST "/sel-grantmoneyid" [] (money/sel-grantmoneyid )) ;;查询资金发放表主键
  (POST "/get-needsid" [] (money/get-needsid )) ;;取出需求评估信息表主键
  (POST "/del-grantmoney" [bsnyue] (money/del-grantmoney bsnyue))  ;;资金发放记录删除
  )
