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


(defn get-approve [params sc_id]
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

(defn report-soilder [request]
  (let [params (:params request)
        sc_id (:sc_id params)
        approvedata (approve-reportdata params sc_id)
        sdata (select-keys params (:t_soldiercommon common/selectcols))
        ]
    (if (> (count sc_id) 0) (db/report-soilder approvedata sc_id (common/dateformat-bf-insert sdata "birthday" "joindate" "retiredate" "awardyear" "opiniondate" "reviewdate" "auditdate" "enterdate"))
                             (db/report-soilder approvedata (common/dateformat-bf-insert sdata "birthday" "joindate" "retiredate" "awardyear" "opiniondate" "reviewdate" "auditdate" "enterdate")))
    (str "true")))

(defn add-soilder [request]
  (let [params (:params request)
        sc_id (:nextval (first(db/get-results-bysql "select seq_t_soldiercommon.nextval  from dual")))
        sdata (conj (select-keys params (:t_soldiercommon common/selectcols)) {:ishandle "1" :sc_id sc_id})
        scdata-deal (common/dateformat-bf-insert sdata "birthday" "joindate" "retiredate" "awardyear" "opiniondate" "reviewdate" "auditdate" "enterdate")
        approvedata (get-approve params sc_id)]
    (db/add-soilder scdata-deal approvedata)
    (str "true")))

(defn get-approve-list [request]
  (let [params (:params request)
        rows (:rows params)
        page (:page params)
        name (:name params)
        identityid (:identityid params)
        conds (str " and bstablename = 't_soldiercommon' and status = '1' " " and messagebrief LIKE '姓名%"name"%身份证%"identityid"%'")
        getresult (common/fenye rows page "approve" "*" conds " order by sh_id desc ")]
    (resp/json {:total (:total getresult) :rows (common/dateymd-bf-list (:rows getresult) "bstime")})))

(defn assessaudit1
  "街镇审查"
  [params]
  (let[issuccess (:issuccess params)
       approvedata (select-keys params (:approve common/selectcols))
       streetreview (:streetreview params)
       reviewdate (common/get-nowtime)
       sc_id (:bstablepk params)
       sh_id   (:sh_id params)
       newaulevel (if (= issuccess "0") "0" "2")
       auflag (if (= issuccess "0") "街镇审查未通过" "街镇审查通过")
       status  (if (= issuccess "0") "0" "1")
       auuser (:streeter params)
       scdata     (if (= issuccess "0") {:streeter auuser :reviewdate reviewdate :streetreview streetreview :ishandle "r"}
                                        {:streeter auuser :reviewdate reviewdate :streetreview streetreview })
       newappdata (conj approvedata {:aulevel newaulevel :auflag auflag :status status :bstime reviewdate :auuser auuser :audesc streetreview})]
   (db/deal-approve sh_id sc_id scdata newappdata)
   (str "街镇审查")))

(defn assessaudit2
  "县民政局审核"
  [params]
  (let[issuccess (:issuccess params)
       approvedata (select-keys params (:approve common/selectcols))
       countyaudit (:countyaudit params)
       audittime (common/get-nowtime)
       sc_id (:bstablepk params)
       sh_id   (:sh_id params)
       newaulevel (if (= issuccess "0") "r" "3")
       auflag (if (= issuccess "0") "县民政局审核未通过" "县民政局审核通过")
       auuser (:county params)
       scdata (if (= issuccess "0") {:county auuser :countyaudit countyaudit :auditdate audittime :ishandle "r"}
                                    {:county auuser :countyaudit countyaudit :auditdate audittime :ishandle "y"})
       newappdata (conj approvedata {:aulevel newaulevel :status "0" :auflag auflag :bstime audittime :auuser auuser :audesc countyaudit})]
    (db/deal-approve sh_id sc_id scdata newappdata)
    (str "县民政局审核")))


(defn deal-approve [request]
  (let [params (:params request)
        aulevel (:aulevel params)]
    (cond
      (= aulevel "1")        (assessaudit1 params)
      (= aulevel "2")        (assessaudit2 params)
      )))

(defn get-soilder-list [request]
  (let [params (:params request)
        rows (:rows params)
        page (:page params)
        name (:name params)
        identityid (:identityid params)
        conds (str " and ishandle = 'y' " (common/likecond "name" name) (common/likecond "identityid" identityid))
        getresults (common/fenye rows page "t_soldiercommon" "*" conds " order by sc_id desc ")]
    (resp/json {:total (:total getresults) :rows (common/dateymd-bf-list (:rows getresults) "birthday" "joindate" "retiredate" "awardyear" "opiniondate" "reviewdate" "auditdate" "enterdate")})))








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

