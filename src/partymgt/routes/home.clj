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
  (POST "/party/removepeopletoparty" request (ctl/remove-people-to-party request))
  (POST "/party/delpartybranch" request (ctl/delete-partybranch request))

  ;;共青团
  (POST "/party/addyouthleague" request (ctl/add-youthleague request))
  (POST "/party/updateyouthleaguebyid" request (ctl/update-youthleague-byid request))
  (POST "/party/getyouthleaguelist" request (ctl/get-youthleague-list request))
  (POST "/party/addpeopletoyouthleague" request (ctl/add-people-to-youthleague request))
  (POST "/party/removepeopletoleague" request (ctl/remove-people-to-league request))
  (POST "/party/delyouthleague" request (ctl/delete-youthleague request))

  ;;老干部
  (POST "/party/addveterancadre" request (ctl/add-veterancadre request))
  (POST "/party/updateveteranbyid" request (ctl/update-veteran-byid request))
  (POST "/party/getveteranlist" request (ctl/get-veteran-list request))
  (POST "/party/addpeopletoveteran" request (ctl/add-people-to-veteran request))
  (POST "/party/removepeopletoveteran" request (ctl/remove-people-to-veteran request))
  (POST "/party/delveterancadre" request (ctl/delete-veterancadre request))

  ;;妇女小组
  (POST "/party/addwomengroup" request (ctl/add-womengroup request))
  (POST "/party/updatewomengroupbyid" request (ctl/update-womengroup-byid request))
  (POST "/party/getwomengrouplist" request (ctl/get-womengroup-list request))
  (POST "/party/addpeopletowomengroup" request (ctl/add-people-to-womengroup request))
  (POST "/party/removepeopletowomengroup" request (ctl/remove-people-to-womengroup request))
  (POST "/party/delwomengroup" request (ctl/delete-womengroup request))

  ;;工会
  (POST "/party/addtradeunion" request (ctl/add-tradeunion request))
  (POST "/party/updatetradeunionbyid" request (ctl/update-tradeunion-byid request))
  (POST "/party/gettradeunionlist" request (ctl/get-tradeunion-list request))
  (POST "/party/addpeopletotradeunion" request (ctl/add-people-to-tradeunion request))
  (POST "/party/removepeopletotradeunion" request (ctl/remove-people-to-tradeunion request))
  (POST "/party/deltradeunion" request (ctl/delete-tradeunion request))

  ;;证件备案管理
  (POST "/party/addcertificate" request (ctl/add-certificate request))
  (POST "/party/updatecertificate" request (ctl/update-certificate request))
  (POST "/party/getcertificatelist" request (ctl/get-certificate-list request))
  (POST "/party/delcertificate" request (ctl/delete-certificate request))

  ;;证件领用登记
  (POST "/party/addcerreceive" request (ctl/add-cerreceive request))                     ;证件领用
  (POST "/party/returncerreceive" request (ctl/return-cerreceive request))                ;证件归还
  (POST "/party/delcerreceive" request (ctl/delete-cerreceive request))
  (POST "/party/getcerreceivelist" request (ctl/get-cerreceive-list request))
  (POST "/party/getcerreceivebyid" request (ctl/get-cerreceive-byid request))            ;;根据证件id获取证件领用记录

  ;;廉政档案
  (POST "/party/getnewcadrelist" request (ctl/get-newcadre-list request))
  (POST "/party/addcadre" request (ctl/add-cadre request))
  (POST "/party/getcadrelist" request (ctl/get-cadre-list request))
  (POST "/party/updatecadre" request (ctl/update-cadre request))
  (POST "/party/deletecadre" request (ctl/delete-cadre request))

  ;;奖惩情况
  (POST "/party/addawardpunish" request (ctl/add-awardpunish request))
  (POST "/party/getawardpunishlist" request (ctl/get-awardpunish-list request))
  (POST "/party/updateawardpunish" request (ctl/update-awardpunish request))
  (POST "/party/deleteawardpunish" request (ctl/delete-awardpunish request))

  ;;上交情况
  (POST "/party/addhandgift" request (ctl/add-handgift request))
  (POST "/party/gethandgiftlist" request (ctl/get-handgift-list request))
  (POST "/party/updatehandgift" request (ctl/update-handgift request))
  (POST "/party/deletehandgift" request (ctl/delete-handgift request))

  ;;附件管理
  (POST "/party/fileupload" [file pc_id filetype filenamemsg fileext] (ctl/uploadfile file pc_id filetype filenamemsg fileext));;附件上传
  (POST "/party/deletefilebyid" [attach_id fie_path] (ctl/deletefile attach_id fie_path))   ;附件删除
  (POST "/party/getfileslist" request (ctl/get-files-list request))
  (GET "/party/filedown" req
    (let [params (:params req)]
      (ctl/getfilesysfile (:filename params) (:convert params) (:server-name req) (:server-port req))))

  ;;test
  (GET "/gettablecols" [tablename] (ctl/test-get-tablecols tablename))   ;;获取表的字段
  (GET "/dfsfs" [] (ctl/test-dfs))
  )
