(defproject shuangyong "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :dependencies [[org.clojure/clojure "1.6.0"]
                 [org.clojure/data.json "0.2.5"]
                 [lib-noir "0.8.4"]
                 [ring-server "0.3.1"]
                 [selmer "0.6.9"]
                 [com.taoensso/timbre "3.2.1"]
                 [com.taoensso/tower "2.0.2"]
                 [markdown-clj "0.9.47"]
                 [environ "0.5.0"]
                 [im.chit/cronj "1.0.1"]
                 [noir-exception "0.2.2"]
                 [com.oracle/ojdbc6 "11.2.0.3"]
                 [korma "0.3.1"]
                 ;;[clj-pdf "1.11.21"] clj-pdf依赖以下三个jar�?
                 [org.jfree/jfreechart "1.0.15"]
                 [com.lowagie/itext "4.2.1"]
                 [org.apache.xmlgraphics/batik-gvt "1.7"]
                 [me.raynes/fs "1.4.6"]               ;文件处理库
                 [org.apache.poi/poi "3.9"]
                 ;;[org.apache.poi/poi-ooxml "3.9"]  由于下载poi-ooxml及依赖jar不到的原�?暂停使用(在clj-excel.core)
                 [hvitmiddleware "0.1.6"]]

  :repl-options {:init-ns shuangyong.repl}
  :jvm-opts ["-Dfile.encoding=utf8"]
  :plugins [[lein-ring "0.8.10"]
            [lein-environ "0.5.0"]]
  :ring {:handler shuangyong.handler/app
         :init    shuangyong.handler/init
         :destroy shuangyong.handler/destroy}
  :profiles
  {:uberjar {:aot :all}
   :production {:ring {:open-browser? false
                       :stacktraces?  false
                       :auto-reload?  false}}
   :dev {:dependencies [[ring-mock "0.1.5"]
                        [ring/ring-devel "1.3.0"]
                        [pjstadig/humane-test-output "0.6.0"]]
         :injections [(require 'pjstadig.humane-test-output)
                      (pjstadig.humane-test-output/activate!)]
         :env {:dev true}}}
  :repositories [
                  ["java.net" "http://download.java.net/maven/2"]
                  ["nexus" "https://code.lds.org/nexus/content/groups/main-repo"]
                 ;; ["mymvn" "http://www.mvnrepository.com/artifact"]
                  ["sonatype" {:url "http://oss.sonatype.org/content/repositories/releases"
                               ;; If a repository contains releases only setting
                               ;; :snapshots to false will speed up dependencies.
                               :snapshots false
                               ;; Disable signing releases deployed to this repo.
                               ;; (Not recommended.)
                               :sign-releases false
                               ;; You can also set the policies for how to handle
                               ;; :checksum failures to :fail, :warn, or :ignore.
                               :checksum :fail
                               ;; How often should this repository be checked for
                               ;; snapshot updates? (:daily, :always, or :never)
                               :update :always
                               ;; You can also apply them to releases only:
                               :releases {:checksum :fail :update :always}}]

                  ]
;  :java-source-paths ["src/shuangyong/javaxls"]
  :min-lein-version "2.0.0")