(ns newpension.routes.home
  (:require [compojure.core :refer :all]
            [newpension.layout :as layout]
            [newpension.util :as util]
            [newpension.controller.old :as old]
            [newpension.controller.need :as need]
            [newpension.controller.genHtmlCode :as gen]
            [newpension.controller.money :as money]

            [noir.session :as session]

            [clojure.data.json :as json]
            [newpension.controller.manager :as mymngctrl]
            [newpension.controller.department :as depart]
            [newpension.controller.audit :as audit]
            [newpension.controller.report :as report]
            [ring.util.response :refer [redirect file-response]]
            [noir.response :as resp]
            ))

(defn home-page []
  (layout/render
    "home.html" {:content (util/md->html "/md/docs.md")}))

(defn update-page []
  (layout/render "update.html"))

(defn dm-page []
  (layout/render "dm.html"
    {:usermsg (json/json-str (dissoc (session/get :usermsg) :passwd)  :escape-unicode false)
     :loginname (:username (session/get :usermsg))}
    ))
(defn dm2-page []
  (layout/render "dm2.html"))

(defn dm3-page [req]
  (layout/render "dm3.html"
    {:functionid (:id (:params req))
     :username (:username (session/get :usermsg))
     :usermsg (json/json-str (dissoc (session/get :usermsg) :passwd)  :escape-unicode false)
     :menuone (json/json-str (mymngctrl/get-function-by-id-str req) :escape-unicode false)
     :menutwo (str (json/json-str (mymngctrl/get-user-menutree-str req) :escape-unicode false))
     }))


(defn upload-page []
  (layout/render "testphoto.html"))

(defn testpost-page []
  (layout/render "testpost.html"))

