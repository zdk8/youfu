(ns newpension.controller.report
  (:use compojure.core)
  (:require [newpension.models.gen :as gen]
            [ring.util.response :as response]
            [clj-pdf.core :refer [pdf template]]
            [clj-excel.core :as myexcel]
            )
  (:import [newpension.java XlsReport])

  )



#_(defn my-java-test []
  (Test/getTest))


(pdf
  [{:header "Wow that was easy"}
   [:list
    [:chunk {:style :bold} "a bold item"]
    "another item"
    "yet another item"]
   [:paragraph "I'm a paragraph!"]]
  "doc.pdf")
;;生成pdf
(pdf
  [{}
   (for [i (range 3)]
     [:paragraph (str "item: " i)])]
  "my-doc.pdf")



(def function-template
  (template [$functionid $location $title $parent]))

(def function-template-paragraph
  (template
    [:paragraph
     [:heading  $name]
     [:chunk {:style :bold
              :size 18
              :family :helvetica
              :color [0 234 123]} "occupation: "] $functionid "\n"
     [:chunk {:styles [:bold :italic]} "place: "] $location "\n"
     [:chunk {:color [0 0 0] :background [255 0 0]}   "country: "] $parent
     [:spacer]]))

;;https://github.com/yogthos/clj-pdf   手册
;如何支持中文
(defn table-report [out]
  (pdf
    [{:header "function List"}
     (into [:table
            {:border false
             :cell-border false
             :header [{:color [0 150 150]} "functionid" "location" "tttt" "parent"]}]
       (function-template (gen/read-functions)))]
    out))

(defn list-report [out]
  (pdf
    [{}
     [:heading {:style {:size 10 :color [100 40 150] :align :left }} "Chinese中"]
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

