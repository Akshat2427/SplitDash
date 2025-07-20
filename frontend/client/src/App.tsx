import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';

import MainLayout from './layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Reminder from './pages/Reminder';
import AddData from './components/AddData';
import History from './pages/History';
import Partner from './pages/Partner'; // Import the Partner page

const App: React.FC = () => { 
  const user = useSelector((state: any) => state.user);
  const expense = useSelector((state: any) => state.expense);

  useEffect(() => {
    console.log(user); 
  }, [user]);

  return (
    <div>
      <Routes>
        <Route 
          path="/register" 
          element={!user?.isLogin ? <Login /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/" 
          element={!user?.isLogin ? <MainLayout /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/dashboard" 
          element={user?.isLogin ? <Dashboard /> : <Navigate to="/register" />} 
        />
        <Route 
          path="/profile" 
          element={user?.isLogin ? <Profile /> : <Navigate to="/register" />} 
        />
        <Route 
          path="/reminder" 
          element={user?.isLogin ? <Reminder /> : <Navigate to="/register" />} 
        />
        <Route 
          path="/addData" 
          element={user?.isLogin ? <AddData /> : <Navigate to="/register" />} 
        />
        <Route 
          path="/history" 
          element={user?.isLogin && expense?.expenseID !== '' ? <History /> : <Navigate to="/register" />} 
        />
        <Route 
          path="/partner" 
          element={user?.isLogin ? <Partner /> : <Navigate to="/register" />} 
        />
      </Routes>
    </div>
  );
};

export default App;
