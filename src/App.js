import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import UserReg from './components/UserReg';
import UserLogin from './components/UserLogin';
import ClinicReg from './components/ClinicReg'
import ClinicLogin from './components/ClinicLogin';
import ClinicDash from './components/ClinicDash';
import DoctorAdd from './components/DoctorAdd';
import UserDash from './components/UserDash';
import UserNav from './components/UserNav';
import ViewAllClinic from './components/ViewAllClinic';
import ClinicDetails from './components/ClinicDetails';

function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/UserReg" element={<UserReg/>}/>
    <Route path="/UserLogin" element={<UserLogin/>}/>
     <Route path="/ClinicReg" element={<ClinicReg/>}/> 
     <Route path="/ClinicLogin" element={<ClinicLogin/>}/> 
     <Route path="/ClinicDash" element={<ClinicDash/>}/> 
     <Route path="/DoctorAdd" element={<DoctorAdd/>}/> 
     <Route path="/UserDash" element={<UserDash/>}/> 
     <Route path="/UserNav" element={<UserNav/>}/> 
     <Route path="/ViewAllClinic" element={<ViewAllClinic/>}/> 
     <Route path="/ClinicDetails/:id" element={<ClinicDetails />} />

    </Routes>
    </BrowserRouter>
  );
}

export default App;
