import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import UserData from "../../Context/UserData";
import '../../registry/registry.css'

const URI = `${import.meta.env.VITE_BACKENDURL}`;

const CreateCustomer = () => {
  const Navigate = useNavigate()
  const { userData, setUserData } = useContext(UserData);

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
      }
      else {
        setUserData(data);
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }
  
  useEffect(() => {
    fetchAccount();
  }, []);

  const handleSumbit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });

    if (formDataObject.password !== formDataObject.repeatPassword) {
      alert("Passwort stimmt nicht überein!");
      console.error("Passwort stimmt nicht überein!");
      return;
    }
    
    formDataObject.account = userData.email
    
    try {
      const response = await fetch(`${URI}/customer/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: userData.role,
        },
        credentials: "include",
        body: JSON.stringify(formDataObject),
      });
      const data = await response.json();
      console.log(data);
      
      if(data.message){
        console.error("Error fetching account data:", response.statusText);
      return  alert(`${data.message}`)
      }
      if (response.status === 422) {
        console.error("Error fetching account data:", response.statusText);
        const message = data.errors.map((item) => `
        ${item.msg}\n`)
       alert(`
        Fehler beim Erstellen Ihres Profils!
        Grund ist: 
        ${message.join("")}`);
       return
      } else {
        alert("Nutzer erfolgreich erstellt! Er müsste in jeder Sekunde eine Mail erhalten haben!")
        console.log(response);
        Navigate("/profile")
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  
  return (
    <div>
       <div className="title-registry">
        <h1 className="stuff-it">Stuff It!</h1>
        <h1 className="stuff-it2">Registrieren</h1>
      </div>
      <div className='registry-container' >
        <h3 className='registry-title'

        >Neues Unterkonto</h3>
        <form className='form-registry' onSubmit={handleSumbit} >
          <label htmlFor="firstname">Vorname</label>
          <input name='firstname' type="text" placeholder=" Vorname" required />
          <label htmlFor="lastname">Name</label>
          <input name='lastname' type="text" placeholder=" Nachname" required />
          <label htmlFor="e-mail">E-mail</label>
          <input name='email' type="email" placeholder=" E-Mail" required />
          <label htmlFor="password">Passwort</label>
          <input name='password' type="password" placeholder=" Passwort" required minLength={8} />
          <label htmlFor="repeatPassword">Passwort wiederholen</label>
          <input name='repeatPassword' type="password" placeholder=" Passwort wiederholen" required minLength={8} />
          <button type="submit" className='btn'>Registrieren</button>
          <Link to="/profile" className='btn'>Zurück</Link>
        </form>
      </div>
    </div>
  )
};

export default CreateCustomer;
