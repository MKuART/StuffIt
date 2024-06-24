import { useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import UserData from "../Context/UserData";
import ToggleButton from "../Context/ToggleButton";
import AccountOrCustomer from "../Context/AccountOrCustomer";
import './deleteAccount.css'

const URILogout = `${import.meta.env.VITE_BACKENDURL}`;
const URIAccount = `${import.meta.env.VITE_BACKENDURL}/account`;
const URICustomer = `${import.meta.env.VITE_BACKENDURL}/customer`;

function DeleteAccount() {
  const {accountOrCustomer, setAccountOrCustomer} = useContext(AccountOrCustomer)
    const Navigate = useNavigate()
   const {userData, setUserData} = useContext(UserData)
    const {toggle, setToggle} = useContext(ToggleButton)

    async function fetchAccount() {
        try {
          const response = await fetch(`${accountOrCustomer ? URIAccount : URICustomer}/findById`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: userData.role,
            },
            credentials: "include",
            body: JSON.stringify(userData),
          });
          const data = await response.json();
    
          if (!response.ok) {
            console.error("Error fetching account data:", response.statusText);
          } else {
            setUserData(data);
          }
        } catch (error) {
          console.log(`Error: ${error}`);
        }
      }

    useEffect(() => {
        fetchAccount()
    },[])

    async function logout() {
        const response = await fetch(`${URILogout}/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (!response.ok) {
          Navigate("/");
          console.error("Error fetching category data:", response.statusText);
        } else {
          Navigate("/");
          setToggle(false);
        }
      }

      const confirmButton = () => {
        if (confirm("Möchten Sie wirklich Ihr Profil löschen und all Ihre dazugehörigen Daten?")) {
          const isPassword = prompt("Geben Sie Ihr Passwort ein:")          
          DeleteAccount(isPassword)
          fetchAccount();
        } else {
          Navigate("/profile");
          alert("Löschvorgang abgebrochen!");
          
        }
      };

      async function DeleteAccount(isPassword) {
        userData.isPassword = isPassword
          const response = await fetch(`${accountOrCustomer ? URIAccount : URICustomer}/delete`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: userData.role
            },
            credentials: "include",
            body: JSON.stringify(userData),
          });
          const data = await response.json();
          if (!response.ok) {
            alert(data.message)
            console.error("Error fetching account data:", response);
          } else {
            alert("Daten erfolgreich gelöscht!");
            setUserData(data);
          await logout()
          }
      }
    
  return (
    <>
    <div className="delete-container">
      <button className="btn back-to-profile-btn">
      <NavLink className='delete-options back-to-profile' to="/profile">Löschen abbrechen</NavLink>
      </button>
      <NavLink className='delete-options' onClick={confirmButton}>!Account löschen!</NavLink>
    </div>
   </>
  );
}

export default DeleteAccount;