(ns newpension.models.db
  (:use korma.core
        [korma.db :only [defdb with-db]])
  (:import (java.sql Timestamp))
  (:require [newpension.models.schema :as schema]
            ))

(defdb dboracle schema/db-oracle)
(declare users olds oldsocrel functions audits rolefunc roleuser userlog division)  ;;数据声明

;;数据库表实体及各实体关联
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

;;输入框下拉选项列表
(defentity aa10
  (pk :prseno)
  (table :aa10)
  (database dboracle)
  )
;;行政区划表
(defentity division
  (pk :dvcode)
  (table :division)
  (has-many division {:fk :dvhigh})
  (database dboracle)
  )

;;家庭成员关系表
(defentity t_oldsocrel
  (pk :lrgx_id)
  (table :t_oldsocrel)
  (database dboracle))

(defn get-user
  ( [name pwd] (first
                 (select users
                   (where {:loginname name :passwd pwd}))))
  ( [name] (first
             (select users
               (where {:loginname name})))))

(defn get-max [keywords]     ;;根据关键字获取该表自增主键
  (first
    (case keywords
      "olds" (select olds
               (aggregate (max :lr_id) :max))
      "userlog" (select userlog
                  (aggregate (max :opseno) :max))
      "audits" (select audits
                 (aggregate (max :auditid) :max)))))

;;养老信息表
(defn get-olds        ;;查询养老信息
  ( [] (select olds                  ;;查询所有养老信息
         (fields :lr_id :name :gender :birthd :identityid :address)))
  ( [keyword] (select olds           ;;根据关键字模糊查询
                (where {:name [like (str "%" (if (nil? keyword) "" keyword) "%")]}))))

(defn get-old [id]      ;;根据主键查看养老信息
  (first
    (select olds
      (where {:lr_id  id}))))

(defn create-old [old]       ;;新增养老信息
  (insert olds
    (values old)))

;;新增养老家庭成员信息
(defn insert-oldsocrel [fiels]
  (insert t_oldsocrel
  (values fiels)))

(defn sele_oldsocrel [gx_name]
  (select t_oldsocrel
  (where {:gx_name [= (str gx_name)]}) )
  )

(defn update-old [old id]       ;;修改养老信息
  (update olds
    (set-fields old)
    (where {:lr_id id})))

(defn update-oldstatus [status id]     ;;修改养老信息表状态
  (update olds
    (set-fields {:status status})
    (where {:lr_id id})))

(defn delete-old [id]            ;;删除养老信息
  (delete olds
    (where {:lr_id id})))

;;操作日志表
(defn get-userlogs [functionid]     ;;根据功能id查询操作日志
  (select userlog
    (fields :opseno :digest :tprkey :username :bsnyue :bstime )
    (where {:functionid functionid})
    (order :opseno :desc)))      ;;降序排列

(defn create-userlog [opseno digest tprkey functionid dvcode loginname username]      ;;新增操作日志
  (insert userlog
    (values {:opseno opseno :digest digest :tprkey tprkey :functionid functionid :dvcode dvcode :loginname loginname :username username})))

;;审核表
(defn get-audits [functionid loginname dvcode]     ;;查询满足用户和功能权限的审核信息
  (select audits
    (fields :auditid :aulevel :auflag :audesc :auendflag)                      ;;页面显示内容
    (with userlog
      (fields :opseno :digest :tprkey :username :bsnyue :bstime)
      (where {:functionid functionid :dvcode [like (str  dvcode "%")]})
      )
    (where  {:auendflag "0"                          ;;要满足的条件：审核未完成，审核等级达到权限要求
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
    (order :opseno :desc)))           ;;降序排列

(defn get-backaudits [functionid loginname dvcode]       ;;查询满足用户和功能权限的回退信息
  (select audits
    (fields :auditid :aulevel :auflag :audesc :auendflag)
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
    (order :opseno :desc)))            ;;降序排列

(defn get-audit [id]           ;;根据外键查询审核信息
  (first
    (select audits
      (with userlog
        (where {:tprkey id})))))

(defn create-audit [opseno auditid]       ;;新增审核信息
  (insert audits
    (values {:opseno opseno :auditid auditid :auflag "0" :aulevel "0" :auendflag "0"})))

(defn update-audit [aulevel auflag aaa027 audesc auuser auopseno auendflag auditid opseno]   ;;修改审核信息
  (update audits
    (set-fields {:aulevel aulevel :auflag auflag :aaa027 aaa027 :audesc audesc
                 :audate (new Timestamp (System/currentTimeMillis)) :opseno opseno
                 :auuser auuser :auopseno auopseno :auendflag auendflag
                 })
    (where {:auditid  auditid})))

(defn delete-audit [id]            ;;删除审核信息
  (delete audits
    (where {:auditid id})))

;(defn get-funcs [username parent]
;  (select functions
;    (where {:parent parent})
;    (with rolefunc
;      (fields)
;      (with roleuser
;        (fields)
;        (with users
;          (fields)
;          (where {:username username}))))))

;;获取输入框下拉选项列表
(defn get-inputlist [aaa100]
  (select aa10
    (where {:aaa100 aaa100})))

;;获取行政区划的选项列表
(defn get-divisionlist [dvhigh]
  (select division
    (fields :dvcode :dvhigh :totalname)
    (where {:dvhigh dvhigh})))

