import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DemoShortener from './components/DemoShortener';
import Home from './components/user/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Users from './components/user/Users';
import { Toaster } from 'react-hot-toast';
import UrlDetails from './components/url/UrlDetails';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [UserDetails, setUserDetails] = useState({});

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch('/api/auth/isAuthenticated', {
          method: 'GET',
          credentials: 'include', // Include cookies in the request
        });
        const data = await response.json();
        setIsLoggedIn(data.isAuthenticated);
        if (data.isAuthenticated) {
          setUserDetails({ userId: data.userId, name: data.name });
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };
    checkAuthentication();
  }, []);

  return (
    <>

      <Router>
      <Toaster />
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Home userId={UserDetails.userId} name={UserDetails.name} />
              ) : (
                <DemoShortener />
              )
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users" element={<Users />} />
          <Route path="/urlDetails/:id" element={<UrlDetails />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
