import React, { useContext, useEffect, useState, useRef } from "react";
import "./navbar.css";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import Join from "../join/Join.jsx";
import Login from "../login/Login.jsx";
import Profile from "../profile/Profile.jsx";
import Dashboard from "../dashboard/Dashboard.jsx";
import Registry from "../registry/Registry.jsx";
import Gast from "../gast/Gast.jsx";
import Navbar from "react-bootstrap/Navbar";
import Logo from "./logo/Logo.jsx";
import GoToStart from "../testCookie/goToStart.jsx";
import ToggleButton from "../Context/ToggleButton.jsx";
import DeleteAccount from "../deleteAccount/DeleteAccount.jsx";
import About from "../About/About.jsx";
import Music from "../Music/Music.jsx";
import CreateCustomer from "../profile/Customer/CreateCustomer.jsx";
import AllCustomers from "../profile/allCustomers/AllCustomers.jsx";
import Footer from "../footer/Footer.jsx";

const URIAccount = `${import.meta.env.VITE_BACKENDURL}/logout`;

function NavbarCompo() {
  const Navigate = useNavigate();

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
        Navigate("/");
        console.error(`No cookie available!`);
      } else {
        Navigate("/");
        console.log(`Cookie successfully deleted!`);
      }
    } catch (error) {
      console.error("Error found: ", error);
    }
  };

  window.onload = function () {
    deleteStartCookie();
  };

  window.onbeforeunload = function () {
    deleteStartCookie();
  };

  const { toggle, setToggle } = useContext(ToggleButton);
  const [showDropdown, setShowDropdown] = useState(true);
  const [showMusic, setShowMusic] = useState(true);
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if(window.innerWidth >= 1051){
        setShowDropdown(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(true);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  async function logout() {
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
      alert("Sie wurden erfolgreich ausgeloggt!");
      console.log("Erfolgreich", response.statusText);
      setToggle(false);
      Navigate("/");
    }
  }

  const indexToggler = () => {
    setShowMusic((prevMode) => !prevMode);
  };

  return (
    <div className="fix-bar">
      <GoToStart />
      <Navbar expand="lg" className="full-screen-navbar nav-container">
        <Logo></Logo>
        <div
          style={{
            opacity: showMusic ? 0 : 1,
            height: showMusic ? 0 : "auto",
            transition: "opacity 0.2s ease-in-out, height 0.2s ease-in-out",
          }}
        >
          <Music showMusic={showMusic} />
        </div>
        <div
          onClick={toggleDropdown}
          className={`drop-down-container ${
            showDropdown ? "show" : ""
          }`}
          ref={dropdownRef}
        >
          <div className="white-bar"></div>
          <div className="white-bar"></div>
          <div className="white-bar"></div>
          <div
            className={`dropdown full-screen-dropdown ${
              showDropdown ? "show" : ""
            }`}
          >
            {!toggle ? (
              <ul className="login-style">
                <li>
                  <NavLink className="navlink" to="/">
                    <span>Start</span>Start
                  </NavLink>
                </li>
                <li>
                  <NavLink className="navlink" to="/login">
                    <span>Login</span>Login
                  </NavLink>
                </li>
                <li>
                  <NavLink className="navlink" to="/registry">
                  <span>Registrierung</span>Registrierung
                  </NavLink>
                </li>
                <li>
                  <NavLink className="navlink" to="/gast">
                    <span>Gast</span>Gast
                  </NavLink>
                </li>
                <li>
                  <NavLink className="navlink" to="/about">
                    <span>StuffIt</span>StuffIt
                  </NavLink>
                </li>
                <li>
                  <NavLink className="navlink" to="#" onClick={indexToggler}>
                    <span>Musik</span>Musik
                  </NavLink>
                </li>
              </ul>
            ) : (
              <ul className="logedin-style">
                <li>
                  <NavLink className="navlink" to="/dashboard"><span>Dashboard</span>Dashboard</NavLink>
                </li>
                <li>
                  <NavLink className="navlink" to="/profile"><span>Profil</span>Profil</NavLink>
                </li>

                <li className="logout-nav" onClick={logout}><span>Logout</span>Logout</li>
                <li>
                  <NavLink className="navlink" to="/about"><span>StuffIt</span>StuffIt</NavLink>
                </li>
                <li>
                  <NavLink className="navlink" 
                    to="#"
                    onClick={(e) => {
                      setShowMusic((prevMode) => !prevMode);
                      e.preventDefault();
                    }}
                  >
                    <span>Musik</span>Musik
                  </NavLink>
                </li>
              </ul>
            )}
          </div>
        </div>
      </Navbar>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registry" element={<Registry />} />
        <Route
          path="/create-customer"
          element={<CreateCustomer />}
        />
        <Route path="/all-customers" element={<AllCustomers />} />
        <Route path="/gast" element={<Gast />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/delete-your-account"
          element={<DeleteAccount />}
        />
        <Route path="/about" element={<About />} />
        <Route path="/" element={<Join />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default NavbarCompo;
