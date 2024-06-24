import { Schema, model } from "mongoose";

const ExpensesSchema = new Schema(
  {
    description: { type: String, default: "N/A" },
    cost: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    deleted: { type: String, default: false },
    category: [{ type: Schema.Types.ObjectId,ref: "Category"}],
  },
  { versionKey: false, strictQuery: true }
);

ExpensesSchema.methods.toJSON = function() {
  const expense = this.toObject();
  delete expense.account;
  return expense;
}

export default model("Expense", ExpensesSchema, "Expenses");