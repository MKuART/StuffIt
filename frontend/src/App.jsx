import { Outlet, RouterProvider, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './components/dashboard/Dashboard.css';
import { router } from './routes/router.jsx';
import GoToStart from './components/testCookie/goToStart.jsx';
import UserData from './components/Context/UserData.jsx';
import Role from './components/Context/Role.jsx';
import { useState, useEffect } from 'react';
import ToggleButton from './components/Context/ToggleButton.jsx';
import AccountOrCustomer from './components/Context/AccountOrCustomer.jsx';

function App() {
  const [toggle, setToggle] = useState(false);
  const [userData, setUserData] = useState([]);
  const [role, setRole] = useState([]);
  const [accountOrCustomer, setAccountOrCustomer] = useState(true);
  const [showRouter, setShowRouter] = useState(false); 

  const deleteStartCookie = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKENDURL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        console.error(`No cookie available!`);
      } else {
        console.log(`Cookie successfully deleted!`);
      }
    } catch (error) {
      console.error("Error found: ", error);
    }
  };

  useEffect(() => {
    deleteStartCookie()
    const timer = setTimeout(() => {
      setShowRouter(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AccountOrCustomer.Provider value={{ accountOrCustomer, setAccountOrCustomer }}>
        <ToggleButton.Provider value={{ toggle, setToggle }}>
          <Role.Provider value={{ role, setRole }}>
            <UserData.Provider value={{ userData, setUserData }}>
              {showRouter && ( 
                <RouterProvider router={router}>
                  <GoToStart />
                </RouterProvider>
              )}
            </UserData.Provider>
          </Role.Provider>
        </ToggleButton.Provider>
      </AccountOrCustomer.Provider>
    </>
  );
}

export default App;
