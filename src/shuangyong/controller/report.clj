(ns shuangyong.controller.report
  (:use compojure.core)
  (:use clojure.java.io)
  (:require                                                 ;[shuangyong.models.gen :as gen]
            [ring.util.response :as response]
    ;[clj-pdf.core :refer [pdf template]]
            [clj-excel.core :as myexcel]

    ;       [noir.response :as resp]
            [shuangyong.common.common :as common]
            )

  )

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


(defn soilder-import-excel [request]
  (try
    (let [out (new java.io.ByteArrayOutputStream)]
      (xls-report-clj out)
      (write-response (.toByteArray out) "xls")
      )

    (catch Exception ex
      {:status 500
       :headers {"Content-Type" "text/html"}
       :body (.getMessage ex)})))


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
    ;(old/importdata updata)
    ;(println "UUUUUUUUUUUU" (common/timefmt-bef-insert (first updata) "BIRTHD"))
    )

  (str "success")
  )




