;;管理模块,主要负责代码(下拉选项)添加系统功能的添加,系统用户的添加,以及用户角色和角色权限的分配
(ns newpension.routes.manager
  (:require [compojure.core :refer :all]
            [newpension.layout :as layout]
            [newpension.util :as util]
            [newpension.controller.manager :as myctrl]
            ))

(defroutes manager-routes
  (GET "/menutree" req (myctrl/get-user-menutree req))
  (POST "/menutree" req (myctrl/get-user-menutree req))
  (GET "/getFunctionById" [node] (myctrl/get-function-by-id node))
  (POST "/saveFunction" req (myctrl/create-function req))
  (GET "/getenumbytype" [type  callback]
    (myctrl/getenumbytype type  callback))


  ;;代码维护
  (POST "/getcombo" req (myctrl/get-combo req))
  (POST "/getcombodt" req (myctrl/get-combodt req))
  (POST "/savecombo" req (myctrl/create-combo req))
  (POST "/savecombodt" req (myctrl/create-combodt req))
  (POST "/getcombobypr" req (myctrl/get-combo-by-pr req))
  (POST "/getcombodtbypr" req (myctrl/get-combodt-by-pr req))

  (GET "/getFunctionById" [node] (myctrl/get-function-by-id node))
  (POST "/delFunctionById" [functionid] (myctrl/del-function-by-id functionid))
  (POST "/saveFunction" req (myctrl/create-function req))

  ;;用户维护
  (GET "/getdivisiontree" req (myctrl/get-divisiontree req))
  (POST "/getdivisiontree" req (myctrl/get-divisiontree req))
  (POST "/getuserbyregionid" [node] (myctrl/get-user-by-regionid node))
  (GET "/getuserbyid" [id] (myctrl/get-user-by-id id))
  (POST "/getuserbyid" [id] (myctrl/get-user-by-id id))
  (POST "/deluserbyid" [id] (myctrl/del-user-by-id id))
  (POST "/saveuser" req (myctrl/create-user req))

  ;;角色维护
  (POST "/getrole" req (myctrl/get-role req))
  (POST "/saverole" req (myctrl/create-role req))
  (POST "/getrolebyid" [id] (myctrl/get-role-by-id id))
  (POST "/delrolebyid" [id] (myctrl/del-role-by-id id))
  (GET "/grantmenutree" req (myctrl/get-grant-menutree req))
  (POST "/grantmenutree" req (myctrl/get-grant-menutree req))
  (GET "/savegrant" req (myctrl/save-grant req))
  (POST "/savegrant" req (myctrl/save-grant req))
  (GET "/saveroleuser" req (myctrl/save-role-user req))
  (POST "/saveroleuser" req (myctrl/save-role-user req))
  ;;测试session
  (context "/mysessiontest/:name" [name]
    (GET "/put" [] (myctrl/my-session-put name))
    (GET "/get" [] (myctrl/my-session-get))
    (GET "/remove" [] (myctrl/my-session-remove)))
  )