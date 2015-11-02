(ns shuangyong.controller.manager
  (:use compojure.core)
  (:require
            [shuangyong.models.manager :as basemd]
            [noir.response :as resp]
            [noir.session :as session]
            [taoensso.timbre :as timbre]
            [noir.io :as io]
            [shuangyong.models.schema :as schema]
            ))




(defn get-user-menutree-str [req]
  (let [{params :params}req
        node (get params :node)
        id (get params :id)
        ni (if node node id)
        loginname (:loginname (session/get :usermsg))
        results (if ni (basemd/menutree loginname ni) (basemd/menutree loginname "businessmenu"))]
    (map #(conj % {:leaf (if (=(get % :leaf) "true") true false) :state (if (=(get % :leaf) "true") "open" "closed")})results)
    )
  )
(defn get-function-by-id-str [req]
  (let [{params :params} req
        id (get params :id)
         results (first (basemd/get-function-by-id id))]
    (timbre/debug req)
    (println "*******************:::::" id)
    results))


(defn just-a-test
  []
  (let [results (basemd/menutree "admin" "bR8kBGp0A6lTmPkgOFxI")]
    (map #(conj % {:leaf (if (=(get % :leaf) "true") true false) :state (if (=(get % :leaf) "true") "open" "closed")})results)))

(defn get-user-menutree [req]
  (let [{params :params}req
        node (get params :node)
        id (get params :id)
        ni (if node node id)
        loginname (:loginname (session/get :usermsg))
        results (if ni (basemd/menutree loginname ni) (basemd/menutree loginname "businessmenu"))]
    (resp/json (map #(conj % {:leaf (if (=(get % :leaf) "true") true false) :state (if (=(get % :leaf) "true") "open" "closed")})results))
    )
  )


(defn get-all-user-menutree [req]
  (let [{params :params}req
        node (get params :node)
        id (get params :id)
        ni (if node node id)
        results (if ni (basemd/allmenutree  ni) (basemd/allmenutree  "totalroot"))]
    (resp/json (map #(conj % {:leaf (if (=(get % :leaf) "true") true false) :state (if (=(get % :leaf) "true") "open" "closed")})results))
    )
  )

(defn get-grant-menutree [req]
  (let [{params :params}req
        node (get params :node)
        roleid (get params :roleid)
        id (get params :id)
        ni (if node node id)
        results (if ni (basemd/grantmenutree roleid ni) (basemd/grantmenutree roleid "totalroot"))]
    (resp/json (map #(conj % {:leaf (if (=(get % :leaf) "true") true false) :state (if (=(get % :leaf) "true") "open" "closed")})results))
    )
  )
(defn save-grant [req]
  (let [{params :params}req
        node (get params :node)
        roleid (get params :roleid)
        ids (get params :functionids)]
    (basemd/save-grant roleid ids)
    (resp/json {:success true})
    )
  )
(defn save-role-user [req]
  (let [{params :params}req
        node (get params :node)
        userid (get params :userid)
        ids (get params :roleids)]
    (basemd/save-role-user userid ids)
    (resp/json {:success true})
    )
  )


(defn get-divisiontree [req]
  (let [{params :params}req
        node (get params :node)
        id (get params :id)
        ni (if node node id)
        ;;current-xian (:dvcode (session/get :usermsg));(str (subs (:dvcode (session/get :usermsg)) 0 4) "00")
;        results (if ni (basemd/divisiontree ni) (basemd/divisiontreefirst "330424"))
        results (if ni (basemd/divisiontree ni) (basemd/divisiontreefirst (:regionid (session/get :usermsg))))
        ]
    (resp/json (map #(conj % {:leaf (if (=(get % :leaf) "true") true false) :state (if (=(get % :leaf) "true") "open" "closed")})results))
    )
  )

(defn getdistrictname [request]
  (let[params (:params request)
       districtid (:districtid params)]
    (resp/json (basemd/getdistrictname districtid))))


(defn get-function-by-id [id]
  (let [results (first (basemd/get-function-by-id id))]
    (resp/json results)))

(defn get-user-by-regionid [req]
  (let [{params :params} req
        {page :page} params
        {rows :rows} params
        r   (read-string rows)
        p  (read-string page)
        start  (inc(* r (dec p)))
        end (* r p)
        {username :username} params
        totalsql  (str "select u.* from xt_user u where u.username like '" username "%' order by createdate desc")
        total (count (basemd/get-results-bysql totalsql))
        results (basemd/getall-results start end totalsql)]
    (resp/json {:total total :rows results})
    ))
(defn get-user-by-id [id]
  (let [results (first (basemd/get-user-by-id id))]
    (resp/json results)))

(defn del-function-by-id [id]
  (basemd/del-function-by-id id))

(defn create-function [req]
  (let [{params :params} req
        {functionid :functionid} params
        results (if (= functionid "-1") (basemd/create-function params) (basemd/update-function params functionid))
        ]
    (resp/json {:test "test"})))
(defn getFunctionImg [req]
  (let [{params :params} req
        {functionid :funcid} params]
    (resp/json (basemd/getFunctionImg functionid))
    )
  )


(defn create-combo [req]
  (let [{params :params} req
        {flag :flag} params
        {aaa100 :aaa100} params
        params2 (dissoc params :flag)
        results (if (= flag "-1") (basemd/create-combo params2) (basemd/update-combo params aaa100))
        ]
    (resp/json {:success true})))
(defn del-combo [req]
  (let [{params :params} req
        {aaa100 :aaa100} params
        isnull (basemd/query-combodt aaa100)
        ]
    (println "RRRRRRRRRRRRRRRR" (count isnull))
    ;    (basemd/del-combo aaa100)
    (if (> (count isnull) 0) (str "false") (do (basemd/del-combo aaa100) (str "true")))
    ))
(defn create-combodt [req]
  (let [{params :params} req
        {flag :flag} params
        {aaz093 :aaz093} params
        params2 (dissoc params :flag)
        results (if (= flag "-1") (basemd/create-combodt params2) (basemd/update-combodt params aaz093))
        ]
    (resp/json {:success true})))
(defn del-combodt [req]
  (let [{params :params} req
        {aaz093 :aaz093} params
        ]
    (basemd/del-combodt aaz093)
    (resp/json {:success true}))
  )

#_(defn delete-function [id]
    (let [results (basemd/delete-function id)]
      (resp/json {:test "test"})))

(defn get-combo [req]
  (let [ results (basemd/get-combos req)]
    (resp/json results)))
(defn get-combo-by-pr [req]
  (let [ {params :params} req
         {aaa100 :aaa100} params
         results (basemd/get-combo-by-pr aaa100)]
    (resp/json (first results))))
(defn get-combodt-by-pr [req]
  (let [ {params :params} req
         {aaz093 :aaz093} params
         results (basemd/get-combodt-by-pr aaz093)]
    (resp/json (first results))))
(defn get-combodt [req]
  (let [{params :params} req
        {aaa100 :aaa100} params
        results (basemd/get-combodts aaa100)
        ]
    (resp/json results)))


(defn getenumbytype [type callback]
  (let [

         reuslts (basemd/getenumeratebytype type)
         ]
    (if (nil? callback) (resp/json reuslts)(resp/jsonp callback reuslts))
    )

  )
(defn getenumbytypeandv [type value]
  (resp/json (basemd/getenumeratebytypeandv type value))
  )
(defn create-user [req]
  (let [{params :params} req
        {flag :flag} params
        {userid :userid} params
        params2 (dissoc params :flag)
        results (if (= flag "-1") (basemd/create-user params2) (basemd/update-user params userid))
        ]
    (resp/json {:success true})))
(defn del-user-by-id [id]
  (resp/json (basemd/delete-user id))
;  (println "RRRRRRRRRRRRR" (basemd/delete-user id))
;  (resp/json {:success true})
  )


;;角色
(defn get-role [req]
  (let [{params :params} req
        {userid :userid} params
        {rolename :rolename} params
         results (if userid (basemd/get-role-by-userid userid) (basemd/get-role rolename))]
    (resp/json results)))

(defn create-role [req]
  (let [{params :params} req
        {flag :flag} params
        {roleid :roleid} params
        params2 (dissoc params :flag)
        results (if (= flag "-1") (basemd/create-role params2) (basemd/update-role params roleid))
        ]
    (resp/json {:success true})))
(defn del-role-by-id [id]
  (basemd/delete-role id)
  (resp/json {:success true})
  )
(defn get-role-by-id [id]
  (let [results (first (basemd/get-role-by-id id))]
    (resp/json results)))

(defn uploadfile
  "文件上传"
  [file  dirpath filename]
;  (let [havedir (fs/exists? dirpath)
        ;        uploadpath (str schema/datapath "upload/")
        ;        timenow (c/to-long  (l/local-now))
        ;;       filename (str timenow (:filename file))
        ;        filename (str filenamemsg fileext)
        ;        filesie (:size file)
        ;        filedata {:file_anme filenamemsg :attach_type filetype :fie_path (str "/upload/" filetype "/" filename) :file_size filesie :file_type fileext :pc_id pc_id}
;        ]
    ;    ;(println  "FFFFFFFFFFFF" file)
    ;
    ;    filedata
;    (if havedir "" (fs/mkdirs dirpath))     ;如果文件不存在，建立此文件
    (io/upload-file dirpath  (conj file {:filename filename}))
;    )
  )  ;文件上传

;;图标上传
(defn uploadimg [file pc_id filetype filenamemsg fileext]
  (try
    (let[;filedata (common/uploadfile file pc_id filetype filenamemsg fileext)
         uploadpath (str schema/datapath "images/menu/")      ;获取当前目录
;         timenow (c/to-long  (l/local-now))              ;当前时间数字
         ;        filename (str timenow (:filename file))
         filename (str filenamemsg fileext)              ;文件名称
         filesie (:size file)                            ;文件大小
         filedata {:file_name filenamemsg :attach_type filetype :fie_path (str "/upload/" filetype "/" filename) :file_size filesie :file_type fileext :pc_id pc_id}
         dirpath (str uploadpath filetype)
         ]
;      (uploadfile file  dirpath filename)
;      (db/adddata-by-tablename "t_attach_files" filedata)
;      (str "success")
      (println "RRRRRRRRRRR" uploadpath filename filesie filedata dirpath)
      )
    (catch Exception e (str (.getMessage e )))
    ))


;;session test
(defn my-session-put [name]
  (session/put! :username name)
  (session/put!  :date "2014")
  (resp/json {:success (session/get :username)}))
(defn my-session-get []
  (resp/json {:success (session/get :username) :date (session/get :date) :loginname (session/get  :loginname) :username (session/get  :username)}))
(defn my-session-remove []
  (resp/json {:success (session/remove! :username)}))

;;加载模块
(defn get-function-byuser [req]
  (resp/json (basemd/get-function-byuser (:userid (session/get :usermsg))))
;    (resp/json (basemd/get-function));;权限放开
  )
(defn get-functionmenu [req]
  (let [{params :params} req
        funcid (get params :funcid)
        userid (:userid (session/get :usermsg))
        ]
    (resp/json (basemd/get-functionmenu userid funcid))
    ))