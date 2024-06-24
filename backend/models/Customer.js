import { Schema, model } from "mongoose";

const Customer = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    account: { type: String, ref: "Account" },
    role: { type: String, enum: ["User", "Admin"], default: "User" },
    deleted: { type: String, default: false },
  },
  { versionKey: false, strictQuery: true }
);


Customer.methods.toJSON = function() {
    const customer = this.toObject();
    delete customer.password;
    delete customer._id;
    // delete customer.role
    return customer;
  }

export default model("Customer", Customer, "Customers")