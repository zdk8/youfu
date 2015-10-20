(ns partymgt.common.common
  (:use compojure.core)
  (:import  (java.text SimpleDateFormat)
            (java.text DateFormat)
            (java.sql Timestamp))
  (:require  [noir.response :as resp]
    ;[partymgt.layout :as layout]
    ;[partymgt.models.schema :as schema]
                [clj-time.local :as l]
                [clj-time.coerce :as c]
                [me.raynes.fs :as fs]
                [noir.io :as io]
                [partymgt.models.db :as db]
                [noir.session :as session]
               ))


(def selectcols {;;人事档案表
                 :t_personalrecords [:name :identityid :gender :age :native :birthplace :photo :nation :marriage :workstatus :worktime :contactway :address :education :politicalstatus :organizeunit :partytime :department :position :positiontype :personnel :employtime :employterm :technicalpost :contractsigntime :contractdeadline :probation :post :workunit :incumbent :positionlevel :incumbenttime :chargework :pb :cy :vc :wg :tu :birth]
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
                 :t_certificate [:name :gender :birthday :credentialstype :credentialsnumb :validity :handdate :manager :c_comments]
                 ;;证件管理领用登记表
                 :t_certificatereceive [:receivedate :returndate :cr_comments :c_id]

                 ;;奖惩情况
                 :t_awardpunish [:pr_id :jc_mode :jc_date :jc_name :jc_reason :jc_office :jc_docnumber :jc_comments]
                 ;;上交情况
                 :t_handgift [:pr_id :sj_money :sj_gift :sj_number :sj_value :sj_department :sj_comments :sj_date]

                 ;;住房情况
                 :t_housestatus [:pr_id :wifename :wifedepartment :wifeposition :zf_other]
                 ;;住房情况-居住房情况
                 :t_residenthouse [:zf_id :xy_address :xy_area :xy_property :xy_source :xy_owner]
                 ;;住房情况-售房情况
                 :t_sellhouse [:zf_id :sf_address :sf_area :sf_property :sf_selltime :sf_money]
                 ;;住房情况-出租房情况
                 :t_rentalhouse [:zf_id :cz_address :cz_area :cz_property :cz_deadline :cz_annualrent]
                 ;;住房情况-集资建房情况
                 :t_financehouse [:zf_id :jz_address :jz_area :jz_unit :jz_totalamount :jz_payment]

                 ;;持股情况
                 :t_profitstatus [:pr_id :otherincome]
                 ;;持股情况-经商办企业情况
                 :t_cadrebusiness [:yl_id :qy_name :qy_businessscope :qy_registercapital :qy_address :qy_legalperson :qy_contact]
                 ;;持股情况-兼职情况
                 :t_cadreparttime [:yl_id :jz_departname :jz_property :jz_position :jz_docnumber :jz_yearreward]
                 ;;持股情况-投资入股情况
                 :t_cadreinvest[:yl_id :rg_departname :rg_property :rg_way :rg_money :rg_yearincome]

                 ;;干部婚姻变化情况
                 :t_marriagetransition [:pr_id :hy_formerwife :hy_formerregister :hy_divorcedate :hy_wife :hy_politicalstatus :hy_register :hy_department :hy_position :hy_other :hy_formeridentityid :hy_formerdepart :hy_formerpolitical :hy_formernative :hy_formernation :hy_identityid :hy_native :hy_nation]

                 ;;出国情况
                 :t_goabroad [:pr_id]
                 ;;出国情况-持证情况
                 :t_overseavisa [:cg_id :zj_name :zj_number :zj_issuedepart :zj_effectdate :zj_invaliddate]
                 ;;出国情况-出国活动情况
                 :t_abroadactivitie [:cg_id :hd_name :hd_rounddate :hd_roundaddress :hd_reason :hd_channel :hd_fundsource]
                 ;;出国情况-留学情况
                 :t_abroadstudy [:cg_id :lx_name :lx_appellation :lx_time :lx_place :lx_yeartuition :lx_fundsource]
                 ;;出国情况-通婚情况
                 :t_abroadmarriage [:cg_id :th_name :th_department :th_position :th_spouse :th_nationality :th_registertime]
                 ;;出国情况-定居情况
                 :t_aboardsettle [:cg_id :dj_name :dj_appellation :dj_time :dj_place :dj_work]

                 ;;亲属处分情况
                 :t_relativespunish [:pr_id :cf_name :cf_relation :cf_position :cf_punishtype :cf_comments]
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