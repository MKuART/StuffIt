import { Link } from 'react-router-dom';
import './join.css'
// import LogoAnimation from '../animation/LogoAnimation';


function Join() {
  return (
    <div className='join-complete'>
      <div className='title-div-join'>
        <h1>Stuff It!</h1>
        {/* <LogoAnimation/> */}
      </div>
      <div className='join-container' >
        <Link to="/login" className='btn login-btn'>Login</Link>
        <Link to="/registry" className='btn'  style={{ height: '5vh', width: '50%', maxWidth: '300px', minWidth: '150px', marginBottom: '50px' }}>Registrierung</Link>
        <Link to='/gast' className='btn' style={{ height: '5vh', width: '50%', maxWidth: '300px', minWidth: '150px'}}>Gast</Link>
      </div>
      
    </div>
  )
}

export default Join;
