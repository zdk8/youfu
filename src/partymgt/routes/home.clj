(ns partymgt.routes.home
  (:require [compojure.core :refer :all]
            [partymgt.layout :as layout]
            [partymgt.util :as util]

            [noir.session :as session]

            [clojure.data.json :as json]
            [partymgt.controller.manager :as mymngctrl]
            [ring.util.response :refer [redirect file-response]]
            [noir.response :as resp]
            ))

(defroutes home-routes
  (GET "/" [] (layout/render "index.html"))

  )
