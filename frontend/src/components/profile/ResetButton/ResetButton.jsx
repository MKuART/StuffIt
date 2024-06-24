import { useEffect, useState } from "react";

const URI = `${import.meta.env.VITE_BACKENDURL}/reset`;

const ResetButton = ({ userData, fetchAccount }) => {
  const [disabled, setDisabled] = useState(true);

  const checkButton = () => {
    if (userData.category?.length > 0 || userData.expense?.length > 0 || userData.budget > 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  async function reset(isPassword) {
    userData.isPassword = isPassword
    try {
      const response = await fetch(URI, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: userData.role,
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });
      const data = await response.json()
      if (!response.ok) {
        console.error(
          "Ein Fehler ist aufgetreten! Versuchen Sie es später erneut!"
        );
        alert(data.message)
      } else {
        alert("Daten erfolgreich gelöscht!");
        console.log("Daten erfolgreich gelöscht!");
       await fetchAccount();
       setDisabled(true)
      }
    } catch (error) {
      console.error("Error found: ", error);
    }
  }

  const confirmButton = () => {
    if (confirm("Möchten Sie wirklich all Ihre Daten löschen?")) {
      const isPassword = prompt("Geben Sie Ihr Passwort ein:")     
      reset(isPassword);
      fetchAccount();
    } else {
      alert("Löschvorgang abgebrochen!");
    }
  };

  useEffect(() => {
    checkButton();
  }, []);

  return (

    <>
    
{userData.role === "Admin" ? 
    <button
      className="btn"
      style={{position: "absolute", right: "10px", bottom: "20px", color: "#e8c1c5" }} 
      disabled={disabled} onClick={confirmButton}>
      Einstellungen zurücksetzen
    </button> : <></>}

    </>
    
  );
};

export default ResetButton;
