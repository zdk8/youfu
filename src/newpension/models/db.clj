(ns newpension.models.db
  (:use korma.core
        [korma.db :only [defdb with-db]])
  (:import (java.sql Timestamp))
  (:require [newpension.models.schema :as schema]
            ))

(defdb dboracle schema/db-oracle)
(declare users olds oldsocrel functions audits rolefunc roleuser userlog)

(defentity users
  (pk :userid)
  (table :xt_user)
  (belongs-to roleuser {:fk :userid})
  (database dboracle)
  )

(defentity olds
  (table :t_oldpeople)
  (database dboracle)
  )

(defentity oldsocrel
  (table :t_oldsocrel)
  (database dboracle)
  )

(defentity functions
  (pk :functionid)
  (table :xt_function)
  (has-one rolefunc {:fk :functionid})
  (database dboracle)
  )

(defentity audits
  (table :opaudit)
  (belongs-to userlog {:fk :opseno})
  (database dboracle)
  )

(defentity rolefunc
  (table :xt_rolefunc)
  (belongs-to roleuser {:fk :roleid})
  (database dboracle)
  )

(defentity roleuser
  (pk :roleid)
  (table :xt_roleuser)
  (belongs-to users {:fk :userid})
  (database dboracle)
  )

(defentity userlog
  (pk :opseno)
  (table :xt_userlog)
  (database dboracle)
  )

(defn get-user
  ( [name pwd] (first
                 (select users
                   (where {:loginname name :passwd pwd}))))
  ( [name] (first
             (select users
               (where {:loginname name})))))

(defn get-olds
  ( [] (select olds
         (fields :lr_id :name :gender :birthd :identityid :address)))
  ( [keyword] (select olds
                (where {:name [like (str "%" (if (nil? keyword) "" keyword) "%")]}))))

(defn get-max [keywords]
  (first
    (case keywords
      "olds" (select olds
               (aggregate (max :lr_id) :max))
      "userlog" (select userlog
                  (aggregate (max :opseno) :max))
      "audits" (select audits
                 (aggregate (max :auditid) :max)))))

(defn get-old [id]
  (first
    (select olds
      (where {:lr_id  id}))))

;(defn get-oldbyid [id]
;  (first
;    (select olds
;      (where {:lr_id  id}))))

(defn create-old [old]
  (insert olds
    (values old)))

(defn update-old [old id]
  (update olds
    (set-fields old)
    (where {:lr_id id})))

(defn update-oldstatus [status id]
  (update olds
    (set-fields {:status status})
    (where {:lr_id id})))

(defn delete-old [id]
  (delete olds
    (where {:lr_id id})))

(defn get-userlogs [functionid]
  (select userlog
    (fields :opseno :digest :tprkey :username :bsnyue :bstime )
    (where {:functionid functionid})
    (order :opseno :desc)))

(defn create-userlog [opseno digest tprkey functionid dvcode loginname username]
  (insert userlog
    (values {:opseno opseno :digest digest :tprkey tprkey :functionid functionid :dvcode dvcode :loginname loginname :username username})))

(defn get-audits [functionid loginname dvcode]
  (select audits
    (fields :auditid :aulevel :auflag :audesc)
    (with userlog
      (fields :opseno :digest :tprkey :username :bsnyue :bstime)
      (where {:functionid functionid :dvcode [like (str  dvcode "%")]})
      )
    (where  {:auendflag "0"
             :aulevel [in (map #(str %)
                            (map #(dec %)
                              (map #(Integer/parseInt %)
                                (map :location
                                  (select functions
                                    (fields :location)
                                    (where {:nodetype "2" })
                                    (with rolefunc
                                      (fields)
                                      (with roleuser
                                        (fields)
                                        (with users
                                          (fields)
                                          (where {:loginname loginname })))))))))]})
    (order :opseno :desc)))

(defn get-backaudits [functionid loginname dvcode]
  (select audits
    (fields :auditid :aulevel :auflag :audesc)
    (with userlog
      (fields :opseno :digest :tprkey :username :bsnyue :bstime)
      (where {:functionid functionid :dvcode  dvcode })  ;;直接回退
      )
    (where {:auflag "0" :aulevel [> 0]})
    ;    (where  {:auflag "0"                             ;;逐级回退
    ;             :aulevel [in (into (map :location
    ;                                  (select functions
    ;                                    (fields :location)
    ;                                    (where {:nodetype "2" })
    ;                                    (with rolefunc
    ;                                      (fields)
    ;                                      (with roleuser
    ;                                        (fields)
    ;                                        (with users
    ;                                          (fields)
    ;                                          (where {:loginname loginname }))))))
    ;                                (map #(str %) (map #(inc %) (map #(Integer/parseInt %) (map :location
    ;                                  (select functions
    ;                                    (fields :location)
    ;                                    (where {:nodetype "2" })
    ;                                    (with rolefunc
    ;                                      (fields)
    ;                                      (with roleuser
    ;                                        (fields)
    ;                                        (with users
    ;                                          (fields)
    ;                                          (where {:loginname loginname }))))))))))]})
    (order :opseno :desc)))

(defn get-audit [id]
  (first
    (select audits
      (with userlog
        (where {:tprkey id})))))

(defn create-audit [opseno auditid]
  (insert audits
    (values {:opseno opseno :auditid auditid :auflag "0" :aulevel "0" :auendflag "0"})))

(defn update-audit [aulevel auflag aaa027 audesc auuser auopseno auendflag auditid opseno]
  (update audits
    (set-fields {:aulevel aulevel :auflag auflag :aaa027 aaa027 :audesc audesc
                 :audate (new Timestamp (System/currentTimeMillis)) :opseno opseno
                 :auuser auuser :auopseno auopseno :auendflag auendflag
                 })
    (where {:auditid  auditid})))

(defn delete-audit [id]
  (delete audits
    (where {:auditid id})))

(defn get-funcs [username parent]
  (select functions
    (where {:parent parent})
    (with rolefunc
      (fields)
      (with roleuser
        (fields)
        (with users
          (fields)
          (where {:username username}))))))