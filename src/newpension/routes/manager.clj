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


  )