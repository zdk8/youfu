(ns newpension.controller.audit
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
               [newpension.layout :as layout]))

(def applykeys [:name :identityid :gender :birthd :nation :culture :birthplace :marriage :live :economy :age :registration :address :postcode :telephone :mobilephone
            :agent :oprelation :agentaddr :agentphone :agentmobilephone :lr_id :ishandle :applydate])
(def opofapply [:name :identityid :gender :birthd :nation :culture :marriage :live :economy :age :registration :address :telephone :mobilephone])

(def t_jjylapply "t_jjylapply")


(defn add-audit-apply [request]
  (let[params (:params request)
       identityid (:identityid params)
       checkold (count (db/get-oldpeople identityid))
       opdata (select-keys params opofapply)
       applydata (select-keys params applykeys)]
    (if (= checkold 0) (old/add-oldpeople opdata))                                           ;如果老人数据没有此数据，将其添加到老人数据库中
    (db/add-apply (common/timefmt-bef-insert (common/timefmt-bef-insert applydata "birthd") "applydate"))
    (resp/json {:success true :message "apply success"})))

(defn get-apply-byid [request]
  (let[params (:params request)
       jj_id (:jja_id params)
       applydata (db/get-apply-byid jj_id)]
    (resp/json (common/time-before-list (common/time-before-list applydata "birthd") "applydate"))))

(defn getall-apply [request]
  (let[params (:params request)
       rows (:rows params)
       page (:page params)
       name (:name params)
       identityid (:identityid params)
       cond (str " and (ishandle != '1' or ishandle is null)" (common/likecond "name" name) (common/likecond "identityid" identityid))
       getresult (common/fenye rows page t_jjylapply cond " order by jja_id ")]
    (resp/json {:total (:total getresult) :rows (common/time-before-list(common/time-before-list (:rows getresult) "birthd") "applydate")})))