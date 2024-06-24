import { useContext, useEffect, useState } from "react";
import {useNavigate} from "react-router-dom"
import UserData from "../../Context/UserData";
import './allCustomer.css'

const URI = `${import.meta.env.VITE_BACKENDURL}`;

const AllCustomers = () => {
  const Navigate = useNavigate()
  const { userData, setUserData } = useContext(UserData);
  const [customer, setCustomer] = useState([])
  
  async function fetchAccount() {
    try {
      const response = await fetch(`${URI}/account/findById`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: userData.role,
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });
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

  async function fetchCustomers() {
    try {
        const foundCustomers = userData.customer
        
      const response = await fetch(`${URI}/customer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: userData.role,
        },
        credentials: "include",
        body: JSON.stringify(foundCustomers),
      });
      const data = await response.json();
      
      if (!response.ok) {
        console.error("Error fetching account data:", response.statusText);
      } else {
        setCustomer(data);
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }

  useEffect(() => {
    fetchAccount();
    fetchCustomers()
  }, []);
  console.log("Customers: ", customer);
  
  const deleteCustomer = async(key) => {
    try{
      
      const response = await fetch(`${URI}/customer/customer-delete`,{
        method: "DELETE",
        headers:{
          "Content-Type": "application/json",
          Authorization: userData.role,
        },
        credentials: "include",
        body: JSON.stringify({key: key, userData: userData}),
      });
      const data = await response.json()
      if(!response.ok){
        alert(data.message)
        console.error(`Cant find customer! Please try later again!`)
      }else{
        console.log(`Customer was succsessfully deleted!`);
        alert("Dieser Nutzer wurde erfolgreich gelöscht!")
        fetchCustomers()
      }
    }catch(error){
      console.error(`An error happpened: ${error}!`)
    }
  }

  const confirmDelete = (item) =>{
    if(confirm("Möchten Sie diesen Nutzer wirklich löschen?")){
      deleteCustomer(item)
    }
    else{
      alert("Der Nutzer wurde nicht gelöscht!")
    }
  }
  
return (
  <>
    <h1>whats going on</h1>
    <div className="show-customer">
      {userData && customer && customer.length >= 1 ? customer.map((item) => (
        <div className="container" key={item.email}>
          <div className="inner-div">
          <p>{item.firstname} {item.lastname}</p> 
          <button 
            className="btn btn-delete-customer"
            onClick={() => confirmDelete(item.email)}>Löschen</button>
            </div>
        </div>
      )) : (<p className="empty-text">Es wurden noch keine Unterkonten angelegt!</p>)}
      
      <button className="btn back" onClick={() => Navigate("/profile")}>Zurück zum Profil</button>
    </div>
  </>);
};

export default AllCustomers;
