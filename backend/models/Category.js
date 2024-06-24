import { Schema, model } from "mongoose";
//import ExpensesSchema from "./Expenses.js";

const Category = new Schema(
  {
    name: {type: String, default: "N/A"},
    icon: {type: String},
    limitedBudget: {type: Number, default: 0},
    expense: [{type: Schema.Types.ObjectId, ref: "Expenses"}]
  },
  { versionKey: false, strictQuery: true }
);

Category.methods.toJSON = function() {
  const category = this.toObject();
  delete category.account;
  return category;
}

export default model("Category", Category, "Categorys");