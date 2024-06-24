import express from "express"
import { AllCustomers, accountDeleteCustomer, createCustomer, customerLogin, findCustomer, getCustomerData, hardDeleteCustomer, softDeleteCustomer, updateCustomer } from "../controller/CustomerController.js";
import { authorize } from "../controller/MainController.js";
import { customerValidator, customerUpdateValidator, validateRequest } from "../middlewares/validator/customerValidator.js";
const router = express.Router()


router
.route("/", authorize(["Admin"]))
.post(AllCustomers)

router
.route("/findById", authorize(["Admin", "User"]))
.post(findCustomer)

router
.route("/create", authorize(["Admin"]))
.post(customerValidator, validateRequest, createCustomer)

router
.route("/login")
.post(customerLogin)

router
.route("/update", authorize(["User"]))
.patch(customerUpdateValidator(["firstname", "lastname", "email", "password"]), validateRequest, updateCustomer)

router
.route("/delete", authorize(["User"]))
.delete(hardDeleteCustomer)

router
.route("/customer-delete", authorize(["Admin"]))
.delete(accountDeleteCustomer)

router.route("/get-data").post(getCustomerData);

export default router;