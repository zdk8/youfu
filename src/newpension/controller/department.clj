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
               [noir.session :as session]
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
       dep_id (str (:depid (session/get :usermsg)))
       {departname :departname}params
       {page :page}params
       {rows :rows}params
        depidcond (if (> (count dep_id) 0) (str " and dep_id = " dep_id ))
        cond (str " and deptype = '" deptype "' "  (common/likecond "departname" departname) depidcond)
        getresult (common/fenye rows page t_pensiondepartment "*" cond "")
       ]
    (resp/json {:total (:total getresult) :rows (common/time-before-list (:rows getresult) "runtime")})))

(defn getall-department2 [request]
  (let[{params :params}request
       {deptype :deptype}params
       {departname :departname}params
       ;{page :page}params
       ;{rows :rows}params
       ;cond (str " and deptype = '" deptype "' "  (common/likecond "departname" departname))
       ;getresult (common/fenye rows page t_pensiondepartment "*" cond "")
       getdepartsql (str "select * from " t_pensiondepartment " where deptype = '" deptype "' " (common/likecond "departname" departname))
       ]
    ;(resp/json {:total (:total getresult) :rows (common/time-before-list (:rows getresult) "runtime")})
    (println "DDDDDDDDD" getdepartsql)
    (resp/json(db/get-results-bysql  getdepartsql))))


(defn get-departbyid [request]
  (let[{params :params}request
       {dep_id :dep_id}params]
    (resp/json (db/get-departbyid dep_id))))

(defn get-departmentbyname  [request]
  (let[params (:params request)
       mapguid (:mapguid params)
       departdata (first(db/get-departbyname mapguid))
       dep_id (:dep_id departdata)
       opsum (first(db/get-results-bysql (str "SELECT COUNT(*) as opsum  FROM T_OLDPEOPLEDEP WHERE dep_id = " dep_id)))
       ]
    (resp/json (conj [] (conj departdata opsum)))))

(defn get-opbydepid [request]
  (let[params (:params request)
       dep_id (:dep_id params)
       rows (:rows params)
       page (:page params)
       mykey (:mykey params)
       searchcond (if (> (count mykey) 0) (str " and (NAME LIKE '%" mykey "%' OR address LIKE '%" mykey "%')"))
       cond (str " and dep_id = " dep_id  searchcond)
       getresult (common/fenye rows page t_oldpeopledep "*" cond " order by opd_id desc ")]
    (resp/json {:iTotalRecords (:total getresult) :iTotalDisplayRecords (:total getresult) :rows (:rows getresult)})))

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
        olddata (conj request {:params (conj params {:datatype "j"})})]
    (println "DDDDDDD"  (select-keys params deppeople))
    (if (<= (count checkop) 0) (let[opdate (select-keys params oldpeople)]   (old/create-old olddata)))                 ;判断老年表是否存在，不存在添加数据到老年表
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
    (str "true")))

(defn select-opdofdepart [request]
  (let[{params :params}request
       {name :name}params
       {identityid :identityid}params
       {departname :departname}params
       {deptype :deptype}params
       minage (:minage params)
       maxage (:maxage params)
       datatype (:datatype params)
       dep_id (str (:depid (session/get :usermsg)))
       {page :page}params
       {rows :rows}params
       minagecond (if (> (count minage) 0)  (str " and age > " minage  ))
       maxagecond (if (> (count maxage) 0)  (str " and age <= " maxage ))
       typecond (if (> (count datatype) 0)  (str " and type = '" datatype "'"))
       depidcond (if (> (count dep_id) 0) (str "and dep_id = " dep_id))
       cond (str " and deptype = '" deptype "' " (common/likecond "name" name)  (common/likecond "identityid" identityid)  (common/likecond "departname" departname)  minagecond maxagecond typecond depidcond)           ;" and checkouttime is null"
       getresult (common/fenye rows page "t_oldpeopledep" "*" cond " order by opd_id desc")]
    (resp/json {:total (:total getresult) :rows (common/time-before-list (:rows getresult) "checkintime")})))

