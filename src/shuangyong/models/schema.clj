(ns shuangyong.models.schema)

(def datapath (str (System/getProperty "user.dir") "/"))

;;oracle 连接
(def db-oracle  {:classname "oracle.jdbc.OracleDriver"
                 :subprotocol "oracle"
                 :subname "thin:@192.168.2.142:1521:orcl"
                 :user "hy_shuangyong"
;                 :user "partybuild_hy"
                 :password "hvit"
                 :naming {:keys clojure.string/lower-case :fields clojure.string/upper-case}})





