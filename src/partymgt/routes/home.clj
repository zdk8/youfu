(ns partymgt.routes.home
  (:require [compojure.core :refer :all]
            [partymgt.layout :as layout]
            [partymgt.util :as util]
            [noir.session :as session]
            [clojure.data.json :as json]
            [ring.util.response :refer [redirect file-response]]
            [noir.response :as resp]

            [partymgt.controller.manager :as mymngctrl]
            [partymgt.controller.controller :as ctl]
            [partymgt.controller.login :as login]
            ))

(defroutes home-routes
  (GET "/" req (login/home req))
  (POST "/login" req (login/login req)) ;;登录
  (GET "/logout" request (login/logout request)) ;;注销


  (GET "/test" [] (layout/render "test.html"))
  (GET "/datagrid" [] (layout/render "datagrid.html"))

  ;;人事档案相关接口
  (POST "/record/addpensonrecords" request (ctl/add-pensonrecords request))
  (POST "/record/getrecordlist" request (ctl/get-record-list request))
  (POST "/record/updaterecord" request (ctl/update-record-byid request))
  (POST "/record/delpensonrecords" request (ctl/delete-record-byid request))
  (POST "/record/getrecordbyid" request (ctl/get-record-byid request))

  ;;党支部
  (POST "/party/addpartybranch" request (ctl/add-partybranch request))
  (POST "/party/updatepartybyid" request (ctl/update-party-byid request))
  (POST "/party/getpartylist" request (ctl/get-depart-list request))
  (POST "/party/addpeopletoparty" request (ctl/add-people-to-party request))

  ;;证件备案管理
  (POST "/party/addcertificate" request (ctl/add-certificate request))
  (POST "/party/updatecertificate" request (ctl/update-certificate request))
  (POST "/party/getcertificatelist" request (ctl/get-certificate-list request))
  (POST "/party/delcertificate" request (ctl/delete-certificate request))

  ;;证件领用登记
  (POST "/party/addcerreceive" request (ctl/add-cerreceive request))                     ;证件领用
  (POST "/party/returncerreceive" request (ctl/return-cerreceive request))                ;证件归还
  (POST "/party/delcerreceive" request (ctl/delete-cerreceive request))

  ;;附件管理
  (POST "/party/fileupload" [file pc_id filetype filenamemsg fileext] (ctl/uploadfile file pc_id filetype filenamemsg fileext));;附件上传
  (POST "/party/deletefilebyid" [attach_id fie_path] (ctl/deletefile attach_id fie_path))   ;附件删除

  ;;test
  (GET "/gettablecols" [tablename] (ctl/test-get-tablecols tablename))   ;;获取表的字段
  )
