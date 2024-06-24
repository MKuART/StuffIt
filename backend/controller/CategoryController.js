import "dotenv/config.js";
import Account from "../models/Account.js";
import Customer from "../models/Customer.js";
import Expenses from "../models/Expenses.js";
import Category from "../models/Category.js";
import { getModelData } from "./MainController.js";

export const AllCategorys = async (req, res, next) => {
  try {
    res.status(200).json(await Category.find());
  } catch (error) {
    error.status = 404;
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const account = await Account.findOne({ email: req.body.account });

    if (!account) {
      const message = `Du hast nicht die Rechte um eine Categorie zu erstellen!`;
      return res.status(404).json({ message });
    }

    if(account.category.length >= 24){
      const message = `Sie haben das Maximum von 24 Kategorien erreicht!`;
      return res.status(404).json({ message });
    }

    req.body.name = req.body.name.trim();
    if (req.body.name.length <= 0) {
      const message = `Bitte vergeben Sie einen Namen.`;
      return res.status(404).json({ message });
    }
    if (!account) {
      throw new Error(`Account nicht gefunden.`);
    }

    if (req.body.limitedBudget > account.budget) {
      const message = `Nicht genügend Budget vorhanden, minimiere den eingegebenen Wert.`;
      return res.status(404).json({ message });
    }

    if (req.body.limitedBudget < 0) {
      const message = `Verwenden Sie keine negativen Zahlen!`;
      return res.status(404).json({ message });
    }

    const newCategory = await Category.create(req.body);
    if (!newCategory) {
      const message = `Categorie konnte nicht erstellt werden!`;
      return res.status(404).json({ message });
    }

    await Account.findByIdAndUpdate(account._id, {
      $inc: { budget: -newCategory.limitedBudget },
      $push: { category: newCategory._id },
    });

    res.status(200).json(newCategory);
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
};

export const findCategory = async (req, res, next) => {
  try {
    const categoryIds = req.body;
    const foundCategories = await Category.find({
      _id: { $in: categoryIds },
      deleted: false,
    });
    res.status(200).json({ foundCategories });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {

    const foundCategory = await Category.findById(req.body._id);

    if (!foundCategory) {
      const error = new Error("Keine Kategorie gefunden!");
      error.statusCode = 404;
      throw error;
    }

    const user = await Account.findOne({ email: req.body.email });
    if (!user) {
     const message = "Du hast nicht die Rechte um eine Categorie zu ändern!"
    return res.status(404).json({message})
    }

    if (req.body.name) {
      foundCategory.name = req.body.name.trim();
    }

    if (req.body.budget || req.body.budget === 0) {
      const newBudget = req.body.budget;

      if (newBudget < 0) {
        const message = `Das Budget kann nicht negativ sein.`;
        return res.status(404).json({ message });
      }

      const difference = newBudget - foundCategory.limitedBudget;
      const remainingUserBudget = user.budget - difference;

      if (remainingUserBudget < 0) {
        const message = `Nicht genügend Budget vorhanden, minimiere den eingegebenen Wert.`;
        return res.status(404).json({ message });
      }

      foundCategory.limitedBudget = newBudget;
      await foundCategory.save();

      user.budget = remainingUserBudget;
      await user.save();
    }

    res.status(200).json({
      message: "Kategorie erfolgreich aktualisiert!",
      neueKategorie: foundCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const softDeleteCategory = async (req, res, next) => {
  try {
    const foundUser = await Category.findById(req.body._id);
    if (!foundUser) {
      const error = new Error("No category to delete!");
      error.statusCode = 404;
      return next(error);
    }

    if (foundUser.deleted === "true") {
      const error = new Error("account already deleted");
      error.statusCode = 404;
      return next(error);
    }

    foundUser.deleted = true;
    await Account.updateOne(foundUser);
    return res
      .clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .json({ message: "Category successfully deleted!" });
  } catch (error) {
    next(error);
  }
};

export const hardDeleteCategory = async (req, res, next) => {
  try {
    const foundCustomer = await Customer.findOne({ email: req.body.userEmail });
    if (foundCustomer) {
      const message = `Du hast dazu keine Rechte!`;
      return res.status(404).json({message})
    }
    const findCategory = await Category.findById(req.body._id);
    const findExpenses = await Expenses.find({ _id: { $in : findCategory.expense }});
    console.log(findExpenses);
     const expenseCosts = findExpenses.map((item) => item.cost);
    const totalExpenseMoney = expenseCosts.reduce(
      (total, cost) => total + cost,
      0
    );

     const addCategoryMoneyToExpenseCost =
      totalExpenseMoney + findCategory.limitedBudget;

      
    const user = await Account.findOne({email: req.body.userEmail});
    user.budget = user.budget + addCategoryMoneyToExpenseCost;

    await user.save();
    const deletedCategory = await Category.findByIdAndDelete(req.body);
    if (!deletedCategory) {
      const error = new Error("No category to delete!");
      error.statusCode = 404;
      return next(error);
    }
    return res
      .status(200)
      .json({ message: "Category deleted!", deletedCategory: deletedCategory });
  } catch (error) {
    next(error);
  }
};

export const getCategoryData = async (req, res, next) => {
  await getModelData(req, res, next, Category);
};
