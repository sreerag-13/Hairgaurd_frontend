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
import CompanyReg from './components/CompanyReg';
import CompanyLog from './components/CompanyLog';
import CompanyDash from './components/CompanyDash';

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
     <Route path="/CompanyReg" element={<CompanyReg/>} />
     <Route path="/CompanyLog" element={<CompanyLog/>} />
     <Route path="/CompanyDash" element={<CompanyDash/>} />

    </Routes>
    </BrowserRouter>
  );
}

export default App;
