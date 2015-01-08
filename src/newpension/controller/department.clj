(ns newpension.controller.department
  (:use compojure.core)
  (:use korma.core
        [korma.db :only [oracle]])
  (:require [newpension.models.db :as db]
               [newpension.common.common :as common]
               [newpension.controller.old :as old]
               [newpension.models.schema :as schema]
               [noir.response :as resp]
               [clj-time.local :as l]
               [clj-time.coerce :as c]
               [noir.io :as io]
               [ring.util.response :refer [file-response]]
               [newpension.layout :as layout])

  (:import [java.io File FileInputStream FileOutputStream]))

(def depart [:departname :districtid :deptype :register :telephone :people :address :busline :coordinates :approvedbed :actualbed :livenumber :buildarea :function :runtime :serial_id :manage_id])
(def deppeople [:name :age :identityid  :lr_id :dep_id :departname :checkintime :checkouttime :neednurse :districtid :address :registration :type :live :marriage :culture :economy
                :deptype :sex :contact :phone :cellphone :health :comments :jjzk_baofang :jjzk_lixiu :jjzk_baomu])
(def oldpeople [:districtid :name :identityid :address :registration :type :live :marriage :economy :culture])
(def canteen [:departname :register :telephone :people :address :busline :coordinates :buildarea :function :runtime :avgnumber])

(def t_pensiondepartment "t_pensiondepartment")
(def t_oldpeopledep "t_oldpeopledep")
(def t_mcanteen "t_mcanteen")


(defn add-department [request]
  (let [{params :params}request
        filter-fields (select-keys params depart)]
    (db/add-depart (common/timefmt-bef-insert   filter-fields "runtime"))
;    (resp/json {:success true :message "add success"})
    (str "true")
    ))

(defn getall-department [request]
  (let[{params :params}request
       {deptype :deptype}params
       {departname :departname}params
       {page :page}params
       {rows :rows}params
        cond (str " and deptype = '" deptype "' "  (common/likecond "departname" departname))
        getresult (common/fenye rows page t_pensiondepartment "*" cond "")
       ]
    (resp/json {:total (:total getresult) :rows (common/time-before-list (:rows getresult) "runtime")})))

(defn get-departbyid [request]
  (let[{params :params}request
       {dep_id :dep_id}params]
    (resp/json (db/get-departbyid dep_id))))

(defn update-departbyid [request]
  (let[{params :params}request
       filter-fields (select-keys params depart)
       {dep_id :dep_id}params]
    (db/update-departbyid filter-fields dep_id)
;    (resp/json {:success true :message "update success"})
    (str "true")
    ))

(defn delete-departbyid [request]
  (let[{params :params}request
       {dep_id :dep_id}params
       opd (db/checkopd dep_id)]
    (if (>(count opd) 0)
        (resp/json {:success false :message "some old people are not checkout"})
        (do (db/delete-departbyid dep_id)
              (resp/json {:success true :message "delete success"})))))

(defn get-oldpeople [identityid]
  (db/get-oldpeople identityid))

(defn checkidentityid [request]
  (let[{params :params}request
       {identityid :identityid}params
       opdate (get-oldpeople identityid)]
    (if (> (count opdate) 0)  (resp/json {:opdate opdate :message true})  (resp/json {:message false}))
    ))

(defn get-oldpeopledep [identityid]
  (db/get-oldpeopledep identityid))

(defn add-oldpeople-depart [request]
  (let [{params :params}request
        {identityid :identityid}params
        checkop (get-oldpeople identityid)
       checkopdep (get-oldpeopledep identityid)
        ;nowtime (common/get-nowtime)
        opddate (common/timefmt-bef-insert(common/timefmt-bef-insert (select-keys params deppeople) "checkintime") "checkouttime") ;(conj (select-keys params deppeople) {:checkintime nowtime})
        ]
    (println "DDDDDDD"  (select-keys params deppeople))
    (if (<= (count checkop) 0) (let[opdate (select-keys params oldpeople)]   (old/create-old request)))                 ;判断老年表是否存在，不存在添加数据到老年表
   ; (if (> (count checkopdep) 0)  (str "false");(resp/json {:success false :message "user already checkin"})                              ;判断是否已经入住了
      (do (db/add-oldpeopledep opddate)
;        (resp/json {:success true :message "checkin success"})
        (str "true")
        )
))

(defn update-opdep-byid [request]
  (let[params (:params request)
       opd_id (:opd_id params)
       opddata (common/timefmt-bef-insert(common/timefmt-bef-insert (select-keys params deppeople) "checkintime") "checkouttime")]
    (db/update-oldpeopledep opddata opd_id)
    (str "update opdep success")))

(defn select-opdofdepart [request]
  (let[{params :params}request
       {name :name}params
       {identityid :identityid}params
       {departname :departname}params
       {deptype :deptype}params
       {page :page}params
       {rows :rows}params
       cond (str " and deptype = '" deptype "' " (common/likecond "name" name)  (common/likecond "identityid" identityid)  (common/likecond "departname" departname) " and checkouttime is null")
       getresult (common/fenye rows page "t_oldpeopledep" "*" cond " order by opd_id desc")]
    (resp/json {:total (:total getresult) :rows (common/time-before-list (:rows getresult) "checkintime")})))

(defn oldpeople-checkout [request]
  (let[{params :params}request
       {opd_id :opd_id} params
       nowtime (common/get-nowtime)]
    (db/oldpeople-checkout opd_id nowtime)
    (resp/json {:success true :message "checkout success"})))



(defn add-canteen  [request]
  (let[{params :params}request
       canteendate (select-keys params canteen)]
    (db/add-canteen (common/timefmt-bef-insert canteendate "runtime"))
    (resp/json {:success true :message "add canteen success"})))

(defn getall-canteen  [request]
  (let[{params :params}request
       {page :page}params
       {rows :rows}params
       {departname :departname}params
       cond (str " and departname like '%" departname "%' ")
       getresult (common/fenye rows page t_mcanteen "*" cond "")]
    (resp/json {:total (:total getresult) :rows (common/time-before-list (:rows getresult) "runtime")})))

(defn update-canteen  [request]
  (let[{params :params}request
       {c_id :c_id}params
       canteendate (select-keys params canteen)]
    (db/update-canteen (common/timefmt-bef-insert canteendate "runtime") c_id)
    (resp/json {:success true :message "update canteen success"})))

(defn delete-canteen [request]
  (let[{params :params}request
       {c_id :c_id}params]
    (db/delete-canteen c_id)
    (resp/json {:success true :message "delete canteen success"}) ))

(defn add-photo [file]
  (let[filepath (common/uploadfile file)]
    (resp/json {:success true :filepath filepath})))
(defn server-file [file-name]
  (file-response (str "upload" File/separator file-name)))

(defn testfun [request]
  (println (l/local-now))
  (println  (c/to-long  (l/local-now)))
  (println (str schema/datapath "upload/"))
  (resp/json {:result (str schema/datapath "upload/")}))
(defn mytest [id name]
  (resp/json {:success (str id "," name)}))