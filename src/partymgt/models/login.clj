(ns partymgt.models.login
  (:use korma.core
        [korma.db :only [defdb with-db transaction]])
  (:import (java.sql Timestamp)
           (java.text SimpleDateFormat)
           (java.text DateFormat))
  (:require [partymgt.models.schema :as schema]
            ))

(defdb dboracle schema/db-oracle)
(declare users functions rolefunc roleuser)  ;;数据声明
;;用户表
(defentity users
  (pk :userid)
  (table :xt_user)
  (belongs-to roleuser {:fk :userid})
  (database dboracle))
;;用户权限表
(defentity roleuser
  (pk :roleid)
  (table :xt_roleuser)
  (belongs-to users {:fk :userid})
  (database dboracle))

(defn get-user [name pwd]
    (first
      (select users
        (where {:loginname name :passwd pwd})
        ))
;  (first
;    (with-db dboracle
;      (exec-raw ["select * from xt_user u,division d where u.regionid=d.dvcode and u.loginname=? and u.passwd=?" [name pwd]] :results))
;    )
  )