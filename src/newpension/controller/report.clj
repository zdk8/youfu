(ns newpension.controller.report
  (:use compojure.core)
  (:use clojure.java.io)
  (:require [newpension.models.gen :as gen]
            [ring.util.response :as response]
            [clj-pdf.core :refer [pdf template]]
            [clj-excel.core :as myexcel]
            [newpension.controller.audit :as audit]
            [newpension.controller.zhfont :as zhfont]
            [noir.response :as resp]
            [newpension.controller.old :as old]
            [newpension.controller.department :as depart]
            [newpension.common.common :as common]
            )
  (:import [newpension.javaxls XlsReport]
           [newpension.javaxls ReportXlsByMoths]
           [newpension.javaxls ReportXlsSummary]
           [newpension.javaxls ReportXlsAuto]
           [org.apache.poi.ss.usermodel Workbook]
           [org.apache.poi.hssf.usermodel.*]
           )
  (:import [org.apache.poi.hssf.usermodel HSSFWorkbook])

  )




(pdf
  [{:header "Wow that was easy"}
   [:list
    [:chunk {:style :bold} "a bold item"]
    "another item"
    "yet another item"]
   [:paragraph
    {:style :bold :size 10 :family :halvetica :color [0 255 221] :ttf-name zhfont/stfangso }
    "I'm a paragraph!中文222"]]
  "doc.pdf")
(pdf
  [{}
   (for [i (range 3)]
     [:paragraph (str "item: " i)])]
  "my-doc.pdf")



(def function-template

  (template [$type $functionid $location $title $parent ]))

(def function-template-paragraph
  (template
    [:paragraph
     {:ttf-name zhfont/stfangso}
     [:heading  $name]
     [:chunk {:style :bold
              :color [0 234 123]} "功能id: "] $functionid "\n"
     [:chunk {:styles [:bold :italic]} "地址: "] $location "\n"
     [:chunk {:color [0 0 0] :background [255 0 0]}   "标题: "] $title
     [:spacer]]))

;;https://github.com/yogthos/clj-pdf   手册

(defn table-report [out]
  (pdf
    [{}
     [:heading {:style {:size 10 :color [100 40 150] :align :left } :ttf-name zhfont/stfangso} "功能table"]
     [:line]
     (into [:table
            {:border true
             :cell-border true
             :header [{:color [0 150 150]} "功能id" "地址" "标题" "功能父节点id"]}]
       (function-template (gen/read-functions)))]
    out))

(defn list-report [out]
  (pdf
    [{}
     [:heading {:style {:size 10 :color [100 40 150] :align :left } :ttf-name zhfont/stfangso} "功能list"]
     [:line]
     [:spacer]
     (function-template-paragraph (gen/read-functions))]
    out))

(defn xls-report-java [out]
  (.write (XlsReport/getReport) out))
(defn a-cell-value [name]
  {:value name
   :alignment :center
;   :comment {:text "Lorem Ipsum" :width 4 :height 2}          ;提示框
   :border [:none :thin :dashed :thin]
   :foreground-color :grey-25-percent :pattern :solid-foreground
   :font {:color :red :underline :single :italic true
          :size 12 :font "Arial"}
   :rows 2
   }
  )
