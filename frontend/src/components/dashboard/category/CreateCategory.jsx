import { useState, useContext } from "react";
import UserData from '../../Context/UserData.jsx';

const URICategory = `${import.meta.env.VITE_BACKENDURL}/category`;
// const URICategory = "https://stuffit.onrender.com/category";


const CreateCategory = ({ createCategory }) => {
  const [newName, setNewName] = useState("");
  const [newBudget, setNewBudget] = useState(0);
  const [creatingCategory, setCreatingCategory] = useState(false);

  const handleCreateCategory = async () => {
    try {
      await createCategory(newName, newBudget);
      setNewName("");
      setNewBudget(0);
    } catch (error) {
      console.error("Fehler beim Erstellen der Kategorie:", error);
    }
  };

  return (
    <div className="create-category-container">
      <label>Kategorie-Name eingeben</label>
      <input
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        placeholder="Kategorie-Namen"
      />
      <label>Budget eingeben</label>
      <input
        type="number"
        value={newBudget}
        onChange={(e) => setNewBudget(parseFloat(e.target.value))}
        placeholder="Kategorie-Budget"
      />
      <button
        className="create-category-btn btn"
        onClick={handleCreateCategory}
      >
        {creatingCategory ? "Kategorie erstellen" : "Kategorie speichern"}
      </button>
    </div>
  );
};

export default CreateCategory;