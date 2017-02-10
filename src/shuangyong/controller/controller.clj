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

(def file-path (str "D:/projectfile/shuangyong"))
;(str schema/datapath "resources/public/upload/")
; (str "E:/projectfile/shuangyong")

(defn- touchfile-with-encode-utf8 [s]
  (java.net.URLDecoder/decode s "UTF-8")
  )

(defn approve-reportdata [params sc_id]
  (let [bstablepk sc_id
        bstablename "t_soldiercommon"
        status "1"
        aulevel "1"
        auflag "数据提交"
        auuser (touchfile-with-encode-utf8 (:community params))
        audesc (touchfile-with-encode-utf8 (:communityopinion params))
        appoperators (touchfile-with-encode-utf8 (:community params))
        messagebrief (str "姓名：" (touchfile-with-encode-utf8 (:name params))  ",身份证：" (touchfile-with-encode-utf8 (:identityid params))  )
        bstablepkname "sc_id"]
    {:bstablepk bstablepk :bstablename bstablename :status status :aulevel aulevel :auflag auflag :auuser auuser :audesc audesc :appoperators appoperators :messagebrief messagebrief :bstablepkname bstablepkname}))


(defn upload-file [file]
  (let [uploadpath file-path      ;获取当前目录
        timenow (c/to-long  (l/local-now))              ;当前时间数字
        filename (:filename file)
        pathname (str  timenow filename)
        photopath  (if (> (count filename) 0) (str "shuangyong/" pathname) )
        ]
    (if (> (count filename) 0) (common/uploadfile file  uploadpath pathname))
    photopath))

