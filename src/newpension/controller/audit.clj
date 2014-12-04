(ns newpension.controller.audit
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
               [newpension.layout :as layout]))

(def apply [:name :identityid :gender :birthd :nation :culture :birthplace :marriage :live :economy :age :registration :address :postcode :telephone :mobilephone
            :agent :oprelation :agentaddr :agentphone :agentmobilephone :lr_id :ishandle])

(def t_jjylapply "t_jjylapply")


