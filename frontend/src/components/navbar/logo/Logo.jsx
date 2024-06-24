import './logo.css'
import { NavLink } from "react-router-dom";

function Logo () {
  return (
    <div className='logo-container'>
        <div className='cards-container'>
        <NavLink className='navlinks' to="/"></NavLink>
            <div className='card money a-card'></div>
            <div className='card money b-card'></div>
            <div className='card money c-card'></div>
            <div className='card bag d-card'></div>
            <div className='card bag f-card'></div>
            <div className='card bag g-card'></div>
        </div>
        <h2 className='logo-text'>S</h2>
        <h2 className='exclamation'>!</h2>
    </div>
  )
}

export default Logo 