import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import UserReg from './components/UserReg';
import UserLogin from './components/UserLogin';
import ClinicReg from './components/ClinicReg'
import ClinicLogin from './components/ClinicLogin';

function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/UserReg" element={<UserReg/>}/>
    <Route path="/UserLogin" element={<UserLogin/>}/>
     <Route path="/ClinicReg" element={<ClinicReg/>}/> 
     <Route path="/ClinicLogin" element={<ClinicLogin/>}/> 
    </Routes>
    </BrowserRouter>
  );
}

export default App;
