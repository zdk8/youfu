(ns newpension.common.common
  (:use compojure.core)
  (:import  (java.text SimpleDateFormat)
            (java.text DateFormat)
            (java.sql Timestamp))
  (:require  [noir.response :as resp]
                [newpension.layout :as layout]
                [newpension.models.schema :as schema]
                [clj-time.local :as l]
                [clj-time.coerce :as c]
                [noir.io :as io]
                [newpension.models.db :as db]
               ))


(def selectcols {:kccols [:nation :gntype :marriage :culture :emptyreason :visittime :monthincome :xq_watchtv :xq_exercise :xq_chess :xq_nohobby :xq_other :jj_childprovide :jj_retirepay :jj_remolition :jj_pension :jj_assistance :jj_deposit :jj_other :kn_eat :kn_bathe :kn_floor :kn_housework :kn_walk :kn_transit :kn_toilet :kn_bed :kn_nothing :fw_housekeeping :fw_treatment :fw_meal :fw_tend :fw_doctor :fw_dailyshop :fw_aid :fw_hotline :fw_entertainment :fw_law :fw_chat :fw_nothing :zq_barrierfree :zq_pensionagency :zq_homecare :zq_volunteers :zq_other :gender]
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
    {:total total :rows results}))

(defn likecond [condname condvalue]
  (if  (= (count (str condvalue)) 0)
    " "
    (str " and " condname " like '%" condvalue "%' ")))