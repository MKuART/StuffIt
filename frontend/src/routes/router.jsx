import {createBrowserRouter } from 'react-router-dom';
import Login from '../components/login/Login.jsx';
import Dashboard from '../components/dashboard/Dashboard.jsx';
import Registry from '../components/registry/Registry.jsx';
import Gast from '../components/gast/Gast.jsx';
import Profile from '../components/profile/Profile.jsx';
import NavbarCompo from '../components/navbar/Navbar.jsx';

export const router = createBrowserRouter([
    {
        path: "*",
        element: <NavbarCompo/>,
        children: [
            {
                path: 'login',
                element: <Login/>
            },
            {
                path: 'registry',
                element: <Registry/>
            },
            {
                path: 'dashboard',
                element: <Dashboard/>
            },
            {
                path: 'gast',
                element: <Gast/>
            },
            {
                path: 'profile',
                element: <Profile/>
            }
        ]
        
    }
])