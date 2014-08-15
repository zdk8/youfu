(ns newpension.models.db
  (:use korma.core
        [korma.db :only [defdb with-db]])
  (:import (java.sql Timestamp))
  (:require [pension.models.schema :as schema]))

(defdb dboracle schema/db-oracle)
(declare users olds oldsocrel functions audits rolefunc roleuser userlog)

(defentity users
  (pk :userid)
  (table :xt_user)
  (belongs-to roleuser {:fk :userid})
  (database dboracle))

(defentity olds
  (table :t_oldpeople)
  (database dboracle))

