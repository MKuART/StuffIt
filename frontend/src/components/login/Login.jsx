import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import UserData from "../Context/UserData";
import Role from "../Context/Role";
import ToggleButton from "../Context/ToggleButton";
import AccountOrCustomer from "../Context/AccountOrCustomer";
import './login.css'

const GetAccountData = `${import.meta.env.VITE_BACKENDURL}/account/get-data`;
const GetCustomerData = `${import.meta.env.VITE_BACKENDURL}/customer/get-data`;
const URIAccount = `${import.meta.env.VITE_BACKENDURL}/account/login`;
const URICustomer = `${import.meta.env.VITE_BACKENDURL}/customer/login`;

function Login() {
  const Navigate = useNavigate();
  const {toggle, setToggle} = useContext(ToggleButton)
  const {accountOrCustomer, setAccountOrCustomer} = useContext(AccountOrCustomer);
  const { userData, setUserData } = useContext(UserData);
  const { role, setRole } = useContext(Role);
  const adminOrUser = () => {
    setAccountOrCustomer((prevMode) => !prevMode);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });
    try {
      const response = await fetch(accountOrCustomer ? URIAccount : URICustomer, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataObject),
      });
const data = await response.json();

      if (response.ok) {
        
            setRole(data.searchEmail.role);
            
        try {
          const response = await fetch(
            accountOrCustomer ? GetAccountData : GetCustomerData,
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `${data.searchEmail.role}`,
                body: JSON.stringify(userData),
              },
            }
          );
          

          if (response.ok) {
            const data = await response.json();
            setUserData(data.account);
            setTimeout(() => {
              alert("Sie wurden erfolgreich eingeloggt!")
              setToggle(true)
              Navigate("/profile")
            }, 500);
            console.log("Daten erfolgreich abgerufen");
          } else {
            console.error("Fehler bei Datenabrufe:", response.statusText);
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        alert(data.message)
        console.error("Fehler beim Einloggen:", response.statusText);
        
      }
    } catch (error) {
      console.error("Fehler:", error);
    }
  }
console.clear();

  return (
    <div>
      <div className="title-div-login">
        <h1 className="stuff-it-login">Stuff It!</h1>
      </div>
      <div
        className="login-container2"
      >
        <h3>Login</h3>
        <button 
          className="toggle-admin-user btn"
          onClick={adminOrUser}>
          Login als {accountOrCustomer ? "Admin" : "User"}
        </button>
        <form
          className="form-login"
          onSubmit={handleSubmit}
        >
          <label htmlFor="email"> E-Mail:</label>
          <input
            name="email"
            type="email"
            placeholder=" E-Mail"
            required
          />
          <label htmlFor="password"> Passwort:</label>
          <input
            name="password"
            type="password"
            placeholder=" Passwort"
            required
          />
          <button
            type="submit"
            className="form-btn btn"
          >
            Login
          </button>
          <Link
            to="/"
            className="back-btn btn"
          >
            Zurück
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
