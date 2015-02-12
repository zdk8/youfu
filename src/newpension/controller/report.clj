(ns newpension.controller.report
  (:use compojure.core)
  (:require [newpension.models.gen :as gen]
            [ring.util.response :as response]
            [clj-pdf.core :refer [pdf template]]
            [clj-excel.core :as myexcel]
            [newpension.controller.audit :as audit]
            [newpension.controller.zhfont :as zhfont]
            [noir.response :as resp]
            )
  (:import [newpension.javaxls XlsReport]
           [newpension.javaxls ReportXlsByMoths]
           [newpension.javaxls ReportXlsSummary]
           [newpension.javaxls ReportXlsAuto]
           [org.apache.poi.ss.usermodel Workbook]
           [org.apache.poi.hssf.usermodel.*]
           )

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
          datas (if (= implfunc "fwpg") (audit/setexcel-auditdata request)  ;服务评估
                    (= implfunc "sjk")                                      ;数据库
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



