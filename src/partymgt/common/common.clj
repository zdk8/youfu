(ns partymgt.common.common
  (:use compojure.core)
  (:import  (java.text SimpleDateFormat)
            (java.text DateFormat)
            (java.sql Timestamp))
  (:require  [noir.response :as resp]
                [partymgt.layout :as layout]
                [partymgt.models.schema :as schema]
                [clj-time.local :as l]
                [clj-time.coerce :as c]
                [noir.io :as io]
                [partymgt.models.db :as db]
               ))


(def selectcols {;;人事档案表
                 :t_personalrecords [:name :identityid :gender :age :native :birthplace :photo :nation :marriage :workstatus :worktime :contactway :address :education :politicalstatus :organizeunit :partytime :department :position :positiontype :personnel :employtime :employterm :technicalpost :contractsigntime :contractdeadline :probation :post :workunit :incumbent :positionlevel :incumbenttime :chargework :pb :cy :vc :wg :tu]
                 ;;学位学历表
                 :t_educationway [:educationtype :college :profession]
                 ;;家庭成员表
                 :t_familymember [:appellation :fm_name :fm_identityid :fm_politicalstatus :fm_workunit :fm_position :fm_contactway]
                 ;;党支部表
                 :t_partybranch [:pb_name :pb_createtime]
                 ;;共青团表
                 :t_communistyouthleague [:cy_name :cy_createtime]
                 ;;工会表
                 :t_tradeunion [:tu_name :tu_createtime]
                 ;;老干部表
                 :t_veterancadre [:vc_name :vc_createtime]
                 ;;妇女小组表
                 :t_womengroup [:wg_name :wg_createtime]
                 ;;证件管理备案表
                 :t_certificate [:name :gender :birthday :credentialstype :credentialsnumb :validity :handdate :manager :comments]
                 ;;证件管理领用登记表
                 :t_certificatereceive [:receivedate :returndate :comments]
                 })



(defn uploadfile [file]
  (let [uploadpath (str schema/datapath "upload/")
        timenow (c/to-long  (l/local-now))
        filename (str timenow (:filename file))
        ]
    (io/upload-file uploadpath  (conj file {:filename filename}))
   {:filename  filename :filepath  (str "/get-file/" filename)}
    ))


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