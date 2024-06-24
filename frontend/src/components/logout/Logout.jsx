import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// https://stuffit.onrender.com/logout
const URIAccount = `${import.meta.env.VITE_BACKENDURL}/logout`;

const Logout = () => {
  const Navigate = useNavigate();
  
useEffect(() => {
  async function backToStart() {
    const response = await fetch(URIAccount, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      Navigate("/dashboard");
      console.error("Error fetching category data:", response.statusText);
    } else {
      alert("Sie wurden erfolgreich aus geloggt!")
      console.log("Erfolgreich", response.statusText);
      Navigate("/");
    }
  }
  
    backToStart();
  }, []);

  
  return <h1>Logout</h1>; 
};

export default Logout;
