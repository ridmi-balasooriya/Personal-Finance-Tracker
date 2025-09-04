import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthContext from './context/authContext';
import { useContext } from 'react';
import Layout from './layout/Layout';
import PublicLayout from './layout/PublicLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Expenses from './pages/Expenses';
import ForgetPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';

import Dashboard from './pages/Dashboard';

function App() {
  const userObject = useContext(AuthContext);
  const user = userObject.user;
  
  return(        
      <Routes>
        <Route path='/' element={<Navigate to={user? '/dashboard' : '/login'} />} />
        <Route path='/login' element={<PublicLayout><Login /></PublicLayout>} />
        <Route path='/register' element={<PublicLayout><Register /></PublicLayout>} />
        <Route path='/forget-password' element={<PublicLayout><ForgetPassword /></PublicLayout>} />
        <Route path='/reset-password/:token' element={<PublicLayout><ResetPassword /></PublicLayout>}  />

        <Route path='/dashboard' element = {user? <Layout><Dashboard /></Layout> : <Navigate to={'/login'} /> } />
        <Route path='/expenses' element={user? <Layout><Expenses /></Layout> : <Navigate to={'/login'} />} />
        
      </Routes>    
  )
}

export default App;
