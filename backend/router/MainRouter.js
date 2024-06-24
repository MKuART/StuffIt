import express from "express"
import CustomerRoute from "./CustomerRoute.js"
import AccountRoute from "./AccountRoute.js"
import ExpensesRoute from "./ExpensesRoute.js"
import CategoryRoute from "./CategoryRoute.js"

import { authorize, isLoggedIn, logout, resetButton } from "../controller/MainController.js"


const router = express.Router()

router

.use("/customer", CustomerRoute)

router
.use("/account", AccountRoute)

router
.use("/expenses", ExpensesRoute)

router
.use("/category", CategoryRoute)

router
.route("/check-cookie")
.get(isLoggedIn)

router
.route("/logout")
.post(logout)

router
.route("/reset", authorize(["Admin"]))
.delete(resetButton)


export default router;