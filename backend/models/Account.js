import { Schema, model } from "mongoose";

const Account = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    budget: { type: Number, default: 0 },
    maxBudget: {type: Number, default: 0},
    deleted: { type: String, default: false },
    customer: [{ type: Schema.Types.ObjectId, ref: "Customer" }],
    category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    expense: [{ type: Schema.Types.ObjectId, ref: "Expenses" }],
    role: { type: String, enum: ["User", "Admin"], default: "Admin" },
  },
  { versionKey: false, strictQuery: true }
);

Account.methods.toJSON = function() {
  const account = this.toObject();
  delete account.password;
  delete account._id;
  delete account.customer
  return account;
}

export default model("Account", Account, "Accounts");