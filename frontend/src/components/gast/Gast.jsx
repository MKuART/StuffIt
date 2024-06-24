import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import './gast.css'

function Gast() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const navigate = useNavigate();

  const handleFirstNameChange = (event) => {
    const value = event.target.value.replace(/[^a-zA-Z]/g, '');
    setFirstName(value);
  };

  const handleLastNameChange = (event) => {
    const value = event.target.value.replace(/[^a-zA-Z]/g, '');
    setLastName(value);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    
    if (firstName.trim() !== '' && lastName.trim() !== '') {
      const guestInfo = { firstName, lastName };
      console.log('Gast angemeldet:', guestInfo);
      navigate(`/profile?firstName=${firstName}&lastName=${lastName}`); // Daten als Abfrageparameter übergeben
    } else {
      alert('Bitte füllen Sie Vorname und Nachname aus.');
    }
  };

  return (
    <div >
{/*       <div className='title' >
        <h2>Stuff It</h2>
      </div>
      <div className='join-container' style={{ height: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginRight:'5%', marginLeft:'5%', marginTop:'100px' }}>
        <h3>Gast Anmeldung</h3>
        <form className='form' onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input type="text" placeholder="Vorname" value={firstName} onChange={handleFirstNameChange} style={{ marginBottom: '20px', padding: '5px', height: '5vh', width: '50%', maxWidth: '300px', minWidth: '150px' }} required />
          <input type="text" placeholder="Nachname" value={lastName} onChange={handleLastNameChange} style={{ marginBottom: '40px', padding: '5px', height: '5vh', width: '50%', maxWidth: '300px', minWidth: '150px' }} required />
          <Button type="submit" className='btn' variant="primary" style={{  height: '4vh', width: '30%', maxWidth: '300px', minWidth: '150px', marginBottom: '10px'  }}>Als Gast anmelden</Button>
          <Link to="/" className='btn' variant="primary" style={{  height: '4vh', width: '30%', maxWidth: '300px', minWidth: '150px'  }}>Zurück</Link>
        </form>
      </div> */}
      <div className='excuse-us'>
      <h2>Es tut uns Leid, wir arbeiten dran</h2>
      <Link to="/" className='btn-excuse' variant="primary">Zurück</Link>
      </div>
      <div className="footer" style={{ width:'100%', height:'5vh', justifyContent:'end', color:'white', paddingTop:'10px', paddingRight:'5vh', bottom:'0px',position:'absolute' }}>
           <span>@2024 by Team Creators Collective ©</span> 
      </div> 
    </div>
  );
}

export default Gast;
