(ns shuangyong.controller.controller
  (:use compojure.core)
  (:require
    [shuangyong.models.db :as db]
    [shuangyong.common.common :as common]
    [shuangyong.models.schema :as schema]
    [noir.response :as resp]
    [clojure.data.json :as json]
    [clojure.string :as cstr]
    [clj-time.local :as l]
    [clj-time.coerce :as c]
    [ring.util.response :as response :refer [file-response]]
    [clojure.string :as str]
    ))

(defn approve-reportdata [params sc_id]
  (let [bstablepk sc_id
        bstablename "t_soldiercommon"
        status "1"
        aulevel "1"
        auflag "数据提交"
        auuser (:community params)
        audesc (:communityopinion params)
        appoperators (:community params)
        messagebrief (str "姓名：" (:name params) ",身份证："(:identityid params) )
        bstablepkname "sc_id"]
    {:bstablepk bstablepk :bstablename bstablename :status status :aulevel aulevel :auflag auflag :auuser auuser :audesc audesc :appoperators appoperators :messagebrief messagebrief :bstablepkname bstablepkname}))


(defn save-soilder [request]
  (let [params (:params request)
        sdata (conj (select-keys params (:t_soldiercommon common/selectcols)) {:ishandle "0"})]
    (db/adddata-by-tablename "t_soldiercommon" (common/dateformat-bf-insert sdata "birthday" "joindate" "retiredate" "awardyear" "opiniondate" "reviewdate" "auditdate" "enterdate"))
    (str "true")))

(defn update-soilder [request]
  (let [params (:params request)
        sdata (common/dateformat-bf-insert (select-keys params (:t_soldiercommon common/selectcols)) "birthday" "joindate" "retiredate" "awardyear" "opiniondate" "reviewdate" "auditdate" "enterdate")
        sc_id (:sc_id params)]
    (db/updatedata-by-tablename "t_soldiercommon" sdata sc_id)
    (str "true")))

(defn report-soilder [request]
  (let [params (:params request)
        sc_id (:sc_id params)
        approvedata (approve-reportdata params sc_id)
        sdata (conj (select-keys params (:t_soldiercommon common/selectcols)) {:ishandle "1"})
        ]
    (if (> (count sc_id) 0) (db/report-soilder approvedata sc_id (common/dateformat-bf-insert sdata "birthday" "joindate" "retiredate" "awardyear" "opiniondate" "reviewdate" "auditdate" "enterdate"))
                             (db/report-soilder approvedata (common/dateformat-bf-insert sdata "birthday" "joindate" "retiredate" "awardyear" "opiniondate" "reviewdate" "auditdate" "enterdate")))
    (str "true")))




(defn audit-soilder [request]
  (let [params          (:params request)
        ishandle        (:ishandle params)
        issuccess       (:issuccess params)
        sc_id           (:sc_id params)
        sdata           (common/dateformat-bf-insert (select-keys params [:streeter :streetreview :reviewdate :county :countyaudit :auditdate]) "reviewdate" "auditdate")                                    ;(common/dateformat-bf-insert (select-keys params (:t_soldiercommon common/selectcols)) "birthday" "joindate" "retiredate" "awardyear" "opiniondate" "reviewdate" "auditdate" "enterdate")
        streeter        (:streeter params)
        streetreview    (:streetreview params)
        county          (:county params)
        countyaudit     (:countyaudit params)
        name            (:name params)
        identityid      (:identityid params)
        approvedata {:bstablepk sc_id :bstablename "t_soldiercommon" :bstablepkname "sc_id"  :messagebrief (str "姓名：" name ",身份证："identityid )}
        ]
    (if (= issuccess "1") (if (> (count ishandle) 0) (if (= ishandle "1") (db/audit-soilder sc_id (conj approvedata {:aulevel "2" :status "1" :auflag "街道审核通过" :auuser  streeter :audesc streetreview :appoperators streeter} ) (conj sdata {:ishandle "2"}) )
                                                                           (db/audit-soilder sc_id (conj approvedata {:aulevel "3" :status "1" :auflag "民政局审批通过" :auuser  county :audesc countyaudit :appoperators county} )(conj sdata {:ishandle "3"})))
                                                     (resp/json {:success "false"}))
                          (if (> (count ishandle) 0) (if (= ishandle "1") (db/audit-soilder sc_id (conj approvedata {:aulevel "-1" :status "0" :auflag "街道审核不通过" :auuser  streeter :audesc streetreview :appoperators streeter} ) (conj sdata {:ishandle "-1"}) )
                                                                           (db/audit-soilder sc_id (conj approvedata {:aulevel "-1" :status "0" :auflag "民政局审批不通过" :auuser  county :audesc countyaudit :appoperators county} )(conj sdata {:ishandle "-1"})))
                                                     (resp/json {:success "false"})))
    (str "true")))




(defn get-soilder-list [request]
  (let [params (:params request)
        rows (:rows params)
        page (:page params)
        name (:name params)
        identityid (:identityid params)
        conds (str " and (ishandle != 'n' or ishandle is null )" (common/likecond "name" name) (common/likecond "identityid" identityid))
        getresults (common/fenye rows page "t_soldiercommon" "*" conds " order by sc_id desc ")]
    (resp/json {:total (:total getresults) :rows (common/dateymd-bf-list (:rows getresults) "birthday" "joindate" "retiredate" "awardyear" "opiniondate" "reviewdate" "auditdate" "enterdate")})))


 (defn delete-soilder [request]
   (let [params (:params request)
         sc_id (:sc_id params)]
     (if (> (count sc_id) 0) (db/deletedata-by-tablename "t_soldiercommon" {:sc_id sc_id}))
     (str "true")))

(defn logout-soilder [request]
  (let [params (:params request)
        sc_id (:sc_id params)]
    (if (> (count sc_id) 0) (db/updatedata-by-tablename "t_soldiercommon" {:ishandle "n"} {:sc_id sc_id}))
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

