(ns partymgt.models.schema)

(def datapath (str (System/getProperty "user.dir") "/"))

;;oracle 连接
(def db-oracle  {:classname "oracle.jdbc.OracleDriver"
                 :subprotocol "oracle"
;                 :subname "thin:@localhost:1521:orcl"
                 :subname "thin:@192.168.2.142:1521:orcl"
                 :user "pension_pinghu"
;                 :user "NEWPENSION"
                 :password "hvit"
                 :naming {:keys clojure.string/lower-case :fields clojure.string/upper-case}})