(defn formatvals
  "汉字字符编码转化"
  [valdatas]
  (into {} (map #(vector (first %) (touchfile-with-encode-utf8 (second %)))valdatas )) )

(defn save-soilder [request]
  (let [params (:params request)
        encodedata (select-keys params (:encodecols common/selectcols))
        file (:file params)
        photopath (upload-file file)
        sdata (common/filter-undefined (conj (select-keys params (:t_soldiercommon common/selectcols)) {:ishandle "0" :photo photopath} (formatvals encodedata)))]
    (db/adddata-by-tablename "t_soldiercommon" (common/dateformat-bf-insert sdata "birthday" "joindate" "retiredate" "awardyear" "opiniondate" "reviewdate" "auditdate" "enterdate"))
    (str "true")))



(defn update-soilder [request]
  (let [params (:params request)
        sdata (common/dateformat-bf-insert (select-keys params (:t_soldiercommon common/selectcols)) "birthday" "joindate" "retiredate" "awardyear" "opiniondate" "reviewdate" "auditdate" "enterdate")
        encodedata (select-keys params (:encodecols common/selectcols))
        sc_id (:sc_id params)
        photo (touchfile-with-encode-utf8 (:photo params))
        file (:file params)
        filename (:filename file)
        photopath (if (> (count filename) 0) (do (common/delfile (str schema/datapath photo))                       ;如果头像图片更新，先删除旧头像
                                                 (upload-file file))                                                 ;再更新新头像
                                             photo)
        name (:name params)
        comments (:comments params)]
    ;(println "SSSSSSSSSSS"  photopath)
    (db/updatedata-by-tablename "t_soldiercommon" (common/filter-undefined (conj sdata {:photo photopath } (formatvals encodedata)))  {:sc_id sc_id})
    (str "true")))

(defn report-soilder [request]
  (let [params (:params request)
        sc_id (:sc_id params)
        encodedata (select-keys params (:encodecols common/selectcols))
        approvedata (approve-reportdata params sc_id)
        photo (:photo params)
        file (:file params)
        filename (:filename file)
        photopath (if (> (count sc_id) 0) (if (> (count filename) 0) (do (common/delfile (str schema/datapath photo)) ;如果头像图片更新，先删除旧头像
                                                                       (upload-file file)) ;再更新新头像
                                            photo)
                    (upload-file file))
        sdata (common/filter-undefined (conj (select-keys params (:t_soldiercommon common/selectcols)) {:ishandle "1" :photo photopath} (formatvals encodedata)))
        ]
    (if (> (count sc_id) 0) (db/report-soilder approvedata sc_id (common/dateformat-bf-insert sdata "birthday" "joindate" "retiredate" "awardyear" "opiniondate" "reviewdate" "auditdate" "enterdate"))
                             (db/report-soilder approvedata (common/dateformat-bf-insert sdata "birthday" "joindate" "retiredate" "awardyear" "opiniondate" "reviewdate" "auditdate" "enterdate")))
    (str "true")))




(defn audit-soilder [request]
  (let [params          (:params request)
        ishandle        (:ishandle params)
        issuccess       (:issuccess params)
        sc_id           (:sc_id params)
        streeter        (touchfile-with-encode-utf8 (:streeter params))
        streetreview    (touchfile-with-encode-utf8 (:streetreview params))
        county          (touchfile-with-encode-utf8 (:county params))
        countyaudit     (touchfile-with-encode-utf8 (:countyaudit params))
        name            (touchfile-with-encode-utf8 (:name params))
        identityid      (touchfile-with-encode-utf8 (:identityid params))
        sdata           (conj (common/dateformat-bf-insert  (select-keys params [:reviewdate :auditdate]) "reviewdate" "auditdate") {:streeter streeter :streetreview streetreview :county county :countyaudit countyaudit})
        approvedata {:bstablepk sc_id :bstablename "t_soldiercommon" :bstablepkname "sc_id"  :messagebrief (str "姓名：" name ",身份证："identityid )}
        ]
    ;(println "PPPPPPPPPPPPPPPPPPPPP" params)
    ;(println "SSSSSSSSSSSSSSSSSSSSSSS"  approvedata)
    (if (= issuccess "1") (if (> (count ishandle) 0) (if (= ishandle "1") (db/audit-soilder sc_id (conj approvedata {:aulevel "2" :status "1" :auflag "街道审核通过" :auuser  streeter :audesc streetreview :appoperators streeter} ) (conj sdata {:ishandle "2"}) )
                                                                           (db/audit-soilder sc_id (conj approvedata {:aulevel "3" :status "1" :auflag "民政局审批通过" :auuser  county :audesc countyaudit :appoperators county} )(conj sdata {:ishandle "3"})))
                                                     (resp/json {:success "false"}))
                          (if (> (count ishandle) 0) (if (= ishandle "1") (db/audit-soilder sc_id (conj approvedata {:aulevel "-1" :status "0" :auflag "街道审核不通过" :auuser  streeter :audesc streetreview :appoperators streeter} ) (conj sdata {:ishandle "-1"}) )
                                                                           (db/audit-soilder sc_id (conj approvedata {:aulevel "-1" :status "0" :auflag "民政局审批不通过" :auuser  county :audesc countyaudit :appoperators county} )(conj sdata {:ishandle "-1"})))
                                                     (resp/json {:success "false"})))
    (str "true")))


(defn soilderconds [params]
  (let [name            (:name params)
        identityid      (:identityid params)
        districtid      (:districtid params)
        eachtype        (:eachtype params)
        ishandle        (:ishandle params)
        caretype        (:caretype params)
        isdead          (:isdead params)
        photo           (:photo params)
        joindate        (:joindate params)
        retiredate      (:retiredate params)
        birthday1       (:birthday1  params)
        birthday2       (:birthday2  params)
        household       (:household params)
        train           (:train params)
        employment      (:employment params)
        stype           (:stype params)
        persontype      (:p_type params)
        minage          (:minage params)
        maxage          (:maxage params)
        sixtydeal       (:sixtydeal params)
        userdistrictid  (:regionid  (common/get-session))
        namecond        (if (> (count name) 0) (common/likecond "name" name))
        identityidcond  (if (> (count identityid) 0) (common/likecond "identityid" identityid))
        districtcond    (if (> (count districtid) 0) (str " and districtid like '" districtid "%'"))
        eachtypecond    (if (> (count eachtype) 0) (str " and eachtype = " eachtype))
        ishandlecond    (if (> (count ishandle) 0) (str " and ishandle = '" ishandle "'" ) (str " and (ishandle != 'n' or ishandle is null )"))
        caretypecond    (if (> (count caretype) 0) (str " and caretype = " caretype))
        isdeadcond      (if (> (count isdead) 0) (if (= isdead "1") (str " and identityid in (select identityid from t_leavepeople )") (str " and identityid not in (select identityid from t_leavepeople )")))
        photocond       (if (> (count photo) 0) (if (not= photo "0") (if (= photo "1") (str " and photo is null " ) (str " and photo is not null " ))))
        joindatecond    (if (> (count joindate) 0) (str " and to_char(joindate,'yyyy') = '"joindate"' "))   ;to_char(birthday,'yyyy') = '2015'
        retiredatecond  (if (> (count retiredate) 0) (str " and to_char(retiredate,'yyyy') = '"retiredate"' "))
        birthday1cond   (if (> (count birthday1) 0) (str " and birthday > to_date('"birthday1"','yyyy-mm-dd') "))
        birthday2cond   (if (> (count birthday1) 0) (str " and birthday < to_date('"birthday2"','yyyy-mm-dd') "))
        housecond       (if (> (count household)0) (str (common/likecond "household" household)))
        traincond       (if (> (count train) 0) (str " and train = " train))
        employcond      (if (> (count employment) 0) (str " and employment = " employment))
        typecond        (if (= stype "2") (str " and persontype like '2%' ") (str " and persontype like '1%' "))
        persontypecond  (if (> (count persontype) 0) (str " and persontype = " persontype))
        minagecond      (if (> (count minage) 0) (str " and age > " minage))
        maxagecond      (if (> (count maxage) 0) (str " and age < " maxage))
        sixtycond       (if (= sixtydeal "1") (str " and sixtydeal = '1'") (str " and (sixtydeal != '1' or sixtydeal is null)"))
        userdiscond     (if userdistrictid (str " and districtid like '" userdistrictid "%'"))
        conds           (str namecond identityidcond districtcond eachtypecond ishandlecond caretypecond isdeadcond photocond joindatecond retiredatecond birthday1cond birthday2cond housecond typecond persontypecond traincond employcond minagecond maxagecond sixtycond userdiscond)]
;    (println "SSSSSS" userdistrictid)
    conds))

(def soilder-sql
  "(select t.*,
trunc((to_char(sysdate,'yyyyMMdd')-to_char(case when length(t.identityid)=18 then substr(t.identityid,7,8) when  length(t.identityid)=15 then '19'||substr(t.identityid,7,6) end))/10000) as age
from t_soldiercommon t)")

(defn get-soilder-list
  "查询军人信息列表"
  [request]
  (let [params      (:params request)
        rows        (:rows params)
        page        (:page params)
        conds       (soilderconds params)
        getresults  (common/fenye rows page soilder-sql "*" conds " order by sc_id desc ")]     ;"t_soldiercommon"
    (println "CCCCCCCC" conds)
    (resp/json {:total (:total getresults) :rows (common/dateymd-bf-list (:rows getresults) "birthday" "joindate" "retiredate" "awardyear" "opiniondate" "reviewdate" "auditdate" "enterdate")})))

(defn get-soilder-excel [params]
  (let [conds (soilderconds params)
        result-sql  (str "select t.*,s.aaa103 as sex1,h.aaa103 as hktype1,d.totalname from (select * from " soilder-sql " where 1=1 " conds " order by sc_id desc) t
    left join (select * from xt_combodt where aaa100 = 'sex') s on t.sex = s.aaa102
    left join (select * from xt_combodt where aaa100 = 'hktype') h on t.hktype = h.aaa102
    left join division d on d.dvcode = t.districtid")]
    (println "SSSSSSSSSSSS"  result-sql)
    (common/dateymd-bf-list
      (db/get-results-bysql  result-sql) "retiredate" "joindate") )
  )


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

;;统计分析
(defn comboasql [col value conds]
  (str "select t.sum,t.ptype,NVL(c.aaa103,'未知') as statictype from(select count(*) as sum,"col" as ptype from t_soldiercommon where "conds" and ishandle = '3' group by "col") t left join (select aaa102,aaa103 from xt_combodt where aaa100 = '"value"') c on t.ptype = c.aaa102"))

(defn districtsql [conds]
  (str "select s.districtid as ptype,s.sum,NVL(d.dvname,'未知') as statictype from (select districtid,count(*) as sum from (select substr(districtid,0,9) as districtid  from t_soldiercommon t where  "conds" and ishandle = '3') group by districtid) s left join division d on d.dvcode = s.districtid"))


(defn hyshy-analysis
  "双拥数据统计分析"
  [request]
  (let [params (:params request)
        stype (:stype params)
        tjtype (:tjtype params)
        conds (if (= stype "2") (str " persontype like '2%' ") (str " persontype like '1%' "))
        analysql (condp = tjtype
                   "xzqh"  (districtsql conds)
                   "xb" (comboasql "sex" "sex" conds)
                   "lb" (comboasql "eachtype" "eachtype" conds)
                   "px" (comboasql "train" "train" conds)
                   "jy" (comboasql "employment" "employment" conds)
                   (str "select 'csh' as ptype,'总数' as statictype, count(*) as sum from t_soldiercommon where " conds " and ishandle = '3'"))]
    ;(println "SSSSSSSSSS" analysql)
    (resp/json (db/get-results-bysql analysql))))

(defn retire-soilder
  "现役军人退伍"
  [request]
  (let [params (:params request)
        sc_id  (:sc_id params)
        ]
    (if (> (count sc_id) 0) (db/updatedata-by-tablename "t_soldiercommon" {:persontype "230"} {:sc_id sc_id}) (resp/json {:success false :message "数据异常"}))
    (str "true")))

(defn get-office-numb [request]
  (let   [userdistrictid  (:regionid  (common/get-session))]
    (resp/json (db/get-results-bysql (str "select s1.xybcsum,s2.xyshsum,s3.xyspsum,s4.xyqssum,s5.tybcsum,s6.tyshsum,s7.tyspsum,s8.tyqssum from
  (select count(*) as xybcsum from t_soldiercommon t where t.persontype like '1%' and t.ishandle = '0' and districtid like '" userdistrictid "%'  and (sixtydeal != '1' or sixtydeal is null)) s1,
  (select count(*) as xyshsum from t_soldiercommon t where t.persontype like '1%' and t.ishandle = '1' and districtid like '" userdistrictid "%'  and (sixtydeal != '1' or sixtydeal is null)) s2,
  (select count(*) as xyspsum from t_soldiercommon t where t.persontype like '1%' and t.ishandle = '2' and districtid like '" userdistrictid "%'  and (sixtydeal != '1' or sixtydeal is null)) s3,
  (select count(*) as xyqssum from t_soldiercommon t where t.persontype like '1%' and t.ishandle = '3' and districtid like '" userdistrictid "%'  and (sixtydeal != '1' or sixtydeal is null) and t.identityid in (select identityid from t_leavepeople )) s4,
  (select count(*) as tybcsum from t_soldiercommon t where t.persontype like '2%' and t.ishandle = '0' and districtid like '" userdistrictid "%'  and (sixtydeal != '1' or sixtydeal is null)) s5,
  (select count(*) as tyshsum from t_soldiercommon t where t.persontype like '2%' and t.ishandle = '1' and districtid like '" userdistrictid "%'  and (sixtydeal != '1' or sixtydeal is null)) s6,
  (select count(*) as tyspsum from t_soldiercommon t where t.persontype like '2%' and t.ishandle = '2' and districtid like '" userdistrictid "%'  and (sixtydeal != '1' or sixtydeal is null)) s7,
  (select count(*) as tyqssum from t_soldiercommon t where t.persontype like '2%' and t.ishandle = '3' and districtid like '" userdistrictid "%'  and (sixtydeal != '1' or sixtydeal is null) and t.identityid in (select identityid from t_leavepeople )) s8")))))


(defn dealsixty [request]
  (let [params      (:params request)
        sc_id       (:sc_id params)
        sixtyopnion (:sixtyopnion params)
        issuccess   (:issuccess params)
        sixtydeal    (condp = issuccess
                       "0" "1"
                       "1" "2"
                       "")
        ]
;    (println "SSSSSSSSSS " sc_id)
    (db/updatedata-by-tablename "t_soldiercommon" {:sixtyopnion sixtyopnion :sixtydeal sixtydeal} {:sc_id sc_id})
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
;            (println "*****************************:" fin)
;            (println "*****************************:" fout)
;            (println "*****************************:" (= convert "1"))
            )
          )
        )
      )
    )
  )

(defn import-data-of-excel [updata sctype sixtydeal]
  (db/import-data-of-excel updata sctype sixtydeal)
  (str "success"))

(defn test-get-tablecols [tablename]
  (let[tcsql (str "select column_name from user_tab_columns where table_name = '" (.toUpperCase tablename) "'")
       cols (db/get-results-bysql tcsql)
       ;colskey (flatten (map #(keys %)cols))
       colskey (map #(keyword (first (vals % )) )cols) ]
    ;(println colskey)
    (resp/json {:success colskey})))

(defn test-dfs []
  (resp/json (db/test-in )) )

