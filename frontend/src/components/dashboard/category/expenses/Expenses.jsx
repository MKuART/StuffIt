import { useRef, useState, useContext, useEffect } from "react";
import UserData from "../../../Context/UserData.jsx";
import "./expenses.css";
import UpdateCategory from "../UpdateCategory.jsx"; 

const URIExpenses = `${import.meta.env.VITE_BACKENDURL}/expenses`;

function Expenses({
  categories,
  setCategories,
  categoryId,
  expenses,
  category,
  handleGoBack,
  toggleCreatingInput,
  setExpensesData,
  fetchCategories,
  showUpdateInput,
  setShowUpdateInput,
  setCategoryCreated,
  selectedCategoryId
}) {
  const { userData, setUserData } = useContext(UserData);
  const updateDescription = useRef(null);
  const updateCost = useRef(null);
  const [updateExpensDescription, setUpdateExpensDesciption] = useState("");
  const [updateExpenseCost, setUpdateExpenseCost] = useState("");
  const [selectedExpense, setSelectedExpense] = useState(null);

  const filteredExpenses = expenses
    ? expenses.filter((expense) => expense.category.includes(categoryId))
    : [];

  async function fetchExpenses(categoryId) {
    try {
      const response = await fetch(URIExpenses, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category: categoryId }),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`Error fetching expenses: ${response.status}`);
      }
      const data = await response.json();
      setExpensesData(data);
    } catch (error) {
      console.error("Error fetching expenses data:", error);
    }
  }

  const handleExpenseClick = (expenseId) => {
    setSelectedExpense(expenseId);
  };

  const updateExpense = async () => {
    try {
      console.log(selectedExpense);

      const response = await fetch(`${URIExpenses}/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: userData.role,
        },
        credentials: "include",
        body: JSON.stringify({
          description: updateDescription.current.value,
          cost: updateCost.current.value,
          _id: selectedExpense,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
        console.error("Fehler! Versuchen Sie es erneut!");
      }
      console.log("Expense description updated successfully");

      await fetchExpenses(categoryId);
      await fetchCategories();
      setSelectedExpense(null);
      setUpdateExpensDesciption("");
      setUpdateExpenseCost("");
    } catch (error) {
      console.error("Error updating expense description:", error);
    }
  };

  const goBackHandler = () => {
    handleGoBack(false);
  };

  useEffect(() => {
    fetchExpenses(categoryId);
  }, []);

  const closeUpdateExpense = () => {
    setSelectedExpense(null);
  };

  return (
    <div className="div-container-expense">
      <h1 className="overview">
        {category.name + ": "}
        {"Budget: " + category.limitedBudget} {"€"}
      </h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Beschreibung</th>
              <th>Kosten (€)</th>
              <th>Date</th>
              <th>Umbennen</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense) => (
              <tr key={expense._id}>
                <td>{expense.description}</td>
                <td>{expense.cost}</td>
                <td className="date-row">{expense.date.slice(0, 10)}</td>
                <td className="edit-button" onClick={() => handleExpenseClick(expense._id)}>✎</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          className="update-expense"
          style={{
            display: selectedExpense ? "block" : "none",
          }}
        >
          <div className="umbennen-container">
            <p>Passen Sie ihr Ausgabe an!</p>
            <label htmlFor="description">Beschreibung:</label>
            <input
              name="description"
              className="description"
              type="text"
              ref={updateDescription}
              placeholder="Beschreibung"
              value={updateExpensDescription}
              onChange={(e) => setUpdateExpensDesciption(e.target.value)}
            />
            <label htmlFor="cost">Kosten:</label>
            <input
              name="cost"
              className="cost"
              type="number"
              ref={updateCost}
              placeholder="Kosten"
              value={updateExpenseCost}
              onChange={(e) => setUpdateExpenseCost(e.target.value)}
            />
            <br />
            <div className="button-group">
              <button className="btn" onClick={updateExpense}>
                umbennen
              </button>
              <button className="btn" onClick={closeUpdateExpense}>
                schließen
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <button
          className="expenses-btn btn"
          onClick={() => toggleCreatingInput((prev) => !prev)}
        >
          Ausgabe
        </button>

        {showUpdateInput && (
          <div className="update-category-window">
            <div className="selected-category-update">
              <p>{category.name}</p>
              <p>{category.limitedBudget}€</p>
            </div>
            <UpdateCategory
              setCategoryCreated={setCategoryCreated}
              selectedCategoryId={selectedCategoryId}
              fetchCategories={fetchCategories}
              setCategories={setCategories}
              setShowUpdateInput={setShowUpdateInput}
            />
             <button  
               className="update-back-btn btn"
               onClick={() => setShowUpdateInput(false)}
             >
                schließen
              </button>
          </div>
        )}

        <button 
          className="update-category-window-btn btn" 
          onClick={() => setShowUpdateInput(true)}>               
          Aktualisieren
        </button>
       { <div className="expenses-btn-beenden btn" onClick={goBackHandler}>
          schließen
        </div>}
      </div>
    </div>
  );
}

export default Expenses;
