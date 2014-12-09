(ns newpension.controller.report
  (:use compojure.core)
  (:require [newpension.models.gen :as gen]
            [ring.util.response :as response]
            [clj-pdf.core :refer [pdf template]]
            [clj-excel.core :as myexcel]
            [newpension.controller.zhfont :as zhfont]
            )
  (:import [newpension.java Test XlsReport])

  )



(defn my-java-test []
  (Test/getTest))

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
(defn xls-report-clj [out]
  (-> (myexcel/build-workbook (myexcel/workbook-hssf) {"Numbers"
                                                       [(vec '(1 2 3 4))
                                                        (vec (range 10))
                                                        (vec (range 10 100 5))
                                                        ]
                                                       })
    (myexcel/save out)))


;;


(defn write-response [report-bytes ext-name]
  (with-open [in (java.io.ByteArrayInputStream. report-bytes)]
    (-> (response/response in)

      (response/header "Content-Disposition" (str "filename=document." ext-name))
      (response/header "Content-Length" (count report-bytes))
      (response/content-type (str "application/" ext-name))) ))




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
      (write-response (.toByteArray out) "xls"))

    (catch Exception ex
      {:status 500
       :headers {"Content-Type" "text/html"}
       :body (.getMessage ex)})))

