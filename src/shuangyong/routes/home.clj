(ns shuangyong.routes.home
  (:require [compojure.core :refer :all]
            [shuangyong.layout :as layout]
            [shuangyong.util :as util]
            [noir.session :as session]
            [clojure.data.json :as json]
            [ring.util.response :refer [redirect file-response]]
            [noir.response :as resp]

            [shuangyong.controller.manager :as mymngctrl]
            [shuangyong.controller.controller :as ctl]
            [shuangyong.controller.login :as login]
            ))

(defroutes home-routes
  (GET "/" req (login/home req))
  (POST "/login" req (login/login req)) ;;登录
  (GET "/logout" request (login/logout request)) ;;注销

  ;;双拥人员信息
  (POST "/hyshy/savesoilder" request (ctl/save-soilder request))                        ;;双拥人员信息保存
  (POST "/hyshy/reportsoilder" request (ctl/report-soilder request))                   ;;双拥人员信息上报
  (POST "/hyshy/auditsoilder" request (ctl/audit-soilder request))                     ;;双拥人员信息审核
  (POST "/hyshy/getsoilderlist" request (ctl/get-soilder-list request))               ;;查询审核通过人员信息
  (POST "/hyshy/addsoldier" request (ctl/add-soilder request))                         ;;双拥人员信息添加
  (POST "/hyshy/getapprovelist" request (ctl/get-approve-list request))               ;;查询审核信息
  (POST "/hyshy/dealapprove" request (ctl/deal-approve request))                       ;;审核


  ;;附件管理
  (POST "/party/fileupload" [file pc_id filetype filenamemsg fileext] (ctl/uploadfile file pc_id filetype filenamemsg fileext));;附件上传
  (POST "/party/deletefilebyid" [attach_id fie_path] (ctl/deletefile attach_id fie_path))   ;附件删除
  (POST "/party/getfileslist" request (ctl/get-files-list request))
  (GET "/party/filedown" req
    (let [params (:params req)]
      (ctl/getfilesysfile (:filename params) (:convert params) (:server-name req) (:server-port req))))

  ;;test    t_rentalhouse
  (GET "/gettablecols" [tablename] (ctl/test-get-tablecols tablename))   ;;获取表的字段
  (GET "/dfsfs" [] (ctl/test-dfs))
  )
