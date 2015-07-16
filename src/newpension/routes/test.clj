(ns newpension.routes.test
  (:require [compojure.core :refer :all]
            [newpension.layout :as layout]
            [newpension.util :as util]
            [noir.session :as session]

            [clojure.data.json :as json]
            [ring.util.response :refer [redirect file-response]]
            [noir.response :as resp]
            )
  (:use [taoensso.timbre :only [trace debug info warn error fatal]])
  )

;;;上传测试
(def resource-path "resources/public/tmp/")

(defn file-path [path & [filename]]
  (java.net.URLDecoder/decode
    (str path java.io.File/separator filename)
    "utf-8"))

(defn upload-file
  "uploads a file to the target folder
   when :create-path? flag is set to true then the target path will be created"
  [path {:keys [tempfile size filename]}]
  (try
    (with-open [in (new java.io.FileInputStream tempfile)
                out (new java.io.FileOutputStream (file-path path filename))]
      (let [source (.getChannel in)
            dest   (.getChannel out)]
        (.transferFrom dest source 0 (.size source))
        (.flush out)))))

(defroutes test-routes
  ;;;上传测试
  (GET "/upload1" []
    (layout/render "upload.html"))
  (POST "/upload" [file]
    (upload-file resource-path file)
    ;    (str (:filename file))
    (resp/json {:filename (:filename file) :size (:size file)})
    ;    (redirect (str "/files/" (:filename file)))
    )
  (GET "/files/:filename" [filename]
    ;    (file-response (str resource-path filename))
    (str resource-path filename)
    )

  (GET "/info1" [] (info "hello"))


  )