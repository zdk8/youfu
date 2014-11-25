(ns newpension.models.db
  (:use korma.core
        [korma.db :only [defdb with-db]])
  (:import (java.sql Timestamp))
  (:require [newpension.models.schema :as schema]
               [hvitmiddleware.core :as hvitmd]
            ))

(defdb dboracle schema/db-oracle)
(declare users olds functions audits rolefunc roleuser userlog division t_oldsocrel needs needsums)  ;;数据声明

;;数据库表实体及各实体关联
;;用户表
(defentity users
  (pk :userid)
  (table :xt_user)
  (belongs-to roleuser {:fk :userid})
  (database dboracle))

;;老年人主表
(defentity olds
  (pk :lr_id)
  (table :t_oldpeople)
  (database dboracle))

;;系统功能表
(defentity functions
  (pk :functionid)
  (table :xt_function)
  (has-one rolefunc {:fk :functionid})
  (database dboracle))

;;业务审核表
(defentity audits
  (table :opaudit)
  (belongs-to userlog {:fk :opseno})
  (database dboracle))

;;功能权限表
(defentity rolefunc
  (table :xt_rolefunc)
  (belongs-to roleuser {:fk :roleid})
  (database dboracle))

;;用户权限表
(defentity roleuser
  (pk :roleid)
  (table :xt_roleuser)
  (belongs-to users {:fk :userid})
  (database dboracle))

;;操作日志表
(defentity userlog
  (pk :opseno)
  (table :xt_userlog)
  (database dboracle))

;;输入框下拉选项列表
(defentity aa10
  (pk :prseno)
  (table :aa10)
  (database dboracle))

;;行政区划表
(defentity division
  (pk :dvcode)
  (table :division)
  (has-many division {:fk :dvhigh})
  (database dboracle))

;;家庭成员关系表
(defentity t_oldsocrel
  (pk :lrgx_id)
  (table :t_oldsocrel)
  (database dboracle))

;;人员评估表
(defentity needs
  (pk :lr_id)
  (table :t_needassessment)
  (has-one olds {:fk :lr_id})
  (database dboracle))

;;人员评估汇总表
(defentity needsums
  (table :t_needassessmentsum)
  (database dboracle))


;;资金发放表
(defentity t_grantmoney
  (pk :pg_id)
  (table :t_grantmoney)
  (has-one needs {:fk :pg_id})
  (database dboracle))

;;资金发放表
(defentity t_pensiondepartment
  (pk :id)
  (table :t_pensiondepartment)
  (database dboracle))

 ;;数据库操作函数
 ;;用户登录
;(defn get-user
;  ( [name pwd] (first
;                 (select users
;                   (fields)
;                   (where {:loginname name :passwd pwd})))
;   )
;  ( [name] (first
;             (select users
;               (where {:loginname name})))))
(defn get-user [name pwd]
  (first
    (select users
;      (fields :loginname)
      (where {:loginname name :passwd pwd})
      )
  )
  )

;;根据关键字获取该表自增主键
(defn get-max [keywords]
  (first
    (case keywords
      "olds" (select olds
               (aggregate (max :lr_id) :max))
      "userlog" (select userlog
                  (aggregate (max :opseno) :max))
      "audits" (select audits
                 (aggregate (max :auditid) :max))
      "famillyref" (select t_oldsocrel
                     (aggregate (max :lrgx_id) :max))
      "needs" (select needs
                (aggregate (max :pg_id) :max)))))

;;查询养老信息
(defn get-olds
  ( [] (select olds                  ;;查询所有养老信息
         (fields :lr_id :name :gender :birthd :identityid :address)))
  ( [keyword] (select olds           ;;根据关键字模糊查询
                (where {:name [like (str "%" (if (nil? keyword) "" keyword) "%")]}))))

;;根据主键查看养老信息
(defn get-old [id]
  (first
    (select olds
      (where {:lr_id  id}))))

;;根据身份证查询养老信息
(defn get-ids [id]
  (select olds
           (where {:identityid [like (str id "%")]})
           (order :identityid)))

;;新增养老信息
(defn create-old [old]
  (insert olds
    (values old)))

;;新增养老家庭成员信息
(defn insert-oldsocrel [fiels]
  (insert t_oldsocrel
    (values fiels)))

(defn sele_oldsocrel [gx_name]
  (select t_oldsocrel
    (where {:gx_name [= (str gx_name)]})))

;;修改养老信息
(defn update-old [old id]
  (update olds
    (set-fields old)
    (where {:lr_id id})))

;;修改养老家庭成员信息
(defn update-oldsorel [oldsorel lrgx_id]
  (update t_oldsocrel
    (set-fields oldsorel)
    (where {:lrgx_id lrgx_id})))

;;删除家庭成员关系表
(defn dele-oldsorel [lrgx_id]
  (delete t_oldsocrel
    (where {:lrgx_id lrgx_id})))

;;修改养老信息表状态
(defn update-oldstatus [status id]
  (update olds
    (set-fields {:status status})
    (where {:lr_id id})))

;;删除养老信息
(defn delete-old [id]
  (delete olds
    (where {:lr_id id})))

