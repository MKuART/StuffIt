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
import { Model } from "mongoose";

const secretKey = process.env.JWT_SECRET;

// All Models
export const AllModels = async (req, res, next, Model) => {
  try {
    res.status(200).json(await Model.findOne({email: req.body.email}));
  } catch (error) {
    error.status = 404;
    next(error);
  }
};
// All Models

// FindModels
export const findModels = async (req, res, next, Model) => {
  try {
    res
      .status(200)
      .json(await Model.findOne({email: req.body.email}));
  } catch (error) {
    next(error);
  }
};
// FindModels

// Log-In
export const loginUser = async (req, res, next, Model) => {
  try {
    const { email, password } = req.body;
    const searchEmail = await Model.findOne({ email });
    
    if (!searchEmail) {
      const message = "Email-Adresse wurde nicht gefunden!";
    return  res.status(404).json({message})
    }
    
    const passwordCompare = await comparePassword(
      password,
      searchEmail.password
    );
    if (!passwordCompare) {
      const message = "Passwort stimmt nicht!"
      res.status(404).json({message})
    }

    const token = issueJwt(searchEmail);
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({ searchEmail, token });
  } catch (error) {
    next(error);
  }
};
// Log-In

// Log-out
export const logout = async (req, res, next) => {
  try {
    res
      .clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .send("User logged out");
  } catch (error) {
    next(error);
  }
};
// Log-out

export const getModelData = async (req, res, next) => {
  const userId = req.user.id;
  const search = await Model.findOne({ _id: userId });
  res.status(200).send({ search });
};


// Log in Checker
export const isLoggedIn = async (req, res, next) => {
  const cookie = req.cookies.jwt;
  if (!cookie) {
    const error = new Error("Cookie not found!");
    error.statusCode = 404;
    return next(error);
  }
  return res.status(200).send({ message: "Cookie sent" });
};
// Log in Checker

// Authorize
export const authorize = (roles = []) => {
  return (req, res, next) => {
    const role = req.headers["authorization"];

    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).send("Access denied. No token provided.");
    }
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) return res.status(401).json({ error: "Invalid token." });

      if (!roles.includes(role))
        return res.status(404).json({ error: "Wrong role" });

      req.user = decoded;
      next();
    });
  };
};
// Authorize

// Reset-Buttom

export const resetButton = async(req, res, next) => {
  try{
    if(await Customer.findOne({email: req.body.email}) || req.body.role === "User"){
      const message = "Du bist nicht autorisiert!"
      res.status(402).json({ message })
    }

const newAccount = await Account.findOne({email: req.body.email})

    const passwordCompare = await comparePassword(
      req.body.isPassword,
      newAccount.password
    );

    if(!passwordCompare){
      const message = "Geben Sie das richtige Passwort ein, um Ihre Kategorien und Budget zu löschen!";
    return res.status(404).json({ message });
    }

    const foundCategory = await Category.find({_id: {$in: req.body.category}});
    const categoryIds = foundCategory.map(category => category._id);

    const foundExpenses = await Expenses.find({_id: {$in: req.body.expense}});
    const expensesIds = foundExpenses.map(expense => expense._id);

    console.log(categoryIds);    
    newAccount.budget = 0;
     newAccount.maxBudget = 0;
    newAccount.expense = []
    newAccount.category = []

    await Category.deleteMany({ _id: { $in: categoryIds } });
    await Expenses.deleteMany({ _id: { $in: expensesIds } });


     await newAccount.save()
    res.status(200).json({message: "test"})
  }catch(error){
  error.statusCode = 404;
    next(error)
  }
}

// Reset-Buttom