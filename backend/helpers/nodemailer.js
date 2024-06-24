import nodemailer from "nodemailer"
import "dotenv/config.js"

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_UN,
      pass: process.env.GMAIL_PW
    }
  });
  
  export const sendEmail = async (customerData) => {
    try {
      const mailOptions = {
        from: customerData.account,
        to: customerData.email,
        subject: 'Neuer Kunde erstellt',
        text: `Ein neuer Kunde wurde erstellt:\n\n` +
              `Name: ${customerData.firstname}\n` +
              `Name: ${customerData.lastname}\n` +
              `Email: ${customerData.email}\n` +
              `Password: ${customerData.password}\n` +
              `Unsere Seite: https://stuffit.onrender.com/\n`
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log('E-Mail wurde erfolgreich gesendet:', info.messageId);
    } catch (error) {
      console.error('Fehler beim Senden der E-Mail:', error);
    }
  };

  export const welcomeEmail = async (accountData) => {
    try {
      const mailOptions = {
        from: process.env.GMAIL_UN,
        to: accountData,
        subject: 'Account Nachricht',
        text: `Ihr Account wurde erfolgreich erstellt`
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log('E-Mail wurde erfolgreich gesendet:', info.messageId);
    } catch (error) {
      console.error('Fehler beim Senden der E-Mail:', error);
    }
  };
 
  export const AccountDeleteCustomerEmail = async (customerEmail) => {
    try {
      const mailOptions = {
        from: process.env.GMAIL_UN,
        to: customerEmail,
        subject: 'Nachricht vom Admin',
        text: `Der Admin hat beschlossen Ihr Profil zu entfernen!`
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log('E-Mail wurde erfolgreich gesendet:', info.messageId);
    } catch (error) {
      console.error('Fehler beim Senden der E-Mail:', error);
    }
  };
 
  export const AccountDeleteEmail = async (accountEmail) => {
    try {
      const mailOptions = {
        from: process.env.GMAIL_UN,
        to: accountEmail,
        subject: 'Nachricht an Sie',
        text: `Ihr Profil wurde erfolgreich gelöscht!`
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log('E-Mail wurde erfolgreich gesendet:', info.messageId);
    } catch (error) {
      console.error('Fehler beim Senden der E-Mail:', error);
    }
  };

  export const updateEmail = async (accountEmail) => {
    try {
      const mailOptions = {
        from: process.env.GMAIL_UN,
        to: accountEmail,
        subject: 'Nachricht an Sie',
        text: `Ihre Email-Adresse wurde erneuert!`
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log('E-Mail wurde erfolgreich gesendet:', info.messageId);
    } catch (error) {
      console.error('Fehler beim Senden der E-Mail:', error);
    }
  };