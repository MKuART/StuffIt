import "dotenv/config.js";
import Account from "../models/Account.js";
import Expenses from "../models/Expenses.js";
import {
  comparePassword,
  hashPassword,
} from "../middlewares/password/hashPassword.js";
import jwt from "jsonwebtoken";
import { AllModels, findModels, loginUser } from "./MainController.js";
import Category from "../models/Category.js";
import Customer from "../models/Customer.js";
import {
  AccountDeleteCustomerEmail,
  AccountDeleteEmail,
  updateEmail,
  welcomeEmail,
} from "../helpers/nodemailer.js";

export const createAccount = async (req, res, next) => {
  try {
    if (!req.body.firstname) {
      const message = "Vorname fehlt!";
      return res.status(404).json({ message });
    }

    if (!req.body.lastname) {
      const message = "Nachname fehlt!";
      return res.status(404).json({ message });
    }

    if (!req.body.email) {
      const message = "Email-Adresse wird benötigt!";
      return res.status(404).json({ message });
    }

    if (!req.body.password) {
      const message = "Passwort wird benötigt!";
      return res.status(404).json({ message });
    }

    if (req.body.repeatPassword !== req.body.password) {
      const message = "Passwort stimmt nicht überein!";
      return res.status(404).json({ message });
    }

    if (
      (await Account.findOne({ email: req.body.email })) ||
      (await Customer.findOne({ email: req.body.email }))
    ) {
      const message = "Email existiert bereits!";
      return res.status(404).json({ message });
    }

    if (req.body.repeatPassword) {
      delete req.body.repeatPassword;
    }
    req.body.password = await hashPassword(req.body.password);

    req.body.maxBudget = req.body.budget;

    welcomeEmail(req.body.email);

    res.status(200).json(await Account.create(req.body));
  } catch (error) {
    error.status = 404;
    next(error);
  }
};

export const deleteReference = async (req, res, next) => {
  try {
    const userEmail = req.body.userEmail;
    const categoryIdToRemove = req.body.categoryIdToRemove;
    const expensesIdToRemove = req.body.expensesIdToRemove;
    const updatedAccount = await Account.findOneAndUpdate(
      { email: userEmail },
      {
        $pull: {
          category: categoryIdToRemove,
          expense: { $in: expensesIdToRemove },
        },
      },
      { new: true, runValidators: true }
    );

    const removeExpenses = await Expenses.deleteMany({
      _id: { $in: expensesIdToRemove },
    });

    if (!updatedAccount) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({
      message: "Category and associated expenses deleted!",
      updatedAccount: updatedAccount,
      removeExpenses: removeExpenses,
    });
  } catch (err) {
    next(err);
  }
};

export const updateAccount = async (req, res, next) => {
  try {
    const email = req.body.account;
    const updateData = req.body;
    const foundUser = await Account.findOne({ email: email });
    const customerArray = foundUser.customer;

    const passwordCompare = await comparePassword(
      req.body.passwordReload,
      foundUser.password
    );

    if (!passwordCompare) {
      const message = `
       Geben Sie das richtige Passwort ein, 
       um Ihre Änderungen zu speichern!`;
      return res.status(404).json({ message });
    }

    if (!foundUser) {
      const error = new Error("Account not found!");
      error.statusCode = 404;
      throw error;
    }

    if (updateAccount.email) {
      if (
        (await Account.findOne({ email: updateData.email })) ||
        (await Customer.findOne({ email: foundUser.email }))
      ) {
        const message = "Email wurde schon vergeben!";
        return res.status(404).json({ message });
      }
    }

    updateData.firstname = updateData.firstname.trim();
    updateData.lastname = updateData.lastname.trim();
    updateData.email = updateData.email.trim();
    updateData.password = updateData.password.trim();

    if (updateData.firstname) {
      foundUser.firstname = updateData.firstname.trim();
    }

    if (updateData.lastname) {
      foundUser.lastname = updateData.lastname.trim();
    }

    if (updateData.email) {
      foundUser.email = updateData.email;
      const foundCustomers = await Customer.find({
        _id: { $in: customerArray },
      });
      if (foundCustomers.length > 0) {
        for (const customer of foundCustomers) {
          customer.account = updateData.email;
          await customer.save();
        }
      }
      updateEmail(foundUser.email);
    }

    updateData.password = updateData.password.trim();

    if (updateData.password.length > 0) {
      updateData.password = await hashPassword(updateData.password);
      foundUser.password = updateData.password;
    }

    if (updateData.budget) {
      if (updateData.budget < 0) {
        const message = "Neuer Betrag darf nicht unter 0 Euro sein!";
        return res.status(404).json({ message });
      }
      foundUser.budget = updateData.budget;
      foundUser.maxBudget = updateData.budget;
    }

    await foundUser.save();

    res.status(200).json(foundUser);
  } catch (error) {
    error.status = 404;
    next(error);
  }
};

export const softDeleteAccount = async (req, res, next) => {
  try {
    const foundUser = await Account.findById(req.body._id);
    if (!foundUser) {
      const error = new Error("No account to delete!");
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
      .json({ message: "Account successfully deleted!" });
  } catch (error) {
    next(error);
  }
};

export const getAccountData = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      const error = new Error("Token not found");
      error.statusCode = 401;
      throw error;
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;
    const account = await Account.findOne({ _id: userId });
    if (!account) {
      const error = new Error("Account not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ account });
  } catch (error) {
    next(error);
  }
};

export const hardDeleteAccount = async (req, res, next) => {
  try {
    const foundAccount = await Account.findOne({ email: req.body.email });

    const passwordCompare = await comparePassword(
      req.body.isPassword,
      foundAccount.password
    );

    if (!passwordCompare) {
      const message =
        "Geben Sie das richtige Passwort ein, um Ihren Account zu löschen!";
      return res.status(404).json({ message });
    }

    const foundCustomer = await Customer.find({
      _id: { $in: foundAccount.customer },
    });
    const customerIds = foundCustomer.map((customer) => customer._id);

    const foundCategories = await Category.find({
      _id: { $in: foundAccount.category },
    });
    const categoryIds = foundCategories.map((category) => category._id);

    const foundExpenses = await Expenses.find({
      _id: { $in: foundAccount.expense },
    });
    const expenseIds = foundExpenses.map((expense) => expense._id);

    const accountEmail = foundAccount.email;

    foundCustomer.map((item) => AccountDeleteCustomerEmail(item.email));
    AccountDeleteEmail(accountEmail);
    await Expenses.deleteMany({ _id: { $in: expenseIds } });
    await Category.deleteMany({ _id: { $in: categoryIds } });
    await Customer.deleteMany({ _id: { $in: customerIds } });

    await Account.deleteOne(foundAccount._id);

    res.status(200).json({ message: "Your account is now deleted!" });
  } catch (error) {
    next(error);
  }
};

export const AllAccounts = async (req, res, next) => {
  await AllModels(req, res, next, Account);
};

export const findAccount = async (req, res, next) => {
  await findModels(req, res, next, Account);
};

export const accountLogin = async (req, res, next) => {
  await loginUser(req, res, next, Account);
};
