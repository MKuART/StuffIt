import { useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import UserData from "../Context/UserData";
import AccountOrCustomer from "../Context/AccountOrCustomer";
import "./profile.css";
import ResetButton from "./ResetButton/ResetButton";

const AccountURI = `${import.meta.env.VITE_BACKENDURL}/account`;
const CustomerURI = `${import.meta.env.VITE_BACKENDURL}/customer`;

function Profile() {
  const Navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    budget: "",
  });

  const [isShown, setIsShown] = useState(true);
  const { accountOrCustomer, setAccountOrCustomer } =
    useContext(AccountOrCustomer);
  const { userData, setUserData } = useContext(UserData);

  async function fetchAccount(testData) {
    try {
      const Data = testData || userData;
      const response = await fetch(
        `${accountOrCustomer ? AccountURI : CustomerURI}/findById`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: userData.role,
          },
          credentials: "include",
          body: JSON.stringify(Data),
        }
      );
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

  const updateProfile = async (e) => {
    e.preventDefault();
    const formDataObject = Object.fromEntries(new FormData(e.target));
    formDataObject.account = userData.email;

    try {
      const response = await fetch(
        `${accountOrCustomer ? AccountURI : CustomerURI}/update`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: userData.role,
          },
          credentials: "include",
          body: JSON.stringify(formDataObject),
        }
      );
      await fetchAccount();
      const data = await response.json();
      if (response.status === 422) {
        console.error("Error fetching account data:", response.statusText);
        const message = data.errors.map((item) => `
        ${item.msg}\n`)
       alert(`
        Fehler beim Erstellen Ihres Profils!
        Grund ist: 
        ${message.join("")}`);
       return;
      }
      if (!response.ok) {
        const message = data.message;
        console.error("Error updating profile:", response.statusText);
        alert(`
        Ihr Profil konnte nicht upgedated werden! 
        Grund ist: 
        ${message}`);

        return;
      } else {
        alert("Profil erfolgreich upgedated!");
        setUserData(data);
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          password: "",
          budget: "",
          passwordReload: "",
        });
        await fetchAccount(data);
        setIsShown(true);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  return (
    <>
      {" "}
      {userData ? (
        <div>
          <div className="title-div-profile">
            <h1 className="stuff-it-profile">Stuff It!</h1>
          </div>

          <div className="profile-container">
            <form className="form-profile" onSubmit={updateProfile}>
              <button
                type="button"
                className="btn edit-btn"
                onClick={() => {
                  setIsShown((prevMode) => !prevMode);
                }}
              >
                {isShown ? "ändere deine Daten" : "schließe die Bearbeitung"}
              </button>
              <div className="placeholder-div">
                Vorname:
                <p className="show-data">&nbsp;{userData.firstname}</p>
              </div>
              <input
                className="input-profile-all"
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={(e) =>
                  setFormData({ ...formData, firstname: e.target.value })
                }
                placeholder="Vorname"
                style={{ display: isShown ? "none" : "block" }}
              />

              <div className="placeholder-div">
                Nachname:
                <p className="show-data">&nbsp;{userData.lastname}</p>
              </div>
              <input
                className="input-profile-all"
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={(e) =>
                  setFormData({ ...formData, lastname: e.target.value })
                }
                placeholder="Nachname"
                style={{ display: isShown ? "none" : "block" }}
              />
              <div className="placeholder-div">
                E-Mail:
                <p className="show-data">&nbsp;{userData.email}</p>
              </div>
              <input
                className="input-profile-all"
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Email"
                style={{
                  display: isShown ? "none" : "flex",
                }}
              />

              <div className="placeholder-div">
                Passwort:
                <p>********</p>
              </div>
              <input
                className="input-profile-all"
                type="password"
                name="password"
                value={formData.password}
                minLength={8}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Passwort"
                style={{
                  display: isShown ? "none" : "flex",
                }}
              />

              <div className="placeholder-div">
                Budget:
                <p className="show-data">
                  &nbsp;{userData.budget}/{userData.maxBudget}€
                </p>
              </div>
              {userData.role === "Admin" ? (
                <input
                  className="input-profile-all"
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({ ...formData, budget: e.target.value })
                  }
                  placeholder="Budget"
                  style={{
                    display: isShown ? "none" : "block",
                  }}
                />
              ) : (
                <p style={{ display: isShown ? "none" : "block" }}>
                  No permission
                </p>
              )}

              <div className="placeholder-div password-reloader">
                <p
                  className="show-data"
                  style={{
                    display: isShown ? "none" : "flex",
                  }}
                >
                  Altes Passwort eingeben!
                </p>
              </div>
              <input
                className="input-profile-all"
                type="password"
                name="passwordReload"
                value={formData.passwordReload}
                minLength={8}
                onChange={(e) =>
                  setFormData({ ...formData, passwordReload: e.target.value })
                }
                placeholder="Passwort"
                required
                style={{
                  display: isShown ? "none" : "flex",
                }}
              />

              <button
                type="submit"
                className="btn edit-profile-btn"
                style={{
                  display: isShown ? "none" : "flex"
                }}
              >
                Änderungen speichern
              </button>
              <Link
                style={{
                  display: isShown ? "flex" : "none",
                }}
                to="/dashboard"
                className="btn back-to-dash btn"
              >
                zum Dashboard
              </Link>
              <button
              onClick={() => Navigate("/delete-your-account")}
                className="btn delete-acc-btn"
                style={{
                  display: isShown ? "none" : "flex",
                }}
              >
                  Account löschen
              </button>
            </form>
            {userData.role === "Admin" ? (
              <div>
                <button
                  style={{
                    display: isShown ? "inline-block" : "none",
                  }}
                  className="user-btn btn"
                  onClick={() => Navigate("/create-customer")}
                >
                  Nutzer hinzufügen
                </button>
                <button
                  style={{
                    display: isShown ? "inline-block" : "none",
                  }}
                  className="user-btn btn"
                  onClick={() => Navigate("/all-customers")}
                >
                  Alle Nutzer
                </button>
              </div>
            ) : (
              <></>
            )}
            {!isShown && (
              <ResetButton userData={userData} fetchAccount={fetchAccount} />
            )}
          </div>
        </div>
      ) : (
        <p>Loading</p>
      )}
    </>
  );
}

export default Profile;
