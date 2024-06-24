import "dotenv/config.js";
import Account from "../models/Account.js";
import Customer from "../models/Customer.js";
import Expenses from "../models/Expenses.js";
import Category from "../models/Category.js";
import {
  comparePassword,
  hashPassword,
} from "../middlewares/password/hashPassword.js";
import { issueJwt } from "../helpers/jwt.js";
import jwt from "jsonwebtoken";
import { AllModels, findModels, getModelData } from "./MainController.js";

export const AllExpenses = async (req, res, next) => {
  try {
    const category = await Category.findById(req.body.category);
    if(!category){
     return res.status(204).send()
    }
    res.status(200).json(await Expenses.find({ id: category.expense }));
  } catch (error) {
    error.status = 404;
    next(error);
  }
};

export const createExpenses = async (req, res, next) => {
  try {
    const category = await Category.findById(req.body.category);
    let foundAccount = await Account.findOne({ email: req.body.account });

    req.body.description = req.body.description.trim();

    if (req.body.description.length <= 0) {
      const message = `Beschreibung darf nicht leer sein!`;
      return res.status(404).json({ message });
    }
    if (req.body.cost > category.limitedBudget) {
      const message = `Nicht genügend Budget vorhanden, Ausgabe zu hoch!`;
      return res.status(404).json({ message });
    }

    if (req.body.cost < 0) {
      const message = `Verwenden Sie keine negativen Zahlen!`;
      return res.status(404).json({ message });
    }
    if (!foundAccount) {
      const foundCustomer = await Customer.findOne({ email: req.body.account });
      foundAccount = await Account.findOne({ email: foundCustomer.account });
    }

    const newExpense = await Expenses.create({
      description: req.body.description.trim(),
      cost: req.body.cost,
      category: category._id,
    });
    if (!newExpense) {
      const message = `Ausgabe konnte nicht erstellt werden!`;
      return res.status(404).json({ message });
    }

    if (!category) {
      const message = `Kategorie nicht gefunden!`;
      return res.status(404).json({ message });
    }

    await Category.updateMany(
      { _id: newExpense.category },
      { $inc: { limitedBudget: -newExpense.cost } }
    );

    await Category.updateMany(
      { _id: newExpense.category },
      { $push: { expense: newExpense._id } }
    );

    await foundAccount.updateOne({ $push: { expense: newExpense._id } });

    res.status(200).json(newExpense);
  } catch (error) {
    error.status = 404;
    next(error);
  }
};

export const findExpenses = async (req, res, next) => {
  await findModels(req, res, next, Expenses);
};

export const updateExpenses = async (req, res, next) => {
  try {
    const foundExpense = await Expenses.findById(req.body._id);
    if (!foundExpense) {
      const error = new Error("Unter-Kagetorie wurde nicht gefunden!");
      error.statusCode = 404;
      throw error;
    }

    const category = await Category.findById(foundExpense.category);
    if (!category) {
      const error = new Error("Kategorie wurde nicht gefunden!");
      error.statusCode = 404;
      throw error;
    }

    if (req.body.cost < 0) {
      const message = `Bitte verwenden Sie einen positiven Wert!`;
      return res.status(400).json({ message });
    }

    const oldCost = foundExpense.cost;
    const newCost = req.body.cost;

    const costDifference = newCost - oldCost;

    if (costDifference > 0) {

      if (costDifference > category.limitedBudget) {
        const message = `Ihr ausgewähltes Budget sprengt den Rahmen des Betrags! Minimieren Sie den Betrag!`;
        return res.status(400).json({ message });
      }
      category.limitedBudget -= costDifference; 
    } else {
     
      category.limitedBudget -= costDifference;
    }

    if(req.body.description){
      foundExpense.description = req.body.description;
    }
    
    if(req.body.cost){
      foundExpense.cost = req.body.cost;
    }
    

    await category.save();
    await foundExpense.save();

    res.status(200).json({
      message: "Expense successfully updated!",
      newExpense: foundExpense,
      updatedCategory: category,
    });
  } catch (error) {
    next(error);
  }
};


export const softDeleteExpenses = async (req, res, next) => {
  try {
    const foundUser = await Expenses.findById(req.body._id);
    if (!foundUser) {
      const error = new Error("No expenses to delete!");
      error.statusCode = 404;
      next(error);
    }

    if (foundUser.deleted === "true") {
      const error = new Error("account already deleted");
      error.statusCode = 404;
      next(error);
    }
    foundUser.deleted = true;
    await Account.updateOne(foundUser);
    res
      .clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .json({ message: "Expenses successfully deleted!" });
  } catch (error) {
    next(error);
  }
};

export const getExpensesData = async (req, res, next) => {
  await getModelData(req, res, next, Expenses);
};
