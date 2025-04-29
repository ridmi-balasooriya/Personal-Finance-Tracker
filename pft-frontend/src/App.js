import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthContext from './context/authContext';
import { useContext } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Expenses from './pages/Expenses';
import ForgetPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  const user = useContext(AuthContext);
  
  return(    
    <Routes>
      <Route path='/' element={<Navigate to={user? '/expenses' : '/login'} />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/expenses' element={user? <Expenses /> : <Navigate to={'/login'} />} />
      <Route path='/forget-password' element={<ForgetPassword />} />
      <Route path='/reset-password/:token' element={<ResetPassword />}  />
    </Routes>
  )
}

export default App;
