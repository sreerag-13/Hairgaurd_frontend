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
import AddProduct from './components/AddProduct';
import ComNav from './components/ComNav';
import ViewAllProduct from './components/ViewAllProduct';
import ProductDetails from './components/ProductDetails';
import Predict from './components/Predict';
import Appointment from './components/Appointment';
import UserAppointment from './components/UserAppointment';
import UserProfile from './components/UserProfile';
import DoctorProfile from './components/DoctorProfile';
import CompanyProfile from './components/CompanyProfile';
import BookedUser from './components/BookedUser';
import UserCart from './components/UserCart';

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
     <Route path="/AddProduct" element={<AddProduct/>} />
     <Route path="/ComNav" element={<ComNav/>} />
     <Route path="/ViewAllProduct" element={<ViewAllProduct/>} />
     <Route path="/ProductDetails/:id" element={<ProductDetails />} />
     <Route path="/Predict" element={<Predict />} />

     <Route path="/UserAppointment" element={<UserAppointment/>} />
     <Route path="/UserProfile" element={<UserProfile/>} />

     <Route path="/Appointment" element={<Appointment />} /> {/* Fixed typo */}
            <Route path="/DoctorProfile/:id" element={<DoctorProfile />} /> {/* Dynamic ID */}
            <Route path="/CompanyProfile" element={<CompanyProfile />} />
            <Route path="/BookedUser" element={<BookedUser/>} />
            <Route path="/UserCart" element={<UserCart/>} />
          

    </Routes>
    </BrowserRouter>
  );
}

export default App;