(defn oldepartreport [request]
  (let[params (:params request)
       colsfield (:colsfield params)
       datatype (:datatype params)
       departname (:departname params)
       identityid (:identityid params)
       name (:name params)
       cond (str " deptype = '" datatype "' " (common/likecond "name" name)  (common/likecond "identityid" identityid)  (common/likecond "departname" departname))
       resultsql (str "select " colsfield " from " t_oldpeopledep " where " cond)
       ]
    (common/time-before-list (db/get-results-bysql resultsql) "checkintime")))

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
;    (resp/json {:success true :message "add canteen success"})
    (str "true")
    ))

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
;    (resp/json {:success true :message "update canteen success"})
    (str "true")
    ))

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


;;机构统计

(defn depart-dmstatis [params]
  (let[districtid (:districtid params)
       length (if(=(count districtid)6) 9 12)
       ]
    (if (> (count districtid) 9)
      (str "SELECT s.districtid,s.opsum,dv.dvname FROM division dv,
(SELECT districtid,SUM(opsum) AS opsum FROM
(SELECT d.dvcode AS districtid,0 opsum FROM division d WHERE d.dvcode = '" districtid "'
UNION ALL
SELECT districtid,COUNT(*) AS opsum FROM " t_oldpeopledep " WHERE districtid = '" districtid "' GROUP BY districtid )
GROUP BY districtid) s
WHERE s.districtid = dv.dvcode ORDER BY s.districtid")
      (str "SELECT s.districtid,s.opsum,dv.dvname FROM division dv,
(SELECT districtid,SUM(opsum) AS opsum FROM
(SELECT d.dvcode AS districtid,0 opsum FROM division d WHERE d.dvhigh = '" districtid "'
UNION ALL
SELECT substr(districtid,0," length ") AS districtid ,COUNT(*) AS opsum FROM " t_oldpeopledep " WHERE districtid like '" districtid "%'  GROUP BY substr(districtid,0," length "))
GROUP BY districtid) s
WHERE s.districtid = dv.dvcode ORDER BY s.districtid"))))

(defn depart-xbstatis [params]
  (let[districtid (:districtid params)
       districtcond (if (> (count districtid) 0)  (str " and districtid LIKE '" districtid "%'"))
       ]
    (str "SELECT (case sex   when '1' then '男' when '0' then '女'  else '空'   END) AS sex,COUNT(*) AS opsum FROM " t_oldpeopledep "
    WHERE 1=1 " districtcond "  GROUP BY sex")))


(defn depart-sjstatis [params]
  (let[districtid (:districtid params)
       checkstatus (:checkstatus params)
       field  (condp = checkstatus
                "in"      "checkintime"
                "out"      "checkouttime"
                 "nowin"     "checkintime" )
       checkcond  (if (= checkstatus "nowin") (str " and checkouttime is null"))
       timfun      (:timfun params)
       typetime   (:typetime params)
       starttime   (:starttime params)
       endtime    (:endtime params)]
    (condp = timfun
      "yyyy" (str "SELECT to_char(" field ",'yyyy') AS tname,count(*) AS tsum FROM " t_oldpeopledep " where districtid like '" districtid "%' " checkcond "  GROUP BY to_char(" field ",'yyyy') ORDER BY to_number(to_char(" field ",'yyyy')) ASC")
      "Q"     (str "SELECT CONCAT('" typetime "-',to_char(" field ",'Q')) AS tname,count(*) AS tsum FROM " t_oldpeopledep " where  districtid  like '" districtid "%' " checkcond " and  to_char(" field ",'yyyy') = '" typetime "'  GROUP BY to_char(" field ",'Q') ORDER BY to_number(to_char(" field ",'Q')) ASC")
      "mm"  (str "SELECT CONCAT('" typetime "-',to_char(" field ",'mm')) AS tname,count(*) AS tsum FROM " t_oldpeopledep " where  districtid  like '" districtid "%' " checkcond " and   to_char(" field ",'yyyy') = '" typetime "' GROUP BY to_char(" field ",'mm') ORDER BY to_number(to_char(" field ",'mm')) ASC")
      "md"   (str "SELECT to_char(" field ",'yyyy-mm-dd') AS tname,count(*)  AS tsum  FROM " t_oldpeopledep " where  districtid  like '" districtid "%' " checkcond " and   to_char(" field ",'yyyy-mm') = '" typetime "'  GROUP BY to_char(" field ",'yyyy-mm-dd') ORDER BY to_date(to_char(" field ",'yyyy-mm-dd'),'yyyy-mm-dd') ASC")
      "dd"    (str "SELECT to_char(" field ",'yyyy-mm-dd') AS tname,count(*) AS tsum  FROM " t_oldpeopledep " where  districtid  like '" districtid "%' " checkcond " and   " field " between to_date('" starttime "','yyyy-mm-dd') and to_date('" endtime "','yyyy-mm-dd')  GROUP BY to_char(" field ",'yyyy-mm-dd') ORDER BY to_date(to_char(" field ",'yyyy-mm-dd'),'yyyy-mm-dd') ASC")
      )))
(defn depart-statistic [request]
  (let[params (:params request)
       statistype (:statistype params)
       departstatis-sql (condp = statistype
                               "dm" (depart-dmstatis params)
                               "sj"   (depart-sjstatis params)
                               "xb" (depart-xbstatis params))]
    ))

(defn depart-statistic2 [request]
  (let[params (:params request)
       datetp (:datetype params)
       datetype (if (= (count datetp) 0)  "CHECKINTIME" datetp)
       starttime (:starttime params)
       endtime (:endtime params)
       districtid (:districtid params)
       gender (:gender params)
       type (:type params)
       dlength (count districtid)
       sj (:sj params)
       dq (:dq params)
       xb (:xb params)
       lx (:lx params)
       rows (:rows params)
       page (:page params)
       starttimecond   (if (> (count starttime) 0) (str " and " datetype " >= to_date('" starttime "','yyyy-mm-dd') ")  )
       endtimecond   (if (> (count endtime) 0) (str " and " datetype " <= to_date('" endtime "','yyyy-mm-dd') " ) )
       districtidcond (if (> (count districtid) 0) (str " and districtid like '" districtid "%' ")  )
       gendercond (if (> (count gender) 0 ) (str " and sex = '" gender "' ") )
       typecond (if (> (count type) 0 ) (str " and type = '" type "' ") )
       tjconds (str starttimecond endtimecond  districtidcond gendercond typecond)            ;分组查询条件
       sjgroup (condp = sj                                                                                    ;时间分组
                 "Y"      (str " to_char(" datetype ",'yyyy') ")
                 "Q"      (str " CONCAT(to_char(" datetype ",'yyyy'),to_char(" datetype ",'Q')) ")
                 "M"     (str " CONCAT(to_char(" datetype ",'yyyy'),to_char(" datetype ",'mm')) ")
                 "D"       (str " to_char(" datetype ",'yyyy-mm-dd') ")
                 nil       )
       dqgroup (if (= dq "dq") (condp = dlength                                                   ;地区分组
                                 6   (str " substr(districtid,0,9) ")
                                 9   (str " substr(districtid,0,12) ")
                                 12   " substr(districtid,0,12)  "
                                 nil))

       xbgroup (if (= xb "xb") (str " (case sex   when '1' then '男' when '0' then '女'  else '空'   END) ")   nil)                   ;性别分组
       lxgroup  (if (= lx "lx") (str " (case type   when '2' then '农村五保' when '3' then '城镇三无' when '4' then '其他'  else '空'   END) ") nil)
       groups (str (if sjgroup (str sjgroup ",")) (if dqgroup (str dqgroup ",")) (if xbgroup (str xbgroup ","))(if lxgroup (str lxgroup ",")))                            ;组合分组
       groupwith (if (> (count groups) 0) (subs groups 0 (dec(count groups)))  (str " substr(districtid,0,6) "))
       opstatissql (str "SELECT s.*,dv.dvname FROM (select " (if sjgroup sjgroup "null") " as operator ," (if dqgroup dqgroup (if (>(count districtid)0) districtid "330424") ) " as districtid, " (if xbgroup xbgroup "null") " as gender," (if lxgroup lxgroup "null") " as type,count(*) as opsum
                                from " t_oldpeopledep " where 1=1 " tjconds " group by " groupwith ") s LEFT JOIN division dv ON s.districtid = dv.dvcode")]
    (println "SSSSSSSSSSSSSS" opstatissql)
    (resp/json (common/fenye rows page (str "(" opstatissql ")") "*" ""  ""))))


(defn depart-statistic3 [request]
  (let[params (:params request)
       minage (:minage params)
       maxage (:maxage params)
       districtid (:districtid params)
       gender (:gender params)
       datatype (:datatype params)
       departname (:departname params)
       dlength (count districtid)
       nl (:nl params)
       dq (:dq params)
       xb (:xb params)
       lb (:lb params)
       jg (:jg params)
       rows (:rows params)
       page (:page params)
       minagecond (if (> (count minage) 0) (str " and age > " minage)  )
       maxagecond   (if (> (count maxage) 0) (str " and age <= " maxage)  )
       ;starttimecond   (if (> (count starttime) 0) (str " and OPERATOR_DATE >= to_date('" starttime "','yyyy-mm-dd') ")  )
       ;endtimecond   (if (> (count endtime) 0) (str " and OPERATOR_DATE <= to_date('" endtime "','yyyy-mm-dd') " ) )
       districtidcond (if (> (count districtid) 0) (str " and districtid like '" districtid "%' ")  )
       gendercond (if (> (count gender) 0 ) (str " and sex = '" gender "' ") )
       datatypecond (if (> (count datatype) 0 )   (str " and type = '" datatype "' "))
       departcond (if (> (count departname) 0) (str " and departname = '" departname "'"))
       tjconds (str minagecond maxagecond  districtidcond gendercond datatypecond departcond)            ;分组查询条件
       agevalue (cond
                  (and  (> (count minage) 0) (> (count maxage) 0))  (str  minage "-"maxage"岁")
                  (and (> (count minage) 0) (= (count maxage) 0))  (str minage "岁以上")
                  (and (= (count minage) 0) (> (count maxage) 0))  (str maxage "岁以下"))
       gendervalue (cond
                     (= gender "0")  "女"
                     (= gender "1")  "男")
       typevalue (cond
                   (= datatype "2") "农村五保"
                   (= datatype "3") "城镇三无"
                   (= datatype "4")  "其他")
       agegroup (if (and (= nl "nl") (= (count minage) 0)  (= (count maxage) 0))
                  (str " (CASE WHEN age <= 60 THEN '60岁以下'
	                                    WHEN age > 60 AND age <= 70 THEN '60-70岁'
	                                    WHEN age > 70 AND age<= 80 THEN '70-80岁'
	                                    WHEN age > 80 AND age <= 90 THEN '80-90岁'
	                                    WHEN age > 90 THEN '90岁以上'
	                                     ELSE '年龄未知' END)" ))
       dqgroup (if (= dq "dq") (condp = dlength                                                   ;地区分组
                                 6   (str " substr(districtid,0,9) ")
                                 9   (str " substr(districtid,0,12) ")
                                 12   " substr(districtid,0,12)  "
                                 nil))
       xbgroup (if (= xb "xb") (str " (case sex   when '1' then '男' when '0' then '女'  else '空'   END) ")   nil)                   ;性别分组
       lbgroup (if (= lb "lb") (str " (case type   when '2' then '农村五保' when '3' then '城镇三无' when '4' then '其他' else '未划分'   END)  "))
       jggroup (if (= jg "jg") (str " departname "))
       groups (str (if agegroup (str agegroup ",")) (if dqgroup (str dqgroup ",")) (if xbgroup (str xbgroup ",")) (if lbgroup (str lbgroup ",")) (if jggroup (str jggroup ",")))                            ;组合分组
       groupwith (if (> (count groups) 0) (subs groups 0 (dec(count groups)))  (str " substr(districtid,0,6) "))
       opstatissql (str "SELECT s.*,dv.dvname FROM (select " (if agegroup agegroup (str " '" agevalue "' ")) " as agevalue ," (if dqgroup dqgroup (if (>(count districtid)0) districtid "330424") ) " as districtid, " (if xbgroup xbgroup (str " '" gendervalue "' ")) " as gender, " (if lbgroup lbgroup (str " '" typevalue "' ")) " as oldtype," (if jggroup jggroup (str " '" departname "' ")) " as departname, count(*) as opsum
                                from " t_oldpeopledep " where 1=1 " tjconds " group by " groupwith ") s LEFT JOIN division dv ON s.districtid = dv.dvcode")]
    (println  "SSSSSSSSSSSSSS" opstatissql)
    (resp/json (common/fenye rows page (str "(" opstatissql ")") "*" ""  ""))
    ) )


(defn get-odp-signdata [request]
  (let[params (:params request)
       dep_id (str (:depid (session/get :usermsg)))
       name   (:name params)
       identityid   (:identityid params)
       rows (:rows params)
       page (:page params)
       conddepart (if (> (count dep_id) 0) (str " and dep_id = " dep_id)  "")
       searchcond (str (common/likecond "name" name) (common/likecond "identityid" identityid))
       getsql (str "select '0' as warn ,sign.* from
(select o.*,s.os_id,s.signdate from
(select t.*  from t_oldpeopledep t where checkouttime is null " conddepart ") o
left join (select * from t_oldsign where trunc(signdate)=trunc(sysdate)) s
on o.opd_id = s.opd_id)  sign
where opd_id in (select opd_id from t_oldsign where signdate >= trunc(sysdate - 2) )
union all
select '1' as warn ,sign.* from
(select o.*,s.os_id,s.signdate from
(select t.*  from t_oldpeopledep t where checkouttime is null " conddepart ") o
left join (select * from t_oldsign where trunc(signdate)=trunc(sysdate)) s
on o.opd_id = s.opd_id)  sign
where opd_id not in (select opd_id from t_oldsign where signdate >= trunc(sysdate - 2) )")
       signdatas (common/fenye rows page (str "(" getsql ")") "*" searchcond "" )]
    ;(println (str (:depid (session/get :usermsg))))
    (resp/json {:total (:total signdatas) :rows (common/time-before-list (:rows signdatas) "checkintime")})
    ;(str "ddddd")
    ))

(defn oldsign [request]
  (let[params (:params request)
       opd_id (:opd_id params)
       signdata {:opd_id opd_id :signdate (common/get-nowtime)}]
    (db/opdsign signdata)
    (str "success")))

(defn opddesigncancle [request]
  (let[params (:params request)
       os_id (:os_id params)]
    (db/delete-opd os_id)
    (str "success")))

(defn opd-design-all [request]
  (let[params (:params request)
       dep_id (:dep_id params)
       depcond (if (> (count dep_id) 0) (str " and dep_id = " dep_id))
       signall-sql (str "INSERT INTO T_OLDSIGN(opd_id,signdate)
SELECT opd_id,SYSDATE AS signdate FROM  T_OLDPEOPLEDEP WHERE  opd_id NOT IN
(SELECT opd_id FROM T_OLDSIGN WHERE trunc(signdate) = trunc(SYSDATE) )  " depcond " and checkouttime is null ")]
    (db/insert-results-bysql signall-sql)
    (str "success")))

(defn opd-select-design [request]
  (let[params (:params request)
       opd_ids(:os_id params)
       signdata (map #(zipmap [:signdate :opd_id ] (conj % (common/get-nowtime) )) (partition 1 1 opd_ids))]
    (println signdata)
    (db/select-opdsign signdata)
    (str "success")))

(defn add-carecenter
  "新增照料中心"
  [request]
  (let[params (:params request)
       caredata (select-keys params (:carecenter common/selectcols))
       ]
    (db/adddata-by-tablename "t_carecenter" (common/dateformat-bf-insert caredata "runtime"))
    (str "success")))

(defn get-carecenter-list
  "获取照料中心列表"
  [request]
  (let [params (:params request)
        name (:name params)
        page (:page params)
        rows (:rows params)
        conds (str (common/likecond "name" name))
        getresult (common/fenye rows page "t_carecenter" "*" conds "")]
    (resp/json {:total (:total getresult) :rows (common/dateymd-bf-list (:rows getresult) "runtime")})))

(defn update-carecenter [request]
  (let [params (:params request)
        zl_id (:zl_id params)
        zldata (select-keys params (:carecenter common/selectcols))
        ]
    (db/updatedata-by-tablename "t_carecenter" (common/dateformat-bf-insert zldata "runtime")  {:zl_id zl_id})
    (str "success")))

(defn add-carepeople
  "为照料中心添加照料人员"
  [request]
  (let [params (:params request)
        cpdata (select-keys params (:carepeople common/selectcols))]
    (db/adddata-by-tablename "t_carepeople" cpdata)
    (str "success")))

(defn get-carepeople-list [request]
  (let [params (:params request)
        name (:name params)
        zl_id (:zl_id params)
        page (:page params)
        rows (:rows params)
        conds (str (common/likecond "name" name) (if (> (count zl_id) 0) (str " and zl_id = " zl_id)) )
        getresult (common/fenye rows page "t_carepeople" "*" conds "")]
    (resp/json {:total (:total getresult) :rows (:rows getresult)})))

(defn update-carepeople [request]
  (let [params (:params request)
        cp_id (:cp_id params)
        cpdata (select-keys params (:carepeople common/selectcols))
        ]
    (db/updatedata-by-tablename "t_carepeople" cpdata {:cp_id cp_id})
    (str "success")))

(defn add-careworker
  "为照料中心添加工作人员"
  [request]
  (let [params (:params request)
        cwdata (select-keys params (:careworker common/selectcols))]
    (db/adddata-by-tablename "t_careworker" cwdata)
    (str "success")))

(defn get-careworker-list [request]
  (let [params (:params request)
        zl_name (:zl_name params)
        zl_id (:zl_id params)
        page (:page params)
        rows (:rows params)
        conds (str (common/likecond "zl_name" zl_name) (if (> (count zl_id) 0) (str " and zl_id = " zl_id)) )
        getresult (common/fenye rows page "t_careworker" "*" conds "")]
    (resp/json {:total (:total getresult) :rows (:rows getresult)})))

(defn update-careworker [request]
  (let [params (:params request)
        cw_id (:cw_id params)
        cwdata (select-keys params (:careworker common/selectcols) )]
    (db/updatedata-by-tablename "t_careworker" cwdata {:cw_id cw_id})
    (str "success")))

(defn add-bigevent
  "新增大型活动"
  [request]
  (let [params (:params request)
        bedata (select-keys params (:bigevent common/selectcols))]
    (db/adddata-by-tablename "t_bigevent" (common/dateformat-bf-insert bedata "starttime"))
    (str "success")))

(defn get-bigevent-list [request]
  (let [params (:params request)
        zl_id (:zl_id params)
        activityname (:activityname params)
        page (:page params)
        rows (:rows params)
        conds (str (common/likecond "activityname" activityname) (if (> (count zl_id) 0) (str " and zl_id = " zl_id)))
        getresult (common/fenye rows page "t_bigevent" "*" conds "")
        ]
    (resp/json {:total (:total getresult) :rows (common/dateymd-bf-list (:rows getresult) "starttime")})))

(defn update-bigevent [request]
  (let [params (:params request)
        be_id (:be_id params)
        bedata (select-keys params (:bigevent common/selectcols))]
    (db/updatedata-by-tablename "t_bigevent" (common/dateformat-bf-insert bedata "starttime")  {:be_id be_id})
    (str "success")))

(defn add-homevisit
  "新增上访记录"
  [request]
  (let [params (:params request)
        hvdata (select-keys params (:homevisit common/selectcols))]
    (db/adddata-by-tablename "t_bigevent" (common/dateformat-bf-insert hvdata "recordtime"))
    (str "success")))

(defn get-homevist-list [request]
  (let [params (:params request)
        zl_id (:zl_id params)
        page (:page params)
        rows (:rows params)
        conds (str (if (> (count zl_id) 0) (str " and zl_id = " zl_id)))
        getresult (common/fenye rows page "t_homevist" "*" conds "")
        ]
    (resp/json {:total (:total getresult) :rows (common/dateymd-bf-list (:rows getresult) "recordtime")})))

(defn update-homevisit [request]
  (let [params (:params request)
        hv_id (:hv_id params)
        hvdata (select-keys params (:homevisit common/selectcols))]
    (db/updatedata-by-tablename "t_homevisit" (common/dateformat-bf-insert hvdata "recordtime")  {:hv_id hv_id})
    (str "success")))

(defn add-departentry
  "机构出门登记"
  [request]
  (let [params (:params request)
        dedata (select-keys params (:departentry common/selectcols))]
    (db/adddata-by-tablename "departentry" (conj dedata {:outtime (common/get-nowtime)}))
    (str "success")))

(defn get-departentry-list [request]
  (let [params (:params request)
        dep_id (:dep_id params)
        opdname (:opdname params)
        rows (:rows params)
        page (:page params)
        conds (str (common/likecond "opdname" opdname) (if (> (count dep_id) 0) (str " and dep_id = " dep_id)))
        getresult (common/fenye rows page "t_departentry" "*" conds "")
        ]
    (resp/json {:total (:total getresult) :rows (common/dateymd-bf-list (:rows getresult) "intime" "outtime")})))





(defn testfun [request]
  (println (l/local-now))
  (println  (c/to-long  (l/local-now)))
  (println (str schema/datapath "upload/"))
  (resp/json {:result (str schema/datapath "upload/")}))
(defn mytest [id name]
  (resp/json {:success (str id "," name)}))