(defn xls-report-clj [out]
  (-> (myexcel/build-workbook (myexcel/workbook-hssf) {"资金发放表"
                                                       [
;                                                         (vec '("乡镇街道" "姓名" "身份证" "家庭住址"))
;                                                        (vec (range 10))
;                                                        (vec (range 10 100 5))
                                                         [(a-cell-value "乡镇街道") (a-cell-value "姓名")
                                                          (a-cell-value "身份证") (a-cell-value "家庭住址")
                                                          ]
                                                         [
                                                          "武原街道" "朱介民" "330424192707120013" "百可社区"
                                                          ]
                                                        ]
                                                       }
        )
    (myexcel/save out)))


;;


(defn write-response [report-bytes ext-name]
  (with-open [in (java.io.ByteArrayInputStream. report-bytes)]
    (-> (response/response in)

      (response/header "Content-Disposition" (str "filename=document." ext-name))
      (response/header "Content-Length" (count report-bytes))
      (response/content-type (str "application/" ext-name))
      )
    )
  )




(defn generate-report-pdf [report-type]
  (try
    (let [out (new java.io.ByteArrayOutputStream)]
      (condp = (keyword report-type)
        :table-pdf (table-report out)
        :list-pdf  (list-report out))
      (write-response (.toByteArray out) "pdf"))

    (catch Exception ex
      {:status 500
       :headers {"Content-Type" "text/html"}
       :body (.getMessage ex)})))

(defn generate-report-xls [report-type]
  (try
    (let [out (new java.io.ByteArrayOutputStream)]
      (condp = (keyword report-type)
        :my-test1 (xls-report-java out)
        :my-test2  (xls-report-clj out))
      (write-response (.toByteArray out) "xls")
      )

    (catch Exception ex
      {:status 500
       :headers {"Content-Type" "text/html"}
       :body (.getMessage ex)})))


;;;;;;;;;;;;;;;;;;;; 导出资金发放报表(月)
(defn xls-report-months [year months datas out]
  (.write (ReportXlsByMoths/getReport year months datas) out))
(defn xls-report-months-null [year months out]
  (.write (ReportXlsByMoths/getReportNull year months) out))
(defn xls-report-by-months [request]
  (try
    (let [reportxls (new ReportXlsByMoths)
          params (:params request)
          months (:months params)         ;月份
          year (:year params)             ;年份
          out (new java.io.ByteArrayOutputStream)
          datas (audit/get-moneyreport request)
          ]
      (if (>(count datas)0)(xls-report-months year months (into-array datas) out) (xls-report-months-null year months out))
      (write-response (.toByteArray out) "xls")
      )
    (catch Exception ex
      {:status 500
       :headers {"Content-Type" "text/html"}
       :body (.getMessage ex)}))
  )
;;汇总表
(defn xls-report-summary [year datas out]
  (.write (ReportXlsSummary/getReport year datas) out))
(defn xls-report-summary-null [year out]
  (.write (ReportXlsSummary/getReportNull year) out))
(defn xls-report-by-summary [request]
  (try
    (let [reportxls (new ReportXlsByMoths)
          params (:params request)
          year (:year params)             ;年份
          out (new java.io.ByteArrayOutputStream)
          datas (audit/get-yearmoneyreport request)
          ]
      (if (>(count datas)0)(xls-report-summary year (into-array datas) out) (xls-report-summary-null year out))
;      (xls-report-summary-null year out)
      (write-response (.toByteArray out) "xls")
      )
    (catch Exception ex
      {:status 500
       :headers {"Content-Type" "text/html"}
       :body (.getMessage ex)}))
  )
;;动态字段导出
(defn xls-reportauto [bodytxt colsfield title datas out]
  (.write (ReportXlsAuto/getReport bodytxt colsfield title datas) out))
(defn xls-reportauto-null [bodytxt title out]
  (.write (ReportXlsAuto/getReportNull bodytxt title) out))
(defn xls-report-auto [request]
  (try
    (let [params (:params request)
          colstxt (:colstxt params)
          colsfield (:colsfield params)
          title (:title params)
          implfunc (:implfunc params)
          out (new java.io.ByteArrayOutputStream)
          wb (new org.apache.poi.hssf.usermodel.HSSFWorkbook)
          datas (cond (= implfunc "fwpg") (audit/setexcel-auditdata request)  ;服务评估
                    (= implfunc "sjk")  (old/getoldpeopledata request)     ;数据库
                    (= implfunc "rzry")  (depart/oldepartreport request)     ;养老机构
            )
;          datas (audit/setexcel-auditdata request)
          ]
      (if (>(count datas)0)(xls-reportauto colstxt colsfield title (into-array datas) out) (xls-reportauto-null colstxt title out))
      (write-response (.toByteArray out) "xls")
      )
    (catch Exception ex
      {:status 500
       :headers {"Content-Type" "text/html"}
       :body (.getMessage ex)}))
  )


(defn test-myexcel [file]
  (let[data (rest(get  (myexcel/lazy-workbook (myexcel/workbook-hssf (:tempfile file))) "Sheet1"))     ;{:birthd (nth % 3)}
       ;dealdata (map #(conj {:districtid (str(nth % 0))} {:name (str(nth % 1))}{:identityid (str(nth % 2))}{:gender (if (= (nth % 4) "男") "1" (if (= (nth % 4) "女") "0" (nth % 4)))} {:age (str(nth % 5))}{:address (str(nth % 6))}) data)
      ; testdata [{:districtid "330424103" :name "test1" :identityid "330424193203052000" :gender 1 :age 18 :address "海盐县于城镇庄家村委会"}{:districtid "330424103" :name "test2" :identityid "330424193203052000" :gender 1 :age 18 :address "海盐县于城镇庄家村委会"}]
       dealdata (map #(str "insert into t_oldpeople (districtid, name, identityid,birthd, gender, age, address,datatype,operator_date) values ('" (nth % 0) "','" (nth % 1)"','"(nth % 2) "',to_date ( '" (common/format-time (nth % 3) "") "' , 'YYYY-MM-DD' )," (if (= (nth % 4) "男") "1" (if (= (nth % 4) "女") "0" (nth % 4))) "," (nth % 5) ",'" (nth % 6) "','k',to_date ( '" (common/format-time (common/get-nowtime) "") "' , 'YYYY-MM-DD' ))") data)
       ;oldsql (apply str (interpose ";\n" dealdata))

       ]
    ;(println (common/format-time (nth (first data) 3) ""))
    ;(println oldsql)
    (println dealdata)

    (old/insert-olddata dealdata)
    )

  ;(let [pathurl "D:\\test.xls"]
   ;; (resp/json (myexcel/lazy-workbook (myexcel/workbook-hssf "D:\\test.xls")))
 ;(resp/json (myexcel/lazy-workbook (new HSSFWorkbook file)))
  ;(println (input-stream file))
 ; (new HSSFWorkbook (input-stream file))
  ;(println (class (get  (myexcel/lazy-workbook (myexcel/workbook-hssf (:tempfile file))) "Sheet1")))
  ;(println (get  (myexcel/lazy-workbook (myexcel/workbook-hssf (:tempfile file))) "Sheet1"))

  ;(resp/json file)
  (str "success")
  )

(defn analyze-file [file]
  (myexcel/lazy-workbook (myexcel/workbook-hssf (:tempfile file))))

(defn set-string [ptvalues]
  (map #(str %) ptvalues))

(defn excelimport
  "数据导入（excel），数据格式要求严格，需要对整数的字符串进行处理，不然会当作整数来处理，会遇到各种导入的不完全一致的情况"
  [file]
  (let[exldata (get (myexcel/lazy-workbook (myexcel/workbook-hssf (:tempfile file))) "Sheet1")    ;{:birthd (nth % 3)}
       ;dealdata (map #(conj {:districtid (str(nth % 0))} {:name (str(nth % 1))}{:identityid (str(nth % 2))}{:gender (if (= (nth % 4) "男") "1" (if (= (nth % 4) "女") "0" (nth % 4)))} {:age (str(nth % 5))}{:address (str(nth % 6))}) data)
       ; testdata [{:districtid "330424103" :name "test1" :identityid "330424193203052000" :gender 1 :age 18 :address "海盐县于城镇庄家村委会"}{:districtid "330424103" :name "test2" :identityid "330424193203052000" :gender 1 :age 18 :address "海盐县于城镇庄家村委会"}]
       ;dealdata (map #(str "insert into t_oldpeople (districtid, name, identityid,birthd, gender, age, address,datatype,operator_date) values ('" (nth % 0) "','" (nth % 1)"','"(nth % 2) "',to_date ( '" (common/format-time (nth % 3) "") "' , 'YYYY-MM-DD' )," (if (= (nth % 4) "男") "1" (if (= (nth % 4) "女") "0" (nth % 4))) "," (nth % 5) ",'" (nth % 6) "','k',to_date ( '" (common/format-time (common/get-nowtime) "") "' , 'YYYY-MM-DD' ))") data)
       ;oldsql (apply str (interpose ";\n" dealdata))
       data (rest exldata)
       keydata (map #(keyword %) (first exldata))

       updata (map #(zipmap keydata %) data)

       ]
    ;(println (common/format-time (nth (first data) 3) ""))
    ;(println oldsql)
    ;(println  "CCCCCCCCCC" updata)
    ;(old/importdata {:name "test"})
    ;(dorun (map #(old/importdata {:name (nth % 0)  :gender (nth % 1) :birthday (nth % 2) :age (nth % 3) :address (nth % 4)  :heath (nth % 5)}) data) )
    ;(dorun (map #(old/importdata {:name (nth % 0)  :project (nth % 1)  :money (nth % 2)}) data) )

    ;(println  "KKKKKKKKKKKKKKKKKKK" keydata)
    ; (old/insert-olddata dealdata)
    (old/importdata updata)
    ;(println "UUUUUUUUUUUU" (common/timefmt-bef-insert (first updata) "BIRTHD"))
    )

  (str "success")
  )