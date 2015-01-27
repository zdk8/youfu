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
            ))

(defn home-page []
  (layout/render
    "home.html" {:content (util/md->html "/md/docs.md")}))

(defn update-page []
  (layout/render "update.html"))

(defn addold-page []
  (layout/render "addold.html" {:username (:username (session/get :usermsg))}))

(defn old-page []
  (layout/render "old.html"))

(defn log-page [functionid]
  (layout/render "log.html" {:functionid functionid}))

(defn audit-page [functionid funcid]
  (layout/render "audit.html" {:functionid functionid :funcid funcid :username (:username (session/get :usermsg))}))

(defn need-page []
  (layout/render "need.html"))

(defn addneed-page []
  (layout/render "addneed.html"))
(defn dm-page []
  (layout/render "dm.html"
    {:usermsg (json/json-str (dissoc (session/get :usermsg) :passwd)  :escape-unicode false)}
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
  (POST "/photo/addphoto" [file] (depart/add-photo file))
  (GET "/get-file/:file-name" [file-name]
    (depart/server-file file-name))
  (GET "/myimage/:user-id/:file-name" [user-id file-name]
    (depart/mytest user-id file-name))

  (POST "/getdistrictname" request (old/getdistrictname request))
;  (GET "/dm" [] (dm-page));;;123456790
  (GET "/" request (old/home request)) ;;登录页面
  (GET "/index" request (old/home request))  ;;退出后跳到登录页面
  (GET "/dm" request (dm-page))
  (GET "/dm2" request (dm2-page))
  (GET "/dm3" request (dm3-page request))
  (POST "/loginbtn" request (old/loginbtn request))  ;;用户登录
  (GET "/loginbtn2" request (old/loginbtn2 request))  ;;用户登录
  (POST "/loginbtn2" request (old/loginbtn2 request))  ;;用户登录
  (POST "/logout" request (old/logout request))      ;;退出登录
  (GET "/logout" request (old/logout request))      ;;退出登录
  (GET "/addold" [] (addold-page))   ;;养老信息录入页面
  (GET "/logs" [functionid] (log-page functionid))      ;;操作日志页面
  (GET "/audits" [functionid funcid] (audit-page functionid funcid))     ;;待办业务页面
  (GET "/olds" [] (old-page))      ;;养老信息查询页面
  (GET "/need" [] (need-page))      ;;人员评估信息查询页面
  (GET "/addneed" [] (addneed-page))      ;;人员评估信息录入页面
  (GET "/GrantMoneyMng" [] (layout/render "GrantMoneyMng.html"))  ;;资金发放页面
;  (GET "/YangLaoJGManagement" [] (layout/render "YangLaoJGManagement.htm"))  ;;养老老机构
;  (GET "/YangLaoJGDlg" [] (layout/render "YangLaoJGDlg.html"))  ;;养老老机构

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
  (POST "/audit/reassess" request (audit/reassess request))                                                           ;;更改信息，重新评估
  (POST "/audit/addjjyldepart" request (audit/add-jjyldepart request))                                              ;;添加居家养老服务机构
  (POST "/audit/getalljjyldepart" request (audit/getall-jjyldepart request))                                        ;;获取居家养老服务机构
  (POST "/audit/getjjyldepartbyid" request (audit/get-jjyldepartbyid request))                                       ;;根据id获取居家养老服务机构信息
  (POST "/audit/updatejjyldepart" request (audit/update-jjyldepart request))                                      ;;更新居家养老服务机构
  (POST "/audit/adddepservice" request (audit/add-depservice request))                                              ;;添加机构服务人员
  (POST "/audit/getalldepservice" request (audit/getall-depservice request))                                            ;;获取服务人员信息
  (POST "/audit/updatedsbyid" request (audit/update-dsbyid request))                                                     ;;修改服务人员信息
  (POST "/audit/getdepservicebyid"  request (audit/get-depservicebyid request))                                    ;;根据id获取服务人员信息

  (POST "/audit/applyhospitalsubsidy" request (audit/apply-hospitalsubsidy request))                                 ;;住院补助申请

  (POST "/audit/getqualifyop" request (audit/getqualifyop request))                                                         ;;查询具有资金发放资格的人员
  (POST "/audit/getcompleteqop" request (audit/getcompleteqop request))                                                ;;查找已经发放的人员

  (POST "/audit/sendmoney" request (audit/sendmoney request))                                                         ;;资金发放
  (POST "/audit/resendmoney" request (audit/resendmoney request))                                                  ;;重新发放

  (GET "/test/testtime" request (audit/testtime request))




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
  )
