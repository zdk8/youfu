(ns shuangyong.common.common
  (:use compojure.core)
  (:import  (java.text SimpleDateFormat)
            (java.text DateFormat)
            (java.sql Timestamp))
  (:require  [noir.response :as resp]
    ;[shuangyong.layout :as layout]
    ;[shuangyong.models.schema :as schema]
                [clj-time.local :as l]
                [clj-time.coerce :as c]
                [me.raynes.fs :as fs]
                [noir.io :as io]
                [shuangyong.models.db :as db]
                [noir.session :as session]
               ))


(def selectcols {
                 ;;双拥人员信息表
                 :t_soldiercommon [:districtid :identityid :name :sex :birthday :nation :marriage :joindate :retiredate :hktype :comments :isreceive :awardlevel :idaddress :phone :household :caretype :insured :pension :persontype :eachtype :armyname :specialty :retirenumber :disdegree :disaproperty :disgroup :workunit :disituation :laborability:lifeability :employment :grantstatus :stopmonth :stopdate :bankaccount :holder:deadrelation :armycode :awardyear :lifestatus :healthstatus :certificateid :community :opiniondate :communityopinion :streeter :reviewdate :streetreview :county :auditdate :countyaudit :preparer :filenumber :enterdate :ishandle :deadcertificate :honor :familyname :familyphone :familyaddress :familyunit :armyphone :train :trainarea :medicalinsurance]
                 ;;审核表
                 :approve [:bstablepk :bstablename :status :aulevel :auflag :bstime :auuser :audesc :dvcode :appoperators :messagebrief :bstablepkname]
                 })



(defn uploadfile
  "文件上传"
  [file  dirpath filename]
  (let [havedir (fs/exists? dirpath)
        ;        uploadpath (str schema/datapath "upload/")
        ;        timenow (c/to-long  (l/local-now))
        ;;       filename (str timenow (:filename file))
        ;        filename (str filenamemsg fileext)
        ;        filesie (:size file)
        ;        filedata {:file_anme filenamemsg :attach_type filetype :fie_path (str "/upload/" filetype "/" filename) :file_size filesie :file_type fileext :pc_id pc_id}
        ]
    (if havedir "" (fs/mkdirs dirpath))     ;如果文件不存在，建立此文件
    (println "DDDDDDDDD" dirpath)
    (io/upload-file dirpath  (conj file {:filename filename}))))  ;文件上传




(defn delfile
  "删除文件"
  [delpath]
  (let [isfile (fs/file? delpath)]
    (if isfile (fs/delete delpath))   ;文件存在删除文件
    (println "FFFFFFFFFF"  isfile)))

;;session
(defn get-session []
  (first(session/get :usermsg)))


;时间格式化
(defn time-formatymd-before-insert [filter-fields timekey]     "time format before insert"
  (conj filter-fields {timekey (if  (or  (= (timekey  filter-fields) "") (nil? (timekey  filter-fields)))
                                 nil
                                 (Timestamp/valueOf  (timekey  filter-fields)))}{}))

(defn  time-before-insert [results timekey]    "before insert"
  (let [sdf (new SimpleDateFormat "yyyy-MM-dd")]
    ;(println  results  "   TMTMTMTMTTMTTTTMTTTTT  "  timekey)
    (if (or  (= (timekey  results) "") (nil? (timekey  results)))
      (dissoc results timekey)
      (conj results {timekey  (new Timestamp (.getTime (.parse sdf (timekey results))))}{})
      )))

(defn timefmt-bef-insert [filter-fields timefield]                "插入数据前时间类型格式化"
  (let [timekey (keyword timefield)]
      (if (<(count (get filter-fields timekey)) 11)
        (time-before-insert filter-fields timekey)
        (time-formatymd-before-insert filter-fields timekey))))


(defn time-formatymd-before-list [results timefield]       "time format before list"
  (let [sdf (new SimpleDateFormat "yyyy-MM-dd HH:mm:ss")
        timekey (keyword timefield)]
    (map #(conj % {timekey (if (timekey  %) (.format sdf (timekey  %)))}{}) results)))

(defn time-before-list [results timefield]        "before list"
  (let [sdf   (new SimpleDateFormat "yyyy-MM-dd")
        timekey (keyword timefield)]
    (map #(conj % {timekey (if (timekey  %) (.format sdf (timekey  %)))}{}) results)))

;(defn timefmt-bef-list2 [results timefield]            "列出数据之前时间类型格式化"
;  (let[timekey (keyword timefield)]
;      (if (<(count (get results timekey)) 11)
;        (time-before-list results timekey)
;       (time-formatymd-before-list results timekey))))

;(defn timefmt-bef-list [results timefield]            "列出数据之前时间类型格式化"
;  (let [sdf (new SimpleDateFormat "yyyy-MM-dd HH:mm:ss")
;        df   (new SimpleDateFormat "yyyy-MM-dd")
;        timekey (keyword timefield)]
;    (println "TTTTTTTTTTTTT" (map #(timekey %) results))
;    (map #(conj % {timekey (if (< (count (str (timekey  %)))8 )
;                                              (timekey  %)
;                                              (if (< (count (str (timekey  %)))11)
;                                                  (.format df (timekey  %))
;                                                  (.format sdf (timekey  %))))}{}) results)))


(defn time-single-format [orderdata timefield]                        "for single date before list"
  (let [df   (new SimpleDateFormat "yyyy-MM-dd HH:mm:ss")
        timekey (keyword timefield)]
    (if orderdata (conj orderdata {timekey (.format df (timekey  orderdata))}){})))

(defn get-nowtime []                          "获取当前系统时间"
  (new Timestamp (System/currentTimeMillis)))

(defn ywq []
  (let[nowdate (get-nowtime)
        df (new SimpleDateFormat "yyyyMM")
        tf (.format df nowdate)]
    (str tf)))

(defn get-nowyear []
  (let[nowdate (get-nowtime)
       df (new SimpleDateFormat "yyyy")
       tf (.format df nowdate)]
    (str tf)))

(defn format-time [time type]
  (let[df (new SimpleDateFormat "yyyy-MM-dd")
        ldf (new SimpleDateFormat "yyyy-MM-dd HH:mm:ss")]
    (if (= type "l") (.format ldf time) (.format df time))))

(defn fenye [rows page tablename colnames cond  order]
  (let[r   (read-string rows)
       p  (read-string page)
       start  (inc(* r (dec p)))
       end (* r p)
      conds (if (not= (count cond) 0) (str " where 1=1 " cond))
       sql (str "select " colnames " from " tablename conds order)
       results (db/getall-results start end sql)
       totalsql  (str "select count(*) as sum  from " tablename  conds)
       total (get (first(db/get-results-bysql totalsql)) :sum)]
    ;(println "RRRRRRRRRRRRRR" totalsql)
    {:total total :rows results}))

(defn likecond [condname condvalue]
  (if  (= (count (str condvalue)) 0)
    " "
    (str " and " condname " like '%" condvalue "%' ")))


(defn dateformat-bf-insert
  "数据插入数据库前对时间进行格式化函数"
  [results & keys]
  (if (= 0 (count keys)) results
                         (recur  (timefmt-bef-insert results (first keys)) (rest keys)))
  )

(defn dateymd-bf-list
  "数据展示前对时间进行格式化处理函数"
  [results & keys]
  (if (= 0 (count keys)) results
                         (recur (time-before-list results (first keys)) (rest keys)))
  )