(defroutes home-routes
  (GET "/upload" [] (upload-page))
  (GET "/testpost" [](testpost-page))
  ;(POST "/photo/addphoto" [file] (depart/add-photo file))
  (POST "/photo/addphoto" [file] (report/test-myexcel file))
  (GET "/get-file/:file-name" [file-name]
    (depart/server-file file-name))
  (GET "/myimage/:user-id/:file-name" [user-id file-name]
    (depart/mytest user-id file-name))

  (POST "/getdistrictname" request (old/getdistrictname request))
  (GET "/" request (old/home request)) ;;登录页面
  (GET "/index" request (old/home request))  ;;退出后跳到登录页面
  (GET "/loginbtn2" request (old/loginbtn2 request))  ;;用户登录
  (POST "/loginbtn2" request (old/loginbtn2 request))  ;;用户登录
  (GET "/logout" request (old/logout request))      ;;退出登录

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
;  (GET "/audit" [functionid loginname dvcode page rows] (old/get-audits functionid loginname dvcode page rows))      ;;待办业务查询
  (GET "/audit" [functionid page rows] (old/get-audits functionid page rows))      ;;待办业务查询
  (POST "/audit" [functionid page rows] (old/get-audits functionid page rows))      ;;待办业务查询
  (POST "/checkaudit" [flag aulevel digest tprkey auditid dvcode loginname username opseno]      ;;养老信息待办业务操作
    (old/update-audit flag aulevel digest tprkey auditid dvcode loginname username opseno))
  (GET "/func" [username functionid] (old/get-funcs username functionid))
  (GET "/get-inputlist" [aaa100] (old/get-inputlist aaa100))  ;;获取输入框下拉选项列表
  (GET "/get-divisionlist" [dvhigh] (old/get-divisionlist dvhigh))  ;;获取行政区划下拉选项列表
  (GET "/gethometown" [identityid] (old/get-hometown identityid))  ;;根据身份证查找籍贯

  (POST "/update-oldsorel" reuqest (old/update-oldsorel reuqest))    ;;修改养老家庭成员信息
  (POST "/oldsocrelkey" [] (old/oldsocrelkey))    ;;家庭成员信息表主键
  (POST "/dele-oldsorel" [lrgx_id] (old/dele-oldsorel lrgx_id))   ;;删除家庭成员关系表
  (GET "/needs" [] (need/get-needs))             ;;人员评估信息查询
  (POST "/needs" [] (need/get-needs))             ;;人员评估信息查询
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
  ;;###############数据库###################
  (POST "/old/search-oldpeople" request (old/search-oldpeople request))       ;;根据关键字模糊查询养老信息
  (POST "/searchid" [id] (old/get-oldid id))          ;;根据主键查看养老详细信息
  (POST "/get-oldsocrel" [lr_id] (old/get-oldsocrel lr_id))   ;;查询家庭成员关系表
  ;;###############服务评估###################
  (POST "/need/search-oldassessment" request (need/search-oldassessment request))             ;;人员评估信息查询
  (GET "/getoperationlog" request (old/get-operationlog request))       ;;操作日志查询
  (POST "/getoperationlog" request (old/get-operationlog request))       ;;操作日志查询
  ;;###############养老服务资源###################
  (POST "/pension/adddepartment" request (depart/add-department request))       ;;添加机构
  (POST "/pension/getalldepartment" request (depart/getall-department request))       ;;查询全部
  (POST "/pension/getalldepartment2" request (depart/getall-department2 request))       ;;查询全部
  (POST "/pension/getdepartmentbyid" request (depart/get-departbyid request))          ;;根据id查找机构数据
  (POST "/pension/updatedepartmentbyid" request (depart/update-departbyid request))     ;;更新机构
  (POST "/pension/deletedepartmentbyid" request (depart/delete-departbyid request))          ;;删除机构
  (POST "/pension/checkidentityid" request (depart/checkidentityid request))              ;;根据身份证从老年表中查询老年人信息
  (POST "/pension/addoldpeopledepart" request (depart/add-oldpeople-depart request))     ;;添加入住人员
  (POST "/pension/updateopdepbyid"  request (depart/update-opdep-byid request))              ;;更新入住人员信息
  (POST "/pension/oldpeoplecheckout" request (depart/oldpeople-checkout request))               ;;入住人员离开
  (POST "/pension/getalloldpeopledepart" request (depart/select-opdofdepart request))          ;;获取现入住机构的老人
  (POST "/pension/addcanteen" request (depart/add-canteen  request))                         ;;食堂添加
  (POST "/pension/getallcanteen" request (depart/getall-canteen  request))                      ;;食堂查询
  (POST "/pension/updatecanteen" request (depart/update-canteen  request))                      ;;食堂修改
  (POST "/pension/deletecanteen" request (depart/delete-canteen  request))                       ;;删除食堂

  (POST "/pension/getdepartmentbyname"  request (depart/get-departmentbyname  request))      ;;
  (POST "/pension/getopbydepid" request (depart/get-opbydepid request))

  (POST "/pension/auditfunction" request (old/audit-fun request))                                     ;;审核
  (POST "/pension/get-auditpeople" request (old/get-auditpeople request))                     ;;获取未通过审批的老年人

  (POST "/pension/evaluateoldpeople" request (old/evaluate-oldpeople request))                  ;;评估
 ;; (POST "/pension/getassessment" request (old/get-assessment request))                             ;;获取未评估的数据



  (POST "/audit/addauditapply" request (audit/add-audit-apply request))                           ;;居家养老服务申请
  (POST "/audit/getapplylist" request (audit/get-apply-list request))                              ;;获取未提交的申请列表
  (POST "/audit/deleteapplybyid" request (audit/delete-apply-byid request))                        ;;删除未处理的申请列表
  (POST "/audit/getapplybyid" request (audit/get-apply-byid request))                              ;;根据id查找
  (POST "/audit/getallapply" request (audit/getall-apply request))                                     ;;查找未处理的申请
  (POST "/audit/updateapply" request (audit/update-apply request))                                    ;;更新申请
  (POST "/audit/addassessmessage" request (audit/add-assessmessage request))            ;;添加居家养老评估信息
  (POST "/audit/getassessbyid" request (audit/get-assessbyid request))                                 ;;通过申请id获取评估信息
  (POST "/audit/assesscomplete" request (audit/assess-complete request))                                      ;;评估信息提交
  (POST "/audit/getassessaudit" request (audit/get-assessaudit request))                               ;;获取评估审核信息
  ;(POST "/audit/getassessauditbyid" request (audit/getassessauditbyid request))
  (POST "/audit/assessauditsubmit" request (audit/assess-audit request))                                ;;评估信息审核
  (POST "/audit/getauditdata" request (audit/get-audtidata request))                                      ;;获取审核通过的信息
  (POST "/audit/removesubmit" request (audit/remove-submit request))                                        ;;注销居家养老的老人
  (POST "/audit/removeaudit" request (audit/remove-audit request))                                          ;;注销审核
  (POST "/audit/get-removeaudit" request (audit/get-removeaudit request))                                   ;;获取注销流程数据
  (POST "/audit/getallauditrm" request (audit/getall-auditrm request))                                              ;;获取已经注销人员信息
  (POST "/audit/reassess" request (audit/reassess request))                                                           ;;更改信息，重新评估
  (POST "/audit/addjjyldepart" request (audit/add-jjyldepart request))                                              ;;添加居家养老服务机构
  (POST "/audit/getalljjyldepart" request (audit/getall-jjyldepart request))                                        ;;获取居家养老服务机构
  (POST "/audit/getjjyldepartbyid" request (audit/get-jjyldepartbyid request))                                       ;;根据id获取居家养老服务机构信息
  (POST "/audit/updatejjyldepart" request (audit/update-jjyldepart request))                                      ;;更新居家养老服务机构
  (POST "/audit/deljjyldepart" request (audit/delete-jjyldepart request))                                          ;;删除居家养老服务机构
  (POST "/audit/adddepservice" request (audit/add-depservice request))                                              ;;添加机构服务人员
  (POST "/audit/getalldepservice" request (audit/getall-depservice request))                                            ;;获取服务人员信息
  (POST "/audit/updatedsbyid" request (audit/update-dsbyid request))                                                     ;;修改服务人员信息
  (POST "/audit/getdepservicebyid"  request (audit/get-depservicebyid request))                                    ;;根据id获取服务人员信息
  (POST "/audit/deldepservicebyid" request (audit/delete-depservice-byid request))                                  ;;根据id删除服务人员

  (POST "/audit/gethositaldata" request (audit/get-hospitaldata request))                                              ;;获取未申请住院补助信息
  (POST "/audit/applyhospitalsubsidy" request (audit/apply-hospitalsubsidy request))                                 ;;住院补助申请
  (POST "/audit/hospitalsubsidyaudit"  request (audit/hospitalsubsidy-audit request))                                     ;;获取审核流程中的住院补助信息
  (POST "/audit/gethsdatabyid" request (audit/get-hsdatabyid request))                                                      ;;通过id获取老人信息
  (POST "/audit/audithsapply" request (audit/audit-hsapply request))                                                          ;;审核住院补助申请
  (POST "/audit/getallaudiths" request (audit/getallaudiths request))                                                                 ;;获取住院补贴通过的人

  (POST "/audit/getqualifyop" request (audit/getqualifyop request))                                                         ;;查询具有资金发放资格的人员
  (POST "/audit/getcompleteqop" request (audit/getcompleteqop request))                                                ;;查找已经发放的人员

  (POST "/audit/sendmoney" request (audit/sendmoney request))                                                         ;;资金发放
  (POST "/audit/sendallmoney" request (audit/sendallmoney request))                                                     ;;全部发放
  (POST "/audit/resendmoney" request (audit/resendmoney request))                                                  ;;重新发放
  (POST "/audit/getmoneyreport" request (audit/get-moneyreporttab request))                                           ;;excel导出人员补助信息
  (POST "/audit/getyearmoneyreport" request (audit/get-yearmoneyreporttab request))                                    ;;excel导出地区补助信息
  (GET "/audit/getauditdatareport" request (audit/setexcel-auditdata request))                                                ;;居家养老数据导出excel
  (GET "/old/getoldpeopledata" request (old/getoldpeopledata request))
  (GET "/depart/oldepartreport" request (depart/oldepartreport request))

  (POST "/depart/getopdsigin" request (depart/get-odp-signdata request))                                               ;;获取签到人员数据
  (POST "/depart/opdsign" request (depart/oldsign request))                                                                   ;;单个签到
  (POST "/depart/opddesigncancle" request (depart/opddesigncancle request))                                      ;;取消单个签到
  (POST "/depart/opddesignall" request (depart/opd-design-all request))
  (POST "/depart/opdselectsign" request (depart/opd-select-design request))

  (POST "/depart/addcarecenter" request (depart/add-carecenter request))                                  ;;新增照料中心
  (POST "/depart/getcarecenterlist" request (depart/get-carecenter-list request))                          ;;获取照料中心数据
  (POST "/depart/updatecarecenter" request (depart/update-carecenter request))                           ;;更新照料中心信息

  (POST "/depart/addcarepeople" request (depart/add-carepeople request))                       ;;添加照料人员
  (POST "/depart/getcarepeoplelist" request (depart/get-carepeople-list request))          ;;获取照料人员列表
  (POST "/depart/updatecarepeople" request (depart/update-carepeople request))              ;;更新照料人员信息
  (POST "/depart/leavecarepeople" request (depart/leave-carepeople request))              ;;照料人员离开

  (POST "/depart/addcareworker" request (depart/add-careworker request))                      ;;添加照料工作人员
  (POST "/depart/getcareworkerlist" request (depart/get-careworker-list request))            ;;获取照料信息工作人员列表
  (POST "/depart/updatecareworker" request (depart/update-careworker request))                ;;更新照料工作人员信息

  (POST "/depart/addbigevent" request (depart/add-bigevent request))                          ;;添加大型活动
  (POST "/depart/getbigeventlist" request (depart/get-bigevent-list request))                 ;;获取大型活动列表
  (POST "/depart/updatebigevent" request (depart/update-bigevent request))                     ;;更新大型活动信息

  (POST "/depart/addhomevisit" request (depart/add-homevisit request))                     ;;添加上门访问记录
  (POST "/depart/gethomevistlist" request (depart/get-homevist-list request))                      ;;获取上门访问列表
  (POST "/depart/updatehomevisit" request (depart/update-homevisit request))                 ;;更行上访记录信息

  (POST "/depart/getsigncarepeople" request (depart/get-sign-carepeople request))         ;;获取照料人员签到列表
  (POST "/depart/signcarepeople" request (depart/sign-carepeople request))                  ;;单个签到
  (POST "/depart/cancelcarepeoplesign" request (depart/cancle-carepeople-sign request))     ;;取消签到
  (POST "/depart/carepeopleallsign" request (depart/carepeople-all-sign request))              ;;全部签到
  (POST "/depart/carepeopleselectsign" request (depart/carepeople-select-sign request))          ;;选择签到

  (POST "/depart/adddepartentry" request (depart/add-departentry request))              ;;机构出入登记
  (POST "/depart/getdepartentrylist" request (depart/get-departentry-list request))      ;;获取机构出入记录列表

  (POST "/old/oldestpeople" request (old/add-oldestpeople request))                                          ;;高龄老人
  (POST "/old/getoldestpeople" request (old/get-oldestpeople request))                                        ;;高龄老人查询
  (POST "/old/updateoldestpeople" request (old/update-oldestpeople request))                                  ;;高龄老人的更新
  (POST "/old/deloldestpeople" request (old/delete-oldestpeople request))                                      ;;高龄老人数据删除
  (POST "/old/addenpeople" request (old/add-emptynestpeople request))                                ;;空巢老人数据添加
  (POST "/old/getenpeople" request (old/get-emptynestpeople request))                                ;;查找空巢老人数据
  (POST "/old/updateenpeople" request (old/update-emptynestpeople request))                          ;;更新空巢老人数据
  (POST "/old/delenpeople" request (old/del-emptynestpeople request))                                ;;注销空巢老人数据
  (POST "/old/enpeoplestatistic" request (old/emptynest-statistic request))                          ;;空巢老人数据统计分析
  (POST "/old/getemptydetail" request (old/get-emptynest-detail request))                            ;;获取空巢老人每项具体数据
  (POST "/old/addoldcarepeople" request (old/add-oldcarepeople request))                                    ;;新增优抚老人数据
  (POST "/old/getocpeople" request (old/get-oldcarepeople request))                                          ;;优抚老人查询
  (POST "/old/updateocpeople" request (old/update-oldcarepeople request))                                    ;;优抚老人数据更新
  (POST "/old/delocpeople" request (old/delete-oldcarepeople request))                                       ;;优抚老人数据删除


  ;(POST "/old/opstatistic" request (old/opstatistic request))                                                                  ;;老人信息统计
  ;(POST "/audit/jjylstatistic" request (audit/jjyl-statistic request))                                                             ;;居家养老统计
 ; (POST "/depart/departstatistic" request (depart/depart-statistic request))                                                ;;机构统计分析


 (POST "/old/opstatistic" request (old/opstatistic3 request))                                                                  ;;老人信息统计2
  (POST "/audit/jjylstatistic" request (audit/jjyl-statistic3 request))                                                             ;;居家养老统计2
  (POST "/depart/departstatistic" request (depart/depart-statistic3 request))                                                ;;机构统计分析2

 ; (GET "/test/testtime" request (audit/testtime request))
  (POST "/old/setoldmap" request (old/set-oldmap request))                                                                       ;;设置地图

  (GET "/test/testgetmyexcel" path (report/test-myexcel path))

  (GET "/getdivisionbyid" [highid] (old/getdivisionbyid highid))




  (POST "/queryyljg" [] (old/get-yljg) )
;  (GET "/queryyljg" [] (exec-raw ["SELECT * FROM t_mpensionagence"] :results) )

  ;;(POST  "/test/testapprove" request (old/add-approve0 request))


  ;报表 pdf 和 excel
  (GET "/report-pdf/:report-type" [report-type] (report/generate-report-pdf report-type));;测试用例:table :list
  ;;/report-pdf/table-pdf
  ;;/report-pdf/list-pdf
  (GET "/report-xls/:report-type" [report-type] (report/generate-report-xls report-type))
  ;;/report-xls/my-test1   调用的是java
  ;;/report-xls/my-test2   调用的是clj-excel.core
  (GET "/report-xls-months" req (report/xls-report-by-months req))        ;;导出月份报表
  (GET "/report-xls-summary" req (report/xls-report-by-summary req))        ;;导出汇总表
  (GET "/report-xls-auto" req (report/xls-report-auto req))        ;;导出xls,自动列
;  (POST "/report-xls-auto" req (report/xls-report-auto req))        ;;导出xls,自动列
;  (GET "/reportxls" req (report/reportxls))

  (GET "/getdivisionid" req (old/test-getdivisionid req))

  (POST "/test/importexcel" [file] (report/excelimport file))                               ;;postgis 数据导入测试

  (GET "/phone" [] (layout/render "testphoto.html"))

;  (GET "/index2" [] (if (session/get :usermsg)
;                       (layout/render "index2.html" {:username (:username (session/get :usermsg)) :usermsg (json/json-str (dissoc (session/get :usermsg) :passwd)  :escape-unicode false)})
;                       (layout/render "login.html")
;                       ))

;  (POST "/fileupload" file (file/getfilesysfile file))

  )
