import { useRef, useState, useContext, useEffect } from "react";
import userDataContext from "../../../Context/UserData.jsx";

const URIExpenses = `${import.meta.env.VITE_BACKENDURL}/expenses`;
// const URIExpenses = "https://stuffit.onrender.com/expenses";


function CreateExpenses({ selectedCategoryId, setExpenses, expenses, setCreatingInput, fetchCategories, fetchExpenses }) {
    const [newExpensDescription, setNewExpensDesciption] = useState("");
    const [newExpensCost, setNewExpensCost] = useState(0);
    const newCost = useRef(null);
    const newDescription = useRef(null);
    const { userData } = useContext(userDataContext);

    const createExpense = async () => {
        try {
          const response = await fetch(`${URIExpenses}/create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: userData.role,
            },
            credentials: "include",
            body: JSON.stringify({
              description: newDescription.current.value,
              cost: newCost.current.value,
              category: selectedCategoryId,
              account: userData.email,
            }),
          });
    
          const data = await response.json();
    
          if (!response.ok) {
            console.error("Error fetching expenses data");
            alert(data.message)
          } else {
            setExpenses([...expenses, data]);
            setNewExpensDesciption("");
            setCreatingInput(false);
            fetchCategories()
          }
        } catch (error) {
          console.error("Error creating expense:", error);
        }
      };

  return (

    <div className="create-expense">
      <label>Ausgabe</label>
      <input
        type="text"
        ref={newDescription}
        placeholder="Ausgabe"
        value={newExpensDescription}
        onChange={(e) => setNewExpensDesciption(e.target.value)}
      />
      <label>Kosten</label>
      <input
        type="number"
        ref={newCost}
        placeholder="Cost"
        value={newExpensCost}
        onChange={(e) => setNewExpensCost(parseFloat(e.target.value))}
      />
      <button className="create-btn btn" onClick={createExpense}>
        Ausgabe
      </button>
     { <button 
            className="close-expense-btn btn"
            onClick={() => {setCreatingInput(false)}}>
            schließen
      </button>}

    </div>
  )
}

export default CreateExpenses