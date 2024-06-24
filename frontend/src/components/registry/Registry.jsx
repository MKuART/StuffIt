import { Link, redirect, useNavigate } from 'react-router-dom';
import { useState } from 'react';
/* import Button from 'react-bootstrap/Button'; */
import './registry.css'

const URI = `${import.meta.env.VITE_BACKENDURL}/account/create`;

function Registry() {


const Navigate = useNavigate("")
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target)
    const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    })


    
    try {
      const response = await fetch(`${URI}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataObject),
      });
      const data = await response.json()
  
      if (response.ok) {
        alert("Erfolgreich registriert")
        console.log('Erfolgreich registriert');
        Navigate("/login")
      }  if (response.status === 422) {
        console.error("Error fetching account data:", response.statusText);
        const message = data.errors.map((item) => `
        ${item.msg}\n`)
       alert(`
        Fehler beim Erstellen Ihres Profils!
        Grund ist: 
        ${message.join("")}`);
       return
      }
      else{
        console.error('Fehler bei der Registrierung:', response.statusText);
        alert(data.message)
      }
    } catch (error) {
      console.error('Fehler:', error);
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

        >Registrieren</h3>
        <form className='form-registry' onSubmit={handleSubmit} >
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
          <Link to="/" className='btn'>Zurück</Link>
        </form>
      </div>
    </div>
  )
}

export default Registry;
