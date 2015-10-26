(ns shuangyong.models.manager
  (:use korma.core
        [korma.db :only [defdb with-db]])
  (:import (java.util.UUID))
  (:require [clojure.string :as strs]
            [shuangyong.models.schema :as schema]
            ))


(defdb dboracle schema/db-oracle)
(declare division)  ;;数据声明

;;行政区划表
(defentity division
  (pk :dvcode)
  (table :division)
  (has-many division {:fk :dvhigh})
  (database dboracle))

(defn getenumeratebytype [keyword ]
  (with-db dboracle
    (exec-raw [(str "select lower(aaa100) enumeratetype,aaa102 enumeratevalue,aaa103 enumeratelabel from xt_combodt where lower(aaa100) = '" keyword "' order by aaa102 asc ") []] :results)))
(defn getenumeratebytypeandv [type value]
  (with-db dboracle
    (exec-raw [(str "select aaa103 from xt_combodt where aaa100='" type "' and aaa102=" value) []] :results)))

(defn allmenutree [node]
  (with-db dboracle
    (exec-raw ["select t.*,t.functionid id,t.title text,t.location value,(select (decode(count(1),0,'true','false'))
    from xt_function where parent=t.functionid) leaf  from xt_function t where t.parent=? order by t.orderno asc" [node]] :results) ))

(defn menutree [loginname node]
  (with-db dboracle
    (exec-raw ["select m.*,m.functionid id,m.title text,m.location value,(select (decode(count(1),0,'true','false')) from xt_function where parent=m.functionid) leaf from
    (select distinct(t.functionid) functionid from xt_function t
     ,xt_user u,xt_rolefunc rf,xt_roleuser ru where ru.roleid=rf.roleid and rf.functionid=t.functionid and ru.userid=u.userid and u.loginname=? and t.parent=?) n,
     xt_function m where m.functionid=n.functionid order by m.orderno asc" [loginname node]] :results) ))

(defn grantmenutree [roleid node]
  (with-db dboracle
    (exec-raw ["select rf.roleid checked,t.functionid id,t.title text,t.location value,t.*, (select (decode(count(1),0,'true','false')) from xt_function where parent=t.functionid) leaf
  from xt_function t left join (select * from xt_rolefunc where roleid = ?) rf on t.functionid = rf.functionid where t.parent = ? order by t.orderno asc " [roleid node]] :results) ))



(defn divisiontree [node]
  (with-db dboracle
    (exec-raw ["select dvname text,dvcode value,dvcode id,dvcode,dvname,dvhigh,totalname,(decode (dvrank ,'5' ,'true' ,'false')) leaf  from division where dvhigh=?" [node]] :results) ))

(defn divisiontreefirst [node]
  (with-db dboracle
    (exec-raw ["select dvname text,dvcode value,dvcode id,dvcode,dvname,dvhigh,totalname,(decode (dvrank ,'5' ,'true' ,'false')) leaf  from division where dvcode=?" [node]] :results) ))

(defn getdistrictname [districtid]
  (select division
    (where {:dvcode districtid})))

(defn get-function-by-id [id]
  (with-db dboracle
    (exec-raw ["select * from xt_function where functionid=?" [id]] :results)))

(defn del-function-by-id [id]
  (with-db dboracle
    (exec-raw [(str "delete from xt_function where functionid='" id "'")])))




(defentity xt_function
  (database dboracle)
  )
(defentity xt_combo
  (database dboracle)
  )
(defentity xt_combodt
  (database dboracle)
  )
(defentity xt_user
  (database dboracle)
  )
(defentity xt_role
  (database dboracle)
  )

(defentity xt_rolefunc
  (database dboracle)
  )

(defentity xt_roleuser
  (database dboracle)
  )


(defn create-function [function]
  (let [f (conj function {:functionid (strs/replace (str (java.util.UUID/randomUUID)) "-" "")}) ]
    (insert xt_function
      (values f))))
(defn getFunctionImg [functionid]
  (first
    (select xt_function
    (where {:functionid functionid})
    )))


(defn create-combo [combo]
  (let [f combo ]
    (insert xt_combo
      (values f))))
(defn update-combo [combo aaa100]
  (update xt_combo
    (set-fields combo)
    (where {:aaa100 aaa100})))
(defn delete-combo [aaa100]
  (delete xt_combo
    (where {:aaa100 [aaa100]})))


(defn create-combodt [combo]
  (let [f combo]
    (insert xt_combodt
      (values f))))
(defn update-combodt [combo aaz093]
  (update xt_combodt
    (set-fields combo)
    (where {:aaz093 aaz093})))
(defn delete-combodt [aaz093]
  (delete xt_combodt
    (where {:aaz093 [aaz093]})))



(defn update-function [function functionid]
  (update xt_function
    (set-fields function)
    (where {:functionid functionid})))

(defn delete-function [id]
  (with-db dboracle
    (exec-raw ["delete * from xt_function where functionid=?" [id]] :results)))

(defn get-combos [id]
  (with-db dboracle
    (exec-raw ["select * from xt_combo" []] :results)))
(defn get-combo-by-pr [id]
  (with-db dboracle
    (exec-raw [(str "select * from xt_combo where aaa100='" id "'") []] :results)))
(defn get-combodt-by-pr [id]
  (with-db dboracle
    (exec-raw [(str "select * from xt_combodt where aaz093=" id ) []] :results)))

(defn get-combodts [aaa100]
  (with-db dboracle
    (exec-raw ["select * from xt_combodt where aaa100=?" [aaa100]] :results)))


;;用户信息的增删改查
(defn create-user [user]
  (let [f (conj user {:userid (strs/replace (str (java.util.UUID/randomUUID)) "-" "")}) ]
    (insert xt_user
      (values f))))
(defn update-user [user userid]
  (update xt_user
    (set-fields user)
    (where {:userid userid})))
(defn delete-user [userid]
  (let [res1 (with-db dboracle
               (exec-raw ["select roleid from xt_roleuser where userid = ?" [userid]] :results))]
    (if (> (count res1) 0)
      (if (:roleid (first res1))
        (str "该用户下已经分配角色")
        (delete xt_user
          (where {:userid userid}))
        )
      (delete xt_user
        (where {:userid userid}))
      )
    )

;  (if (> (count (with-db dboracle
;    (exec-raw ["select * from xt_roleuser where userid = ?" [userid]] :results))) 0)
;    (str "该用户下已经分配角色")
;    (delete xt_user
;      (where {:userid userid}))
;    )
  )
;(defn get-user-by-regionid [sql userid username start end]
;  (with-db dboracle
;;    (exec-raw [(str "select u.*,d.totalname from xt_user u,division d where u.regionid like '"
;;                 userid "%' and u.username like '" username "%' and u.regionid=d.dvcode")] :results))
;    (exec-raw [(str "select *
;                        from (select u.*, rownum rn
;                                from (" sql ") u
;                               where rownum <= " end ") where rn >=" start)] :results)
;  ))


(defn get-results-bysql[totalsql]
  (exec-raw [totalsql []] :results))

(defn getall-results [start end sql]
  (let [sql (str "SELECT * FROM
(SELECT A.*, ROWNUM RN FROM
("sql") A
  WHERE ROWNUM <= " end ")
 WHERE RN >= " start)]
    (exec-raw [sql []] :results)))

(defn get-user-by-id [id]
  (with-db dboracle
    (exec-raw [(str "select u.*,d.totalname from xt_user u,division d where u.userid = '"
                 id "' and u.regionid=d.dvcode")] :results)))

(defn get-role [rolename]
  (with-db dboracle
    (exec-raw [(str "select * from xt_role where rolename like '" rolename "%'")] :results)))
(defn get-role-by-userid [userid]
  (with-db dboracle
    (exec-raw ["select r.*,ru.userid from xt_role r left join (select * from xt_roleuser where userid=?) ru on r.roleid=ru.roleid" [userid]] :results)))


(defn create-role [role]
  (let [f (conj role {:roleid (strs/replace (str (java.util.UUID/randomUUID)) "-" "")}) ]
    (insert xt_role
      (values f))))
(defn update-role [role roleid]
  (update xt_role
    (set-fields role)
    (where {:roleid roleid})))
(defn delete-role [roleid]
  (delete xt_role
    (where {:roleid roleid})))
(defn get-role-by-id [id]
  (with-db dboracle
    (exec-raw ["select * from xt_role where roleid=?" [id]] :results)))


(defn my-insert-role-func [roleid ids]
  (if (> (count ids) 0)
    (do (insert xt_rolefunc
          (values {:roleid roleid :functionid (first ids)}))
      (my-insert-role-func roleid (next ids)))
    ))
(defn my-insert-role-user [userid ids]
  (if (> (count ids) 0)
    (do (insert xt_roleuser
          (values {:userid userid :roleid (first ids)}))
      (my-insert-role-user userid (next ids)))
    ))

(defn save-grant [roleid ids]
  (delete xt_rolefunc
    (where {:roleid roleid}))
  (my-insert-role-func roleid (clojure.string/split ids #",")))
(defn save-role-user [userid ids]
  (delete xt_roleuser
    (where {:userid userid}))
  (my-insert-role-user userid (clojure.string/split ids #",")))

;;加载模块
(defn get-function []
  (with-db dboracle
    (exec-raw ["select * from xt_function  where nodetype = '1' and parent='dasffffffffffffffdsdsfs' order by orderno asc"] :results))
  )
(defn get-function-byuser [userid]
  (with-db dboracle
    (exec-raw ["select * from xt_function fc right join
       (select * from
         (select * from xt_user u left join xt_roleuser ru on u.userid=ru.userid where u.userid=?) ur
                 left join
                 xt_rolefunc rf on ur.roleid=rf.roleid) urf on fc.functionid=urf.functionid where nodetype='1' and fc.functionid='jfkdajklfajldjflsf' or fc.parent='dasffffffffffffffdsdsfs' order by orderno asc" [userid]] :results))
  )
(defn get-functionmenu [userid funcid]
  (with-db dboracle
    (exec-raw ["select f.* from xt_function f right join
       (select rf.functionid from xt_rolefunc rf where rf.roleid =(select ru.roleid from xt_user u
                         left join xt_roleuser ru on u.userid=ru.userid  where u.userid=?)) rfu
       on f.functionid=rfu.functionid where f.parent=? order by orderno asc" [userid funcid]] :results))
  )