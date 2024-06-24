import Legend from "./legend/Legend.jsx";
import Category from "./category/Category.jsx";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const URIAccount = `${import.meta.env.VITE_BACKENDURL}`;

function Dashboard() {
  const navigate = useNavigate();
  const checkCookie = async () => {
    try {
      const response = await fetch(`${URIAccount}/check-cookie`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        navigate("/dashboard");
      } else {
        navigate(`/`);
        console.error("Fehler beim Einloggen:", response.statusText);
      }
    } catch (error) {
      console.log(error);
    }
  };

  window.onload = function () {
    checkCookie();
  };

  window.onbeforeunload = function () {
    checkCookie();
  };

  useEffect(() => {
    checkCookie();
  },[]);
  return (
    <div className="dashboard-container">
      
      <Category/>
    </div>
  );
}

export default Dashboard;
