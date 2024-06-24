import "./category.css";
import { useRef, useState, useContext, useEffect } from "react";
import UserData from "../../Context/UserData.jsx";
import Expenses from "./expenses/Expenses.jsx";
import CreateExpenses from "./expenses/CreateExpenses.jsx";
import CreateCategory from "./CreateCategory.jsx";
import UpdateCategory from "./UpdateCategory.jsx";
import AccountOrCustomer from "../../Context/AccountOrCustomer.jsx";
import Legend from "../legend/Legend.jsx";

const URICustomer = `${import.meta.env.VITE_BACKENDURL}/customer`;
const URIAccount = `${import.meta.env.VITE_BACKENDURL}/account`;
const URICategory = `${import.meta.env.VITE_BACKENDURL}/category`;
const URIExpenses = `${import.meta.env.VITE_BACKENDURL}/expenses`;

function Category() {
  const [categories, setCategories] = useState([]);
  const { userData, setUserData } = useContext(UserData);
  const { accountOrCustomer, setAccountOrCustomer } =
    useContext(AccountOrCustomer);
  const [deleteMode, setDeleteMode] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryBudget, setNewCategoryBudget] = useState(0);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [newName, setNewName] = useState("");
  const [newBudget, setNewBudget] = useState(0);

  const [expenses, setExpenses] = useState([]);
  const [showExpenseContainer, setShowExpenseContainer] = useState(false);
  const [creatingInput, setCreatingInput] = useState(false);
  const [showUpdateInput, setShowUpdateInput] = useState(false);

  const [categoriesData, setCategoriesData] = useState([]);
  const [categoryCreated, setCategoryCreated] = useState(false);
  async function fetchCategories() {
    try {
      const response = await fetch(`${URICategory}/findById`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: userData.role,
        },
        body: JSON.stringify(userData.category),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Error fetching category data:", response.statusText);
      } else {
        setCategories(data.foundCategories);
        fetchExpenses();
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }

  async function fetchAccount() {
    try {
      const response = await fetch(
        `${accountOrCustomer ? URIAccount : URICustomer}/findById`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: userData.role,
          },
          credentials: "include",
          body: JSON.stringify(userData),
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

  async function fetchCategoryDetails(categoryId) {
    try {
      const response = await fetch(`${URICategory}/findById`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: userData.role,
        },
        body: JSON.stringify([categoryId]),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Error fetching category details:", response.statusText);
      } else {
        setNewName(categories[0].name);
        setNewBudget(categories[0].limitedBudget);
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }

  async function fetchExpenses() {
    try {
      const response = await fetch(URIExpenses, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category: userData.category }),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`Error fetching expenses: ${response.status}`);
      } else if (response.status === 204) {
        console.log("Es wurden keine Unterkategorien gefunden!");
        return;
      } else {
        const data = await response.json();
        setExpenses(data);
      }
    } catch (error) {
      console.error("Error fetching expenses data:", error);
    }
  }

  const createCategory = async (newName, newBudget) => {
    try {
      const response = await fetch(`${URICategory}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: userData.role,
        },
        credentials: "include",
        body: JSON.stringify({
          name: newName,
          limitedBudget: newBudget,
          account: userData.email,
        }),
      });
      const data = await response.json();
      await fetchAccount();
      await fetchCategories();
      setNewCategoryName("");
      setNewCategoryBudget(0);
      setCreatingCategory(false);

      if (!response.ok) {
        console.log(data);

        console.error("Error creating category:", response.statusText);
        alert(data.message);
      } else {
        setCategories((prevCategories) => [...prevCategories, data]);
        setCategoryCreated(true);
        fetchExpenses();
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  const deleteOneCategoryFromAccount = async (newCategory) => {
    try {
      const filteredId = categories.filter((item) => item._id === newCategory);
      const foundExpensesId = filteredId[0].expense;

      const response = await fetch(`${URIAccount}/delete-reference`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: userData.role,
        },
        credentials: "include",
        body: JSON.stringify({
          userEmail: userData.email,
          categoryIdToRemove: newCategory,
          expensesIdToRemove: foundExpensesId,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        console.error("Error deleting category:", response.statusText);
      } else {
        setUserData({
          ...userData,
          category: userData.category.filter((catId) => catId !== newCategory),
        });
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      const newCategoryId = categoryId;
      const response = await fetch(`${URICategory}/hard-delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: userData.role,
        },
        credentials: "include",
        body: JSON.stringify({ _id: categoryId, userEmail: userData.email }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Error deleting category:", response.statusText);
        alert(data.message);
      } else {
        fetchCategories();
        deleteOneCategoryFromAccount(newCategoryId);
        setCategoryCreated(true);
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  const handleDeleteClick = (categoryId) => {
    deleteCategory(categoryId);
  };

  const handleCategoryClick = async (categoryId) => {
    setSelectedCategoryId(categoryId);
    setShowExpenseContainer(true);
    await fetchCategoryDetails(categoryId);
  };

  const toggleCreatingInput = (value) => {
    setCreatingInput(value);
  };

  const createInput = () => {
    setCreatingInput(true);
  };

  useEffect(() => {
    fetchCategories();
    fetchExpenses();
    fetchAccount();
  }, [categoryCreated]);

  useEffect(() => {
    const categoryTotalExpenses = expenses.reduce((acc, expense) => {
      expense.category.forEach((categoryId) => {
        acc[categoryId] = (acc[categoryId] || 0) + expense.cost;
      });
      return acc;
    }, {});

    categories.forEach((category) => {
      const totalExpenseCost = categoryTotalExpenses[category._id] || 0;
      const totalCash = category.limitedBudget + totalExpenseCost;
      const percent = (category.limitedBudget / totalCash) * 100;
      category.currentPercent = percent.toFixed(0);
    });
  }, [categories, expenses]);

  const getColor = (percent) => {
    console.log("Percent: ", percent);

    if (percent > 50 && userData) {
      return "greenyellow";
    } else if (percent > 30) {
      return "yellow";
    } else {
      return "red";
    }
  };

  return (
    <div>
      <div className="name-container">
        <Legend
          categoryCreated={categoryCreated}
          setCategoryCreated={setCategoryCreated}
        />
      </div>
      <div className="cotegory-container">
        {errorMessage && (
          <div
            className="error-messages"
            style={{ position: "absolute", marginLeft: "100px" }}
          >
            {errorMessage}
          </div>
        )}
        {categories && userData ? (
          categories.map((category) => {
            return (
              <div key={category._id} className="div-container" style={{}}>
                <div
                  className="props-category"
                  onClick={() => handleCategoryClick(category._id)}
                >
                  <div>{category.name}</div>
                  <div>{category.limitedBudget}€</div>
                </div>
                {selectedCategoryId === category._id &&
                  showExpenseContainer && (
                    <div style={{}}>
                      <Expenses
                        categoryId={category._id}
                        expenses={expenses}
                        category={category}
                        handleGoBack={setShowExpenseContainer}
                        toggleCreatingInput={toggleCreatingInput}
                        setExpensesData={setExpenses}
                        categories={categories}
                        setCategories={setCategories}
                        fetchCategories={fetchCategories}
                        showUpdateInput={showUpdateInput}
                        setShowUpdateInput={setShowUpdateInput}
                        setCategoryCreated={setCategoryCreated}
                        selectedCategoryId={selectedCategoryId}
                      />

                    </div>
                  )}

                <div
                  className="procent-container"
                  style={{
                    "--current-percent": `${category.currentPercent}%`,
                    backgroundImage: `conic-gradient(
                    ${getColor(
                      category.currentPercent
                    )} var(--current-percent), 
                    #545F66 var(--current-percent),
                    #545F66 100%)`,
                    zIndex: "-1",
                  }}
                />
                {deleteMode && (
                  <div
                    className="deleteIcon"
                    onClick={() => handleDeleteClick(category?._id)}
                  >
                    ✕
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p>Loading...</p>
        )}
        {userData && userData?.category?.length < 24 && userData.role === "Admin" ? (
          !creatingCategory && (
            <div
              className="create-category-icon"
              onClick={() => setCreatingCategory(true)}
            >
              ✚
            </div>
          )
        ) : (
          <></>
        )}
      </div>
      {creatingCategory && (
        <div className="create-Category">
          <CreateCategory
            userData={userData}
            setNewNme={setNewName}
            setNewBudget={setNewBudget}
            setCreatingCategory={setCreatingCategory}
            createCategory={createCategory}
          />
          <div
            className=" create-category-beenden-btn btn"
            onClick={() => {
              setCreatingCategory(false);
              setEditMode(false);
            }}
          >
            Beenden
          </div>
        </div>
      )}
      <div className="dashboard-footer-container">
        <button
          className="dashboard-footer-container-btn btn"
          disabled={userData && userData?.role === "User"}
          style={{ margin: "5px" }}
          onClick={() => setDeleteMode(!deleteMode)}
        >
          {deleteMode ? "Löschen beenden" : "Kategorie löschen"}
        </button>
      </div>
      {creatingInput && (
        <CreateExpenses
          selectedCategoryId={selectedCategoryId}
          setExpenses={setExpenses}
          expenses={expenses}
          setCreatingInput={setCreatingInput}
          fetchCategories={fetchCategories}
          fetchExpenses={fetchExpenses}
        />
      )}
    </div>
  );
}

export default Category;
