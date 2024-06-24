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
import {
  AllModels,
  findModels,
  getModelData,
  loginUser,
} from "./MainController.js";
import { AccountDeleteCustomerEmail, AccountDeleteEmail, sendEmail, updateEmail } from "../helpers/nodemailer.js";

export const createCustomer = async (req, res, next) => {
  try {

    if(req.body.password !== req.body.repeatPassword){
      const message = "Passwort stimmt nicht überein!"
      return res.status(404).json({message})
    }

    const account = await Account.findOne({ email: req.body.account });

    if (!account) {
      throw new Error(`Account nicht gefunden.`);
    }

    if(!req.body.firstname){
      const message = "Vorname fehlt!"
      return res.status(404).json({message})
    }
    if(!req.body.lastname){
      const message = "Nachname fehlt!"
      return  res.status(404).json({message})
    }

    if(!req.body.email){
      const message = "Email-Adresse wird benötigt!"
      return res.status(404).json({message})
    }

    if(!req.body.password){
      const message = "Passwort wird benötigt!"
    return  res.status(404).json({message})
    }

    if(req.body.repeatPassword !== req.body.password){
      const message = "Passwort stimmt nicht überein!"
      res.status(404).json({message})
    }

    if(await Customer.findOne({email: req.body.email}) || await Account.findOne({email: req.body.email})){
      const message = "Email existiert bereits!"
      return res.status(404).json({message})
    }

    const user = req.body;
    const password = user.password;

    if (user.repeatPassword) {
      delete user.repeatPassword;
    }

    user.password = await hashPassword(user.password);

    const newCustomer = await Customer.create(req.body);

    await Account.updateOne(
      { email: account.email },
      { $push: { customer: newCustomer._id } }
    );

    user.password = password;

    sendEmail(user);

    res.status(200).json(newCustomer);
  } catch (error) {
    error.status = 404;
    next(error);
  }
};


export const updateCustomer = async (req, res, next) => {
  try {
    const email = req.body.account;
    const updateData = req.body
    const foundUser = await Customer.findOne({email: email});
    
    if (!foundUser) {
      const message = "Unterkonto nicht gefunden"
      return res.status(404).json({message})
    }

    const passwordCompare = await comparePassword(
      req.body.passwordReload,
      foundUser.password
    );

    if(!passwordCompare){
      const message = "Geben Sie das richtige Passwort ein, um Ihre Änderungen zu speichern!";
    return res.status(404).json({ message });
    }

    if (await Account.findOne({ email: updateData.email }) || await Customer.findOne({email: updateData.email})) {
      const message = "Email wurde schon vergeben!";
     return res.status(404).json({ message });
    }

    if (updateData.firstname) {
      foundUser.firstname = updateData.firstname;
    }
    if (updateData.lastname) {
      foundUser.lastname = updateData.lastname;
    }
    if (updateData.email) {
      foundUser.email = updateData.email;
      updateEmail(foundUser.email)
    }

    if (updateData.password.length > 0) {
      updateData.password = await hashPassword(updateData.password);
      foundUser.password = updateData.password;
    }

    await foundUser.save();

    
    res.status(200).json(foundUser
    );
  } catch (error) {
    error.status = 404;
    next(error);
  }
};

export const softDeleteCustomer = async (req, res, next) => {
  try {
    const foundUser = await Customer.findById(req.body._id);
    if (!foundUser) {
      const error = new Error("No customer to delete!");
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
      .json({ message: "Customer successfully deleted!" });
  } catch (error) {
    next(error);
  }
};

export const hardDeleteCustomer = async (req, res, next) => {
  try {
    
    const user = req.body;
    const foundCustomer = await Customer.findOne({email: user.email});
    if (!foundCustomer) {
      const message = "Unterkonto nicht gefunden"
      return res.status(404).json({message})
    }
    
    const email = foundCustomer.email
    const foundAccount = await Account.findOne({email: foundCustomer.account})
    
    await Customer.deleteOne(foundCustomer._id);
    await Account.findByIdAndUpdate(
      foundAccount._id,
      {
        $pull: {
          customer: foundCustomer._id,
        },
      },
      { new: true, runValidators: true }
    );
    AccountDeleteEmail(email)
    res.status(200).json({ message: "Account deleted!" });
  } catch (error) {
    next(error);
  }
};

export const accountDeleteCustomer = async (req, res, next) => {
  try {
    const user = req.body;

    const foundCustomer = await Customer.findOne({email: user.key});
    const email = foundCustomer.email;

    const passwordCompare = await comparePassword(
      req.body.isPassword,
      foundCustomer.password
    );

    if(!passwordCompare){
      const message = "Geben Sie das richtige Passwort ein, um Ihren Account zu löschen!";
    return res.status(404).json({ message });
    }

    if (!foundCustomer) {
     const message = "Unterkonte konnte nicht gefunden werden!"
     return res.status(404).json({message})
    }

    const foundAccount = await Account.findOne({account: user.account})
  
    await Customer.deleteOne({email: foundCustomer.email});
    await Account.findOneAndUpdate(
      {_id: foundAccount._id},
      {
        $pull: {
          customer: foundCustomer._id,
        },
      },
      { new: true, runValidators: true }
    );
    AccountDeleteCustomerEmail(email)
    res.status(200).json({ message: "Account deleted!" });
  } catch (error) {
    next(error);
  }
};

export const AllCustomers = async (req, res, next) => {
  try {
    const customer = await Customer.find({id: req.body})
    res.status(200).json(customer);
  } catch (error) {
    error.status = 404;
    next(error);
  }
};

export const findCustomer = async (req, res, next) => {
  try {
    const email = req.body.email
    const foundCustomers = await Customer.findOne({email: email});
    if(!foundCustomers){
      const message = "Unterkonto nicht gefunden"
      return res.status(404).json({message})
    }
    const accountEmail = foundCustomers.account;
    const foundAccount = await Account.findOne({email: accountEmail});

    const data = {
      firstname: foundCustomers.firstname,
      lastname: foundCustomers.lastname,
      email: foundCustomers.email,
      role: foundCustomers.role,
      category: foundAccount.category,
      expense: foundAccount.expense,
      budget: foundAccount.budget,
      maxBudget: foundAccount.maxBudget
    }
    
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};


export const getCustomerData = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      const error = new Error("Token not found");
      error.statusCode = 401;
      throw error;
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decodedToken.id;
    const account = await Customer.findOne({ _id: userId });
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

export const customerLogin = async (req, res, next) => {
  await loginUser(req, res, next, Customer);
};