;;根据功能id查询操作日志
(defn get-userlogs [functionid]
  (select userlog
    (fields :opseno :digest :tprkey :username :bsnyue :bstime )
    (where {:functionid functionid})
    (order :opseno :desc)))      ;;降序排列

;;新增操作日志
(defn create-userlog [opseno digest tprkey functionid dvcode loginname username]
  (insert userlog
    (values {:opseno opseno :digest digest :tprkey tprkey :functionid functionid :dvcode dvcode :loginname loginname :username username})))

;;查询满足用户和功能权限的审核信息
(defn get-audits [functionid loginname dvcode]
  (select audits
    (fields :auditid :aulevel :auflag :audesc :auendflag)                      ;;页面显示内容
    (with userlog
      (fields :opseno :digest :tprkey :username :bsnyue :bstime)
      (where
        (and {:functionid functionid } (or {:dvcode [like (str  dvcode "%")]} (= dvcode "330100")))))
    (where  {:auendflag "0"                         ;;要满足的条件：审核未完成，审核等级达到权限要求
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

;;查询满足用户和功能权限的回退信息
(defn get-backaudits [functionid loginname dvcode]
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

;;根据外键查询审核信息
(defn get-audit [id]
  (first
    (select audits
      (with userlog
        (where {:tprkey id})))))

;;新增审核信息
(defn create-audit [opseno auditid]
  (insert audits
    (values {:opseno opseno :auditid auditid :auflag "0" :aulevel "0" :auendflag "0"})))

;;修改审核信息
(defn update-audit [aulevel auflag aaa027 audesc auuser auopseno auendflag auditid opseno]
  (update audits
    (set-fields {:aulevel aulevel :auflag auflag  :audesc audesc
                 :audate (new Timestamp (System/currentTimeMillis)) :opseno opseno
                 :auuser auuser :auopseno auopseno :auendflag auendflag
                 })
    (where {:auditid  auditid})))

;;删除审核信息
(defn delete-audit [id]
  (delete audits
    (where {:auditid id})))

;;查询满足满足用户权限的功能
(defn get-funcs [username parent]
  (select functions
    (where (and {:parent parent
                 :functionid [in
                              (subselect rolefunc
                                (fields :functionid)
                                (with roleuser
                                  (fields)
                                  (with users
                                    (fields)
                                    (where {:username username}))))]}  {:functionid [not-in ["weouDjr2ji7k5w4EA0Ws"
                                                                                             "4CkaX11T23bhDwXa9EHZ"
                                                                                             "P6IyVH34P1sgn7VzU4q8"
                                                                                             "5P7oQzbn9ISfSkKAJbOd"
                                                                                             "XGcoe8yNX0DfdZHn4CMa"
                                                                                             "yw8Q05XYP5SiUC24nvCC"
                                                                                             "2SF0N1S5hYYE2Vhlxk2T"]]}))
    (order :orderno)))

;;获取输入框下拉选项列表
(defn get-inputlist [aaa100]
  (select aa10
    (where {:aaa100 aaa100})))

;;获取行政区划的选项列表
(defn get-divisionlist [dvhigh]
  (select division
    (fields :dvcode :dvhigh :totalname :dvname)
    (where {:dvhigh dvhigh})))

;;查询家庭成员关系表
(defn get-oldsocrel [lr_id]
  (select t_oldsocrel
    (where {:lr_id lr_id})))

;;查询评估信息
(defn get-needs []
  (select needs
    (order :pg_id :desc)))

;;根据主键查询评估信息
(defn get-need [id]
  (first
    (select needs
      (where {:pg_id id}))))

;;新增评估信息
(defn create-need [need]
  (insert needs
    (values need)))

;;修改评估信息
(defn update-need [need id]
  (update needs
    (set-fields need)
    (where {:pg_id id})))

;;修改评估状态
(defn update-active [active id]
  (update needs
    (set-fields {:active active})
      (where {:pg_id id})))

;;查询评估汇总信息
(defn get-needsum [id]
  (first
    (select needsums
      (where {:pg_id id}))))

;;新增评估汇总信息
(defn create-needsum [needsum]
  (insert needsums
    (values needsum)))

;;修改汇总信息
(defn update-needsum [needsum id]
  (update needsums
    (set-fields needsum)
    (where {:pg_id id})))

;;资金发放表查询
(defn get-grantmoney []
  (select t_grantmoney
    (fields :pg_id :bsnyue :money )
    (with needs
      (fields :sh_jings :sh_yid :sh_weis :sh_ruc :sh_xiz :sh_lout)
      (with olds
        (fields :name :identityid :birthd :gender :age :nation)))
    (order :bsnyue :desc)))

;;资金发放条件查询
(defn get-grantmoneyByEle [name identityid bsnyue]
  (if (not= name "0")
    (if (not= identityid "0")
      (if (not= bsnyue "0")
        (select t_grantmoney
          (fields :pg_id :bsnyue :money )
          (with needs
            (fields :sh_jings :sh_yid :sh_weis :sh_ruc :sh_xiz :sh_lout)
            (with olds
              (fields :name :identityid :birthd :gender :age :nation)
              (where {:name name})
              (where {:identityid identityid})))
          (where {:bsnyue bsnyue})
          (order :bsnyue :desc))
        (select t_grantmoney
          (fields :pg_id :bsnyue :money )
          (with needs
            (fields :sh_jings :sh_yid :sh_weis :sh_ruc :sh_xiz :sh_lout)
            (with olds
              (fields :name :identityid :birthd :gender :age :nation)
              (where {:name name})
              (where {:identityid identityid})))
          (order :bsnyue :desc)))
      (if (not= bsnyue "0")
        (select t_grantmoney
          (fields :pg_id :bsnyue :money )
          (with needs
            (fields :sh_jings :sh_yid :sh_weis :sh_ruc :sh_xiz :sh_lout)
            (with olds
              (fields :name :identityid :birthd :gender :age :nation)
              (where {:name name})))
          (where {:bsnyue bsnyue})
          (order :bsnyue :desc))
        (select t_grantmoney
          (fields :pg_id :bsnyue :money )
          (with needs
            (fields :sh_jings :sh_yid :sh_weis :sh_ruc :sh_xiz :sh_lout)
            (with olds
              (fields :name :identityid :birthd :gender :age :nation)
              (where {:name name})))
          (order :bsnyue :desc))))
    (if (not= identityid "0")
      (if (not= bsnyue "0")
        (select t_grantmoney
          (fields :pg_id :bsnyue :money )
          (with needs
            (fields :sh_jings :sh_yid :sh_weis :sh_ruc :sh_xiz :sh_lout)
            (with olds
              (fields :name :identityid :birthd :gender :age :nation)
              (where {:identityid identityid})))
          (where {:bsnyue bsnyue})
          (order :bsnyue :desc))
        (select t_grantmoney
          (fields :pg_id :bsnyue :money )
          (with needs
            (fields :sh_jings :sh_yid :sh_weis :sh_ruc :sh_xiz :sh_lout)
            (with olds
              (fields :name :identityid :birthd :gender :age :nation)
              (where {:identityid identityid})))
          (order :bsnyue :desc)))
      (if (not= bsnyue "0")
        (select t_grantmoney
          (fields :pg_id :bsnyue :money )
          (with needs
            (fields :sh_jings :sh_yid :sh_weis :sh_ruc :sh_xiz :sh_lout)
            (with olds
              (fields :name :identityid :birthd :gender :age :nation)))
          (where {:bsnyue bsnyue})
          (order :bsnyue :desc))))))

;;查询业务期（bsnyue）是否存在
(defn hasbsnyue [bsnyue pg_id]
  (select t_grantmoney
    (fields :money :bsnyue)
    (with needs
      (fields :pg_id))
    (where (and (= :bsnyue bsnyue)(= :pg_id pg_id)))))


;;查询能够进行资金发放人员
(defn get-cangrantmoney [bsnyue]
  (select needs
    (fields :pg_id)
    (with olds
      (fields :name :identityid))
    (where {:pg_id [not-in (subselect t_grantmoney
                             (fields :pg_id)
                             (where {:bsnyue bsnyue}))]})
    (order :pg_id :desc)))




;;查询资金发放表,判断granttype是否为空
(defn hasgranttype []
  (select t_grantmoney
    (fields :granttype)))



;;新增已享受资金发放人员
(defn insert-grantmoney [fields]
  (insert t_grantmoney
    (values fields)))

;;查询资金发放表主键
(defn sel-grantmoneyid []
  (let [qcount (count (select t_grantmoney))] (str qcount)
    (if (> qcount 0)
      (first
        (select t_grantmoney
          (aggregate (max :grantid) :max)))
      (str "0"))))

;;取出需求评估信息表主键
(defn get-needsid []
  (select needs
    (fields :pg_id)))

;;资金发放记录删除(重新发放)
(defn del-grantmoney [bsnyue]
  (delete t_grantmoney
    (where {:bsnyue bsnyue})))


;###########################
(defentity t_pensiondepartment
;  (pk :userid)
  (table :t_pensiondepartment)
  (database dboracle))
(defn get-yljg []
  (select t_pensiondepartment))


(defn add-depart [filter-fields]                 "增加机构"
  (insert t_pensiondepartment
    (values filter-fields)))

(defn get-departbyid [id]
  (select t_pensiondepartment
    (where {:id id})))

(defn getall-results [start end sql]
  (let [sql (str "SELECT * FROM
(SELECT A.*, ROWNUM RN FROM
("sql") A
  WHERE ROWNUM <= " end ")
 WHERE RN >= " start)]
    (exec-raw [sql []] :results)))

(defn get-total[totalsql]
  (exec-raw [totalsql []] :results))





;;分页
(defn gettarget [start end table fields key conditions]        "查找当前页数据"
  (with-db dboracle
    (exec-raw [(hvitmd/create-oraclequery-paging {:table table :properties fields :predicate conditions :order [key] :from start :max end}) []] :results)))

(defn getcond-total [tablename conditions]              "根据条件查找总数"
  (with-db dboracle
    (exec-raw [(hvitmd/get-oraclequery-total {:table tablename :predicate conditions}) []] :results)))


