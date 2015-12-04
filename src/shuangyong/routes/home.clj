(ns shuangyong.routes.home
  (:require [compojure.core :refer :all]
            ;[shuangyong.layout :as layout]
            ;[shuangyong.util :as util]
            ;[noir.session :as session]
            ;[clojure.data.json :as json]
            [ring.util.response :refer [redirect file-response]]
            ;[noir.response :as resp]

            ;[shuangyong.controller.manager :as mymngctrl]
            [shuangyong.controller.controller :as ctl]
            [shuangyong.controller.login :as login]
            [shuangyong.controller.report :as report]
            ))

(defroutes home-routes
  (GET "/" req (login/home req))
  (POST "/login" req (login/login req)) ;;登录
  (GET "/logout" request (login/logout request)) ;;注销

  ;;双拥人员信息
  (POST "/hyshy/savesoilder" request (ctl/save-soilder request))                        ;;双拥人员信息保存
  (POST "/hyshy/updatesoilder" request (ctl/update-soilder request))                    ;;双拥人员信息更新
  (POST "/hyshy/reportsoilder" request (ctl/report-soilder request))                   ;;双拥人员信息上报
  (POST "/hyshy/auditsoilder" request (ctl/audit-soilder request))                     ;;双拥人员信息审核
  (POST "/hyshy/getsoilderlist" request (ctl/get-soilder-list request))               ;;查询双拥人员信息
  (POST "/hyshy/deletesoilder" request (ctl/delete-soilder request))                  ;;删除双拥人员信息
  (POST "/hyshy/logoutsoilder" request (ctl/logout-soilder request))                  ;;注销双拥人员信息
  (POST "/hyshy/hyshyanalysis" request (ctl/hyshy-analysis request))                  ;;双拥数据统计
  (POST "/hyshy/retiresoilder" request (ctl/retire-soilder request))                   ;;退伍


  ;;附件管理
  (POST "/party/fileupload" [file pc_id filetype filenamemsg fileext] (ctl/uploadfile file pc_id filetype filenamemsg fileext));;附件上传
  (POST "/party/deletefilebyid" [attach_id fie_path] (ctl/deletefile attach_id fie_path))   ;附件删除
  (POST "/party/getfileslist" request (ctl/get-files-list request))
  (GET "/party/filedown" req
    (let [params (:params req)]
      (ctl/getfilesysfile (:filename params) (:convert params) (:server-name req) (:server-port req))))

  ;excel导入导出
  ;(GET "/report-pdf/:report-type" [report-type] (report/generate-report-pdf report-type));;测试用例:table :list
  ;;/report-pdf/table-pdf
  ;;/report-pdf/list-pdf
  ;(GET "/report-xls/:report-type" [report-type] (report/generate-report-xls report-type))
  ;;/report-xls/my-test1   调用的是java
  ;;/report-xls/my-test2   调用的是clj-excel.core
  (GET "/hyshy/soilderexportexcel" request (report/soilder-export-excel request))                 ;;双拥数据导出excel
  (POST "/hyshy/soilderimportexcel" file (report/excelimport file))                               ;;数据导入excel

  ;;test    t_rentalhouse
  (GET "/gettablecols" [tablename] (ctl/test-get-tablecols tablename))   ;;获取表的字段
  (GET "/dfsfs" [] (ctl/test-dfs))
  )
