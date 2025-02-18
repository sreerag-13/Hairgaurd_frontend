import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import UserReg from './components/UserReg';

function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/UserReg" element={<UserReg/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
