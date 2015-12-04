(ns shuangyong.controller.report
  (:use compojure.core)
  (:use clojure.java.io)
  (:require                                                 ;[shuangyong.models.gen :as gen]
            [ring.util.response :as response]
    ;[clj-pdf.core :refer [pdf template]]
            [clj-excel.core :as myexcel]

    ;       [noir.response :as resp]
    ;        [shuangyong.common.common :as common]
            [shuangyong.controller.controller :as ctl]
            )

  )

(defn a-cell-value [name]                                         ;:format :alignment :border :font :background-color :foreground-color :pattern
  {:value name                                                    ;值
   :alignment :center                                             ;对齐方式
   ;   :comment {:text "Lorem Ipsum" :width 4 :height 2}          ;提示框
   :border [:none :thin :dashed :thin]                            ;边框
   :foreground-color :sky-blue :pattern :solid-foreground         ;前景色
   :font {:color :black :underline :none :italic false             ;字体样式
          :size 12 :font "Arial"}
   :rows 2                                                        ;
   }
  )


(defn xls-report-clj [out getdatas]
  (println (apply conj [[(a-cell-value "乡镇街道") (a-cell-value "姓名")
                   (a-cell-value "身份证") (a-cell-value "家庭住址")
                   ]] (map #(vec (vals %))  getdatas)  ) )
  (-> (myexcel/build-workbook (myexcel/workbook-hssf) {"资金发放表"
                                                       #_[
                                                                                                                ; (vec '("乡镇街道" "姓名" "身份证" "家庭住址"))
                                                                                                                ;(vec (range 10))
                                                                                                                ;(vec (range 10 100 5))
                                                        [(a-cell-value "乡镇街道") (a-cell-value "姓名")
                                                        (a-cell-value "身份证") (a-cell-value "家庭住址")
                                                        ]
                                                        [
                                                        "武原街道" "朱介民" "330424192707120013" "百可社区"
                                                        ]

                                                        ]
                                                       (apply conj [[(a-cell-value "乡镇街道") (a-cell-value "姓名")
                                                                     (a-cell-value "身份证") (a-cell-value "家庭住址")
                                                                     ]] (map #(vec (vals %))  getdatas)  )
                                                       }
                              )
      (myexcel/save out)))

(defn write-response [report-bytes ext-name]
  (with-open [in (java.io.ByteArrayInputStream. report-bytes)]
    (-> (response/response in)

        (response/header "Content-Disposition" (str "filename=document." ext-name))
        (response/header "Content-Length" (count report-bytes))
        (response/content-type (str "application/" ext-name))
        )
    )
  )


;(defn generate-report-xls [report-type]
;  (try
;    (let [out (new java.io.ByteArrayOutputStream)]
;      (condp = (keyword report-type)
;        ;:my-test1 (xls-report-java out)
;        :my-test2  (xls-report-clj out))
;      (write-response (.toByteArray out) "xls")
;      )
;
;    (catch Exception ex
;      {:status 500
;       :headers {"Content-Type" "text/html"}
;       :body (.getMessage ex)})))


(defn soilder-export-excel
  "双拥数据导出"
  [request]
  (try
    (let [out       (new java.io.ByteArrayOutputStream)
          params    (:params request)
          getdatas  (ctl/get-soilder-excel params)]
      ;(println "DDDDDDDDDDDDDDDD" getdatas)
      (xls-report-clj out getdatas)
      (write-response (.toByteArray out) "xls")
      )

    (catch Exception ex
      {:status 500
       :headers {"Content-Type" "text/html"}
       :body (.getMessage ex)})))

(def excel-keys [:xhid :districtid	:name :identityid :sex :joindate :retiredate :hktype :idaddress :workunit :position :party :culture :troop :armyname :armycode	:retirenumber :specialty :phone :fname :fidentityid :mname :midentityid :familyphone :yearmoney :comments])

(defn excelimport
  "数据导入（excel），数据格式要求严格，需要对整数的字符串进行处理，不然会当作整数来处理，会遇到各种导入的不完全一致的情况"
  [file]
  (let[exldata (rest (get (myexcel/lazy-workbook (myexcel/workbook-hssf (:tempfile file))) "Sheet1"))
       ;dealdata (map #(conj {:districtid (str(nth % 0))} {:name (str(nth % 1))}{:identityid (str(nth % 2))}{:gender (if (= (nth % 4) "男") "1" (if (= (nth % 4) "女") "0" (nth % 4)))} {:age (str(nth % 5))}{:address (str(nth % 6))}) data)
       updata (map #(zipmap excel-keys %) exldata)
       ]
    (ctl/import-data-of-excel updata)
    (println "DDDDDDDDDDDDDDDDDDDD" updata)
    (str "success")))





