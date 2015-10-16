(ns partymgt.controller.controller
  (:use compojure.core)
  (:require
    [partymgt.models.db :as db]
    [partymgt.common.common :as common]
    [partymgt.models.schema :as schema]
    [noir.response :as resp]
    [clojure.data.json :as json]
    [clojure.string :as cstr]
    [clj-time.local :as l]
    [clj-time.coerce :as c]
    [ring.util.response :as response :refer [file-response]]
    [clojure.string :as str]
    ))

(defn upload-file [file]
  (let [uploadpath (str schema/datapath "resources/public/upload/")      ;获取当前目录
        timenow (c/to-long  (l/local-now))              ;当前时间数字
        filename (:filename file)
        pathname (str  timenow filename)
        photopath  (if (> (count filename) 0) (str "upload/" pathname) )
        ]
    (if (> (count filename) 0) (common/uploadfile file  uploadpath pathname))
    photopath))


(defn add-pensonrecords
  "人事档案数据增加"
  [request]
  (let [params (:params request)
        getprdata (select-keys params (:t_personalrecords common/selectcols))
        getedudata  (json/read-str  (:educationway params) :key-fn keyword)
        getfamilydata (json/read-str  (:familymembers params) :key-fn keyword)
        prnextid (:nextval (first(db/get-results-bysql "select seq_t_personalrecords.nextval  from dual")))
        prdata (conj (common/dateformat-bf-insert getprdata  "worktime" "partytime" "employtime" "contractsigntime" "contractdeadline" "incumbenttime") {:pr_id prnextid})
        edudata (map #(conj % {:pr_id prnextid}) getedudata)
        familydata (map #(conj % {:pr_id prnextid}) getfamilydata)
        file (:file params)
        photopath (upload-file file)
        ]
    ;(println "PPPPPPPPPP" params )
    ;(println "EEEEEEEEEE" photopath )
    ;(println "FFFFFFFFFF" familydata)
    (db/add-pensonrecords (conj prdata {:photo photopath})  edudata familydata)
    (str "true")))

(defn get-record-list
  "人事档案数据列表查询"
  [request]
  (let [params (:params request)
        name (:name params)
        identityid (:identityid params)
        rows (:rows params)
        page (:page params)
        group (:group params)
        idtype (:idtype params)
        id (:id params)
        ;pb_id (:pb_id params)
        ;cy_id (:cy_id params)
        ;vc_id (:vc_id params)
        ;wg_id (:wg_id params)
        ;tu_id (:tu_id params)
        groupcond (condp = group                                                ;党建组织查询过滤
                    "0" (str " and " idtype " is null ")
                    "1" (str " and " idtype " = " id)
                    nil)
        ;groupcond (if (> (count group) 0)
        ;            (if (= group "0")
        ;              (str (if (> (count pb_id) 0) (str " and pb is null " )) (if (> (count cy_id) 0) (str " and cy is null  " )) (if (> (count vc_id) 0) (str " and vc is null  " )) (if (> (count wg_id) 0) (str " and wg is null  " )) (if (> (count tu_id) 0) (str " and tu is null  " )))
        ;              (str (if (> (count pb_id) 0) (str " and pb = " pb_id)) (if (> (count cy_id) 0) (str " and cy = " cy_id)) (if (> (count vc_id) 0) (str " and vc = " vc_id)) (if (> (count wg_id) 0) (str " and wg = " wg_id)) (if (> (count tu_id) 0) (str " and tu = " tu_id)))))
        conds (str " and isdel is null" (common/likecond "name" name) (common/likecond "identityid" identityid) groupcond)
        getresult (common/fenye rows page "t_personalrecords" "*" conds " order by pr_id desc")
        ]
    (println "GGGGGGGGGG" groupcond)
    (resp/json {:total (:total getresult) :rows (common/dateymd-bf-list (:rows getresult) "worktime" "partytime" "employtime" "contractsigntime" "contractdeadline" "incumbenttime")})))


(defn update-record-byid
  "根据id更新人事档案的数据"
  [request]
  (let [params (:params request)
        pr_id (:pr_id params)
        getprdata (select-keys params (:t_personalrecords common/selectcols))
        getedudata  (json/read-str  (:educationway params) :key-fn keyword)
        getfamilydata (json/read-str  (:familymembers params) :key-fn keyword)
        prdata (common/dateformat-bf-insert getprdata  "worktime" "partytime" "employtime" "contractsigntime" "contractdeadline" "incumbenttime")
        edudata (map #(conj % {:pr_id pr_id}) getedudata)
        familydata (map #(conj % {:pr_id pr_id}) getfamilydata)
        photo (:photo params)
        file (:file params)
        filename (:filename file)
        photopath (if (> (count filename) 0) (do (common/delfile (str schema/datapath photo))                       ;如果头像图片更新，先删除旧头像
                                                  (upload-file file))                                                 ;再更新新头像
                                              photo)
        ]
    (db/update-pensonrecords (conj prdata {:photo photopath})  edudata familydata pr_id)
    (str "true")))

(defn delete-record-byid [request]
  (let [params (:params request)
        pr_id (:pr_id params)]
    (db/updatedata-by-tablename "t_personalrecords" {:isdel "1"} {:pr_id pr_id})
    (str "true")))

(defn get-record-byid [request]
  (let [params (:params request)
        pr_id (:pr_id params)
        ;getprdata    (db/selectdatas-by-tablename "t_personalrecords" {:pr_id pr_id})
        getedudata   (db/selectdatas-by-tablename "t_educationway" {:pr_id pr_id})
        getfamilydata (db/selectdatas-by-tablename "t_familymember" {:pr_id pr_id})
        ;prdata (conj (common/dateymd-bf-list getprdata "worktime" "partytime" "employtime" "contractsigntime" "contractdeadline" "incumbenttime") {:educationway getedudata :familymembers getfamilydata} )
        ]
    (resp/json {:educationway getedudata :familymembers getfamilydata})))


(defn add-partybranch
  "新增党支部"
  [request]
  (let [params (:params request)
        partydata (select-keys params (:t_partybranch common/selectcols))]
    (db/adddata-by-tablename "t_partybranch" (common/dateformat-bf-insert partydata "pb_createtime"))
    (str "true")))

(defn update-party-byid
  [request]
  (let [params (:params request)
        pb_id (:pb_id params)
        partydata (select-keys params (:t_partybranch common/selectcols))]
    (db/updatedata-by-tablename "t_partybranch" (common/dateformat-bf-insert partydata "pb_createtime") {:pb_id pb_id})
    (str "true")))

(defn get-depart-list
  [request]
  (let [params (:params request)
        pb_name (:pb_name params)
        rows (:rows params)
        page (:page params)
        conds (str " and isdel is null"  (common/likecond "pb_name" pb_name))
        getresult (common/fenye rows page "t_partybranch" "*" conds " order by pb_id desc")]
    (resp/json {:total (:total getresult) :rows (common/dateymd-bf-list (:rows getresult) "pb_createtime") })))

(defn add-people-to-party [request]
  (let [params (:params request)
        pb_id (:id params)
        pr_ids  (:pr_ids params)
        ]
    (if (= pr_ids "all") (db/deal-allpeople-to-group "t_personalrecords" {:pb pb_id} {:pb nil :isdel nil})
                         (db/deal-people-to-group "t_personalrecords" {:pb pb_id} (cstr/split pr_ids #"," )))
    (str "true")))

(defn remove-people-to-party [request]
  (let [params (:params request)
        pb_id (:id params)
        pr_ids (:pr_ids params)
        ]
    (if (= pr_ids "all") (db/deal-allpeople-to-group "t_personalrecords" {:pb nil} {:pb pb_id})
                         (db/deal-people-to-group "t_personalrecords" {:pb nil} (cstr/split pr_ids #"," )))
    (str "true")))

(defn delete-partybranch [request]
  (let [params (:params request)
        pb_id (:pb_id params)]
    (db/updatedata-by-tablename "t_partybranch" {:isdel "1"} {:pb_id pb_id})
    (str "true")))

;;共青团
(defn add-youthleague [request]
  (let [params (:params request)
        youthdata (select-keys params (:t_communistyouthleague common/selectcols))]
    (db/adddata-by-tablename "t_communistyouthleague" (common/dateformat-bf-insert youthdata "cy_createtime"))
    (str "true")))

(defn update-youthleague-byid
  [request]
  (let [params (:params request)
        cy_id (:cy_id params)
        youthdata (select-keys params (:t_communistyouthleague common/selectcols))]
    (db/updatedata-by-tablename "t_communistyouthleague" (common/dateformat-bf-insert youthdata "cy_createtime") {:cy_id cy_id})
    (str "true")))

(defn get-youthleague-list
  [request]
  (let [params (:params request)
        cy_name (:cy_name params)
        rows (:rows params)
        page (:page params)
        conds (str " and isdel is null"  (common/likecond "cy_name" cy_name))
        getresult (common/fenye rows page "t_communistyouthleague" "*" conds " order by cy_id desc")]
    (resp/json {:total (:total getresult) :rows (common/dateymd-bf-list (:rows getresult) "cy_createtime") })))

(defn add-people-to-youthleague [request]
  (let [params (:params request)
        cy_id (:id params)
        pr_ids (:pr_ids params)
        ]
    (println "SSSSSSSSSSS"  pr_ids "    " (= pr_ids "all"))
    (if (= pr_ids "all") (db/deal-allpeople-to-group "t_personalrecords" {:cy cy_id} {:cy nil :isdel nil})
                         (db/deal-people-to-group "t_personalrecords" {:cy cy_id} (cstr/split pr_ids #"," )))
    (str "true")))

(defn remove-people-to-league [request]
  (let [params (:params request)
        cy_id (:id params)
        pr_ids (:pr_ids params)
        ]
    (if (= pr_ids "all") (db/deal-allpeople-to-group "t_personalrecords" {:cy nil} {:cy cy_id})
                         (db/deal-people-to-group "t_personalrecords" {:cy nil} (cstr/split pr_ids #"," )))
    (str "true")))

(defn delete-youthleague [request]
  (let [params (:params request)
        cy_id (:cy_id params)]
    (db/updatedata-by-tablename "t_communistyouthleague" {:isdel "1"} {:cy_id cy_id})
    (str "true")))

;;老干部
(defn add-veterancadre [request]
  (let [params (:params request)
        veterandata (select-keys params (:t_veterancadre common/selectcols))]
    (db/adddata-by-tablename "t_veterancadre" (common/dateformat-bf-insert veterandata "vc_createtime"))
    (str "true")))

(defn update-veteran-byid
  [request]
  (let [params (:params request)
        vc_id (:vc_id params)
        veterandata (select-keys params (:t_veterancadre common/selectcols))]
    (db/updatedata-by-tablename "t_veterancadre" (common/dateformat-bf-insert veterandata "vc_createtime") {:vc_id vc_id})
    (str "true")))

(defn get-veteran-list
  [request]
  (let [params (:params request)
        vc_name (:vc_name params)
        rows (:rows params)
        page (:page params)
        conds (str " and isdel is null"  (common/likecond "vc_name" vc_name))
        getresult (common/fenye rows page "t_veterancadre" "*" conds " order by vc_id desc")]
    (resp/json {:total (:total getresult) :rows (common/dateymd-bf-list (:rows getresult) "vc_createtime") })))

(defn add-people-to-veteran [request]
  (let [params (:params request)
        vc_id (:id params)
        pr_ids (:pr_ids params)
        ]
    (if (= pr_ids "all") (db/deal-allpeople-to-group "t_personalrecords" {:vc vc_id} {:vc nil :isdel nil})
                         (db/deal-people-to-group "t_personalrecords" {:vc vc_id} (cstr/split pr_ids #"," )))
    (str "true")))

(defn remove-people-to-veteran [request]
  (let [params (:params request)
        vc_id (:id params)
        pr_ids (:pr_ids params)
        ]
    (if (= pr_ids "all") (db/deal-allpeople-to-group "t_personalrecords" {:vc nil} {:vc vc_id})
                         (db/deal-people-to-group "t_personalrecords" {:vc nil} (cstr/split pr_ids #"," )))
    (str "true")))

(defn delete-veterancadre [request]
  (let [params (:params request)
        vc_id (:vc_id params)]
    (db/updatedata-by-tablename "t_veterancadre" {:isdel "1"} {:vc_id vc_id})
    (str "true")))

;;妇女小组
(defn add-womengroup [request]
  (let [params (:params request)
        womendata (select-keys params (:t_womengroup common/selectcols))]
    (db/adddata-by-tablename "t_womengroup" (common/dateformat-bf-insert womendata "wg_createtime"))
    (str "true")))

(defn update-womengroup-byid
  [request]
  (let [params (:params request)
        wg_id (:wg_id params)
        womendata (select-keys params (:t_womengroup common/selectcols))]
    (db/updatedata-by-tablename "t_womengroup" (common/dateformat-bf-insert womendata "wg_createtime") {:wg_id wg_id})
    (str "true")))

(defn get-womengroup-list
  [request]
  (let [params (:params request)
        wg_name (:wg_name params)
        rows (:rows params)
        page (:page params)
        conds (str " and isdel is null"  (common/likecond "wg_name" wg_name))
        getresult (common/fenye rows page "t_womengroup" "*" conds " order by wg_id desc")]
    (resp/json {:total (:total getresult) :rows (common/dateymd-bf-list (:rows getresult) "wg_createtime") })))

(defn add-people-to-womengroup [request]
  (let [params (:params request)
        wg_id (:id params)
        pr_ids (:pr_ids params)
        ]
    (if (= pr_ids "all") (db/deal-allpeople-to-group "t_personalrecords" {:wg wg_id} {:wg nil :isdel nil})
                         (db/deal-people-to-group "t_personalrecords" {:wg wg_id} (cstr/split pr_ids #"," )))
    (str "true")))

(defn remove-people-to-womengroup [request]
  (let [params (:params request)
        wg_id (:id params)
        pr_ids (:pr_ids params)
        ]
    (if (= pr_ids "all") (db/deal-allpeople-to-group "t_personalrecords" {:wg nil} {:wg wg_id})
                         (db/deal-people-to-group "t_personalrecords" {:wg nil} (cstr/split pr_ids #"," )))
    (str "true")))

(defn delete-womengroup [request]
  (let [params (:params request)
        wg_id (:wg_id params)]
    (db/updatedata-by-tablename "t_womengroup" {:isdel "1"} {:wg_id wg_id})
    (str "true")))

;;工会
(defn add-tradeunion [request]
  (let [params (:params request)
        tradedata (select-keys params (:t_tradeunion common/selectcols))]
    (db/adddata-by-tablename "t_tradeunion" (common/dateformat-bf-insert tradedata "tu_createtime"))
    (str "true")))

(defn update-tradeunion-byid
  [request]
  (let [params (:params request)
        tu_id (:tu_id params)
        tradedata (select-keys params (:t_tradeunion common/selectcols))]
    (db/updatedata-by-tablename "t_tradeunion" (common/dateformat-bf-insert tradedata "tu_createtime") {:tu_id tu_id})
    (str "true")))

(defn get-tradeunion-list
  [request]
  (let [params (:params request)
        tu_name (:tu_name params)
        rows (:rows params)
        page (:page params)
        conds (str " and isdel is null"  (common/likecond "tu_name" tu_name))
        getresult (common/fenye rows page "t_tradeunion" "*" conds " order by tu_id desc")]
    (resp/json {:total (:total getresult) :rows (common/dateymd-bf-list (:rows getresult) "tu_createtime") })))

(defn add-people-to-tradeunion [request]
  (let [params (:params request)
        tu_id (:id params)
        pr_ids (:pr_ids params)
        ]
    (if (= pr_ids "all") (db/deal-allpeople-to-group "t_personalrecords" {:tu tu_id} {:tu nil :isdel nil})
                         (db/deal-people-to-group "t_personalrecords" {:tu tu_id} (cstr/split pr_ids #"," )))
    (str "true")))

(defn remove-people-to-tradeunion [request]
  (let [params (:params request)
        tu_id (:id params)
        pr_ids (:pr_ids params)
        ]
    (if (= pr_ids "all") (db/deal-allpeople-to-group "t_personalrecords" {:tu nil} {:tu tu_id})
                         (db/deal-people-to-group "t_personalrecords" {:tu nil} (cstr/split pr_ids #"," )))
    (str "true")))

(defn delete-tradeunion [request]
  (let [params (:params request)
        tu_id (:tu_id params)]
    (db/updatedata-by-tablename "t_tradeunion" {:isdel "1"} {:tu_id tu_id})
    (str "true")))

;;证件管理
(defn add-certificate [request]
  (let [params (:params request)
        cerdata (select-keys params (:t_certificate common/selectcols))]
    (db/adddata-by-tablename "t_certificate" (common/dateformat-bf-insert cerdata "birthday" "validity" "handdate"))
    (str "true")))

(defn update-certificate [request]
  (let [params (:params request)
        c_id (:c_id params)
        cerdata (select-keys params (:t_certificate common/selectcols))]
    (db/updatedata-by-tablename "t_certificate" (common/dateformat-bf-insert cerdata "birthday" "validity" "handdate") {:c_id c_id})
    (str "true")))

(defn get-certificate-list [request]
  (let [params (:params request)
        rows (:rows params)
        page (:page params)
        name (:name params)
        credentialsnumb (:credentialsnumb params)
        isreceive (:isreceive params)
        conds (str " and isdel is null " (common/likecond "name" name) (common/likecond "credentialsnumb" credentialsnumb) (if (> (count isreceive) 0) (if (= isreceive "1") (str " and  isreceive = " isreceive) (str " and  isreceive is null " ))))
        getresults (common/fenye rows page "t_certificate" "*" conds "")]
    (resp/json {:total (:total getresults) :rows (common/dateymd-bf-list (:rows getresults) "birthday" "validity" "handdate")})))

(defn delete-certificate [request]
  (let [params (:params request)
        c_id (:c_id params)]
    (db/updatedata-by-tablename "t_certificate" {:isdel "1"} {:c_id c_id})
    (str "true")))

;;证件领用登记
(defn add-cerreceive [request]
  (let [params (:params request)
        c_id (:c_id params)
        recdata (common/dateformat-bf-insert (select-keys params (:t_certificatereceive common/selectcols))"receivedate" "returndate" )]
    (db/add-cerreceive recdata c_id)
    (str "true")))

(defn return-cerreceive [request]
  (let [params (:params request)
        cr_id (:cr_id params)
        c_id (:c_id params)
        returndate (common/dateformat-bf-insert {:returndate (:returndate params)} "returndate")
        ]
    ;(db/updatedata-by-tablename "t_certificatereceive" (common/dateformat-bf-insert {:returndate returndate} "returndate") {:cr_id cr_id})
    (db/return-cerreceive returndate cr_id c_id)
    (str "true")))

(defn delete-cerreceive [request]
  (let [params (:params request)
        cr_id (:cr_id params)]
    (db/deletedata-by-tablename "t_certificatereceive" {:cr_id cr_id})
    (str "true")))

(defn get-cerreceive-list [request]
  (let [params (:params request)
        rows (:rows params)
        page (:page params)
        name (:name params)
        credentialsnumb (:credentialsnumb params)
        isback (:isback params)
        receivecond (if (> (count isback) 0) (if (= isback "0") (str " and isreceive = 1 ") (str " and isreceive is null ")))
        conds (str receivecond (common/likecond "name" name) (common/likecond "credentialsnumb" credentialsnumb) (str " and isdel is null"))
        getsql (str "select c_id,name,gender,birthday,credentialstype,credentialsnumb,validity,isdel,handdate,manager,c_comments,isreceive,cr_id,receivedate,returndate,cr_comments from(select c.*,cr.cr_id,cr.receivedate,cr.returndate,cr.cr_comments from t_certificatereceive cr left join t_certificate c on cr.c_id = c.c_id)")
        getresults (common/fenye rows page (str "(" getsql ")") "*" conds " order by cr_id desc ")]
    (resp/json {:total (:total getresults) :rows (common/dateymd-bf-list (:rows getresults) "birthday" "validity" "handdate" "receivedate" "returndate" )})))

(defn get-cerreceive-byid [request]
  (let [params (:params request)
        c_id (:c_id params)
        rows (:rows params)
        page (:page params)
        conds (str " and c_id = " c_id)
        getresults (common/fenye rows page "t_certificatereceive" "*" conds " order by cr_id desc")]
    (resp/json {:total (:total getresults) :rows (common/dateymd-bf-list (:rows getresults) "receivedate" "returndate")})))

;;廉政档案干部添加
(defn get-newcadre-list [request]
  (let [params (:params request)
        rows (:rows params)
        page (:page params)
        name (:name params)
        conds (str " and idsel is null and (iscadre is null or iscadre = '0') " (common/likecond "name" name))
        getresults (common/fenye rows page "t_personalrecords" "*" conds " order by pr_id desc ")]
    (resp/json {:total (:total getresults) :rows (common/dateymd-bf-list (:rows getresults) "birth" "partytime" "incumbenttime")})))

(defn  add-cadre [request]
  (let [params (:params request)
        pr_id (:pr_id params)
        cadredata (common/dateformat-bf-insert (select-keys params (:t_personalrecords common/selectcols)) "birth" "partytime" "incumbenttime")
        ]
    (db/updatedata-by-tablename "t_personalrecords" (conj cadredata {:iscadre "1"}) {:pr_id pr_id})
    (str "true")))

(defn get-cadre-list [request]
  (let [params (:params request)
        rows (:rows params)
        page (:page params)
        name (:name params)
        identityid (:identityid params)
        conds (str " and isdel is null and iscadre = '1' " (common/likecond "name" name) (common/likecond "identityid" identityid) )
        getresults (common/fenye rows page "t_personalrecords" "*" conds " order by pr_id desc ")]
    (resp/json {:total (:total getresults) :rows (common/dateymd-bf-list (:rows getresults) "birth" "partytime" "incumbenttime")})))


(defn update-cadre [request]
  (let [params (:params request)
        pr_id (:pr_id params)
        cadredata (common/dateformat-bf-insert (select-keys params (:t_personalrecords common/selectcols)) "birth" "partytime" "incumbenttime")]
    (db/updatedata-by-tablename "t_personalrecords" cadredata {:pr_id pr_id})
    (str "true")))

(defn delete-cadre [request]
  (let [params (:params request)
        pr_id (:pr_id params)]
    (db/updatedata-by-tablename "t_personalrecords" {:iscadre "0"} {:pr_id pr_id})
    (str "true")))



;;奖惩情况          jc_date
(defn add-awardpunish [request]
  (let [params (:params request)
        pr_id (:pr_id params)
        mode (:mode params)
        fields1 (json/read-str  (:fields1 params) :key-fn keyword)
        apdatas (map #(conj (common/dateformat-bf-insert % "jc_date")  {:pr_id pr_id :jc_mode mode}) fields1 )]
    (println "DDDDDDDDDDDDDD" apdatas)
    ;(db/add-awardpunish apdatas)
    (str "true")))

;;附件管理
(defn uploadfile [file pc_id filetype filenamemsg fileext]
  (try
    (let[;filedata (common/uploadfile file pc_id filetype filenamemsg fileext)
         uploadpath (str schema/datapath "upload/")      ;获取当前目录
         timenow (c/to-long  (l/local-now))              ;当前时间数字
         ;        filename (str timenow (:filename file))
         filename (str timenow filenamemsg fileext)              ;文件名称
         filesie (:size file)                            ;文件大小
         filedata {:file_name filenamemsg :attach_type filetype :fie_path (str "/upload/" filetype "/" filename) :file_size filesie :file_type fileext :pc_id pc_id}
         dirpath (str uploadpath filetype)
         ]
      (common/uploadfile file  dirpath filename)
      (db/adddata-by-tablename "t_attach_files" filedata)
      (str "success"))
    (catch Exception e (str (.getMessage e )))
    ))

(defn deletefile [id filepath]
  (let [delpath (str schema/datapath filepath)]
    (common/delfile delpath)
    (db/deletedata-by-tablename "t_attach_files" {:attach_id id})
    ;(println "DDDDDDDD" delpath)
    (str "success")))

(defn get-files-list [request]
  (let [params (:params request)
        pc_id (:pr_id params)
        file_name (:file_name params)
        attach_type (:attach_type params)
        rows (:rows params)
        page (:page params)
        conds (str (common/likecond "file_name" file_name) (str " and pc_id = " pc_id) (str " and attach_type = " (if (> (count attach_type) 0) (str "'" attach_type "'") "'gbrm'")))
        getresults (common/fenye rows page "t_attach_files" "*" conds " order by attach_id desc ")]
    (resp/json {:total (:total getresults) :rows (common/dateymd-bf-list (:rows getresults) "loaddate")})))

(def filesys (str schema/datapath))
(def convert-set #{"doc" "docx" "xls" "xlsx" "txt"})
(defn getfilesysfile [filename convert remote-addr port]
  (let [fin (str filesys filename)
        ext-name (clojure.string/replace filename #".+\." "")
        to-convert (get convert-set ext-name)
        fout (str fin "-html")
        redirect-url (str "http://" remote-addr ":" port "/filesys/htmlfiles/mainview.jsp?page=" (java.net.URLEncoder/encode filename "UTF-8"))]

;    (println "filename:" filename "\n编码后：redirect-url: " redirect-url)
;    (println "rttttttttttttttt" convert)
    (if (= convert "1")
      (do
        "下载"
        (->(file-response fin)
          (response/header "Content-Disposition" (str "filename="
                                                   (java.net.URLEncoder/encode
                                                     (clojure.string/replace
                                                       (clojure.string/trim (last (str/split filename #"/" )))
                                                       #"\."
                                                       (str "_"(.format (java.text.SimpleDateFormat. "yyyy-MM-dd"
                                                                          java.util.Locale/SIMPLIFIED_CHINESE)
                                                                 (java.util.Date.)
                                                                 ) ".")
                                                       ) "UTF-8")
                                                   ))
          (response/content-type (str "application/" ext-name)))
        )
      (do
        "预览"
        (if (nil? to-convert)
          (do
            ;        (println "图片:" fin)
            "图片返回"
            (file-response fin)
            )
          (do
            "文件处理"
            (println "*****************************:" fin)
            (println "*****************************:" fout)
            (println "*****************************:" (= convert "1"))
            )
          )
        )
      )
    )
  )



(defn test-get-tablecols [tablename]
  (let[tcsql (str "select column_name from user_tab_columns where table_name = '" (.toUpperCase tablename) "'")
       cols (db/get-results-bysql tcsql)
       ;colskey (flatten (map #(keys %)cols))
       colskey (map #(keyword (first (vals % )) )cols) ]
    (println colskey)
    (resp/json {:success colskey})))

(defn test-dfs []
  (resp/json (db/test-in )) )

