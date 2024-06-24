import { useContext, useEffect, useState } from "react";
import UserData from "../../Context/UserData.jsx";


function Legend({ categoryCreated, setCategoryCreated }) {
  
  const { userData } = useContext(UserData);
  const [account, setAccount] = useState(null);

  async function fetchAccount() {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKENDURL}/account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: userData.role,
        },
        body: JSON.stringify(userData),
        credentials: "include"
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Error fetching account data:", response.statusText);
      } else {
        setAccount(data);
        setCategoryCreated(false)
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }

  useEffect(() => {
    fetchAccount();
  }, [categoryCreated]); 

  return (
    <div className="legend">
      <div className="legend-info">
        {account && account.firstname && account.lastname && `${account.firstname} ${account.lastname}`}
        <p>
          {account && account.firstname && account.lastname && `${account.role}`}
        </p>
      </div>
      <div className="legend-info">
        Budget:{account && account.budget && ` ${account.budget}€`} <br />
        Ausgabe: {account && account.budget && `${account.maxBudget - account.budget}€`}
      </div>
    </div>
  )
}

export default Legend;
