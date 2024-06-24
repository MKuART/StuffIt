import { useContext, useState } from "react";
import UserData from "../../Context/UserData.jsx";
import "./updatecategory.css"


const URICategory = `${import.meta.env.VITE_BACKENDURL}/category`;
// const URICategory = "https://stuffit.onrender.com/category";

const UpdateCategory = ({selectedCategoryId, fetchCategories, setShowUpdateInput, setCategoryCreated, fetchExpenses, setCategories}) => {

  const { userData } = useContext(UserData);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [selectedCategoryBudget, setSelectedCategoryBudget] = useState(0);


  
  const updateCategory = async () => {
    try {
      const response = await fetch(`${URICategory}/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: userData.role,
        },
        credentials: "include",
        body: JSON.stringify({
         _id: selectedCategoryId,
        name: selectedCategoryName,
        budget: selectedCategoryBudget,
        email: userData.email      
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message)
        console.error("Error updating category:", response.ok);
      } else {
        setSelectedCategoryName("");
        setSelectedCategoryBudget(0);
        fetchExpenses()
        fetchCategories()
        setShowUpdateInput(false)
        setCategoryCreated(true)
        setCategories(data.foundCategories)
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <div className="perent-update-category-window">
      <p>Geben Sie eine Kategorie ihrer Wahl ein und und die dafür vorgesehene Ausgabenhöhe</p>
      <label htmlFor="">neuer Kategoriename:</label>
      <input
        type="text"
        placeholder=" neuer Kategoriename"
        value={selectedCategoryName}
        onChange={(e) => setSelectedCategoryName(e.target.value)}
      />
      <label htmlFor="">neues Budget:</label>
      <input
        type="number"
        placeholder="Budget"
        value={selectedCategoryBudget}
        onChange={(e) => setSelectedCategoryBudget(parseFloat(e.target.value))}
      />
    
     { <button 
        className="update-category-btn btn"
        onClick={updateCategory}
      >bestätigen
      </button>}
    </div>

  );
};

export default UpdateCategory;