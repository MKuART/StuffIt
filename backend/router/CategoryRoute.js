import express from "express"
import { AllCategorys, createCategory, findCategory, hardDeleteCategory, softDeleteCategory, updateCategory } from "../controller/CategoryController.js"

import { authorize } from "../controller/MainController.js"

const router = express.Router()

router
.route("/")
.post(AllCategorys)

router
.route("/findById")
.post(findCategory)

router
.route("/create", authorize(["Admin"]))
.post(createCategory)

router
.route("/update", authorize(["Admin"]))
.patch(updateCategory)

router
.route("/hard-delete", authorize(["Admin"]))
.delete(hardDeleteCategory)

export default router;