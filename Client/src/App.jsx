import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/login.jsx';
import Register from './Pages/register.jsx';
  import Dashboard from './Pages/DashBoard.jsx';
 import MyLeaves from './Component/MyLeave.jsx';
import ApplyLeave from './Component/ApplyLeave.jsx';
import Footer from './Component/Footer.jsx';
import Header from './Component/Header.jsx';
import LeaveList from './Component/LeaveList.jsx';
import Home from './Pages/HomePage.jsx';
// import ApplyLeave from './pages/ApplyLeave';
// import Employees from './pages/Employees';
// import LeaveRequests from './pages/LeaveRequests';
// import Profile from './pages/Profile';
// import Settings from './pages/Settings';

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   const savedUser = localStorage.getItem('user');
  //   if (savedUser) {
  //     setUser(JSON.parse(savedUser));
  //     setIsAuthenticated(true);
  //   }
  // }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  // if (!isAuthenticated) {
  //   return (
  //     <Router>
  //       <Routes>
  //         <Route path="/login" element={<Login onLogin={handleLogin} />} />
  //         <Route path="*" element={<Navigate to="/login" />} />
  //       </Routes>
  //     </Router>
  //   );
  // }

  return (
    <Router>
      <Header/>
      <Routes>
        {/* Uncomment and implement these as you build your pages */}
        {/* <Route path="/dashboard" element={<Dashboard user={user} onLogout={handleLogout} />} />
       
        <Route path="/apply-leave" element={<ApplyLeave user={user} />} />
        <Route path="/employees" element={<Employees user={user} />} />
        <Route path="/leave-requests" element={<LeaveRequests user={user} />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/settings" element={<Settings user={user} />} /> */}
        {/* <Route path="/" element={<Navigate to="/dashboard" />} /> */}
        <Route path="/login" element={<Login  />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-leaves" element={<MyLeaves />} />
        <Route path="/apply-leave" element={<ApplyLeave />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leave-list" element= {<LeaveList/>} />
        <Route path="/home" element={<Home/>}/>
        {/* Add more routes as needed */}
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;