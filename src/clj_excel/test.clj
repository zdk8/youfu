(ns clj-excel.test
  (:use clj-excel.core))


(defn excel-test-1 []
  (-> (build-workbook (workbook-hssf) {"Numbers" [[1] [2 3] [4 5 6]]})
    (save "numbers.xls")))


;;excel-test-2
(def a-cell-value
  {:value "world" :alignment :center
   :border [:none :thin :dashed :thin]
   :foreground-color :grey-25-percent :pattern :solid-foreground
   :font {:color :blue :underline :single :italic true
          :size 12 :font "Arial"}})
(defn excel-test-2 []
  (-> (build-workbook (workbook-hssf) {"hello" [[a-cell-value]]})
    (save "hello-world.xls")))
