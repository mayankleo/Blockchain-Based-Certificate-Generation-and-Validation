import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Blocks from './pages/Blocks';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Verify from './pages/Verify';
import SuperUserDashboard from './pages/SuperUserDashboard';

function App() {

  return (
    <div>
      <nav>
        <ul className='flex justify-evenly bg-gray-800 text-white p-4'>
          <li><a href="/">Home</a></li>
          <li><a href="/get-all-blocks">Get All Blocks</a></li>
          <li><a href="/superuser-dashboard">SuperUser Dashboard</a></li>
          <li><a href="/login">Login</a></li>
          <li><a href="/register">Register</a></li>
          <li><a href="/admin-dashboard">Admin Dashboard</a></li>
          <li><a href="/user-dashboard">User Dashboard</a></li>
          <li><a href="/verify">Verify</a></li>
        </ul>
      </nav>
      <div>
        <BrowserRouter>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/get-all-blocks" element={<Blocks />} />
              <Route path="/superuser-dashboard" element={<SuperUserDashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/user-dashboard" element={<UserDashboard />} />
              <Route path="/verify" element={<Verify />} />
          </Routes>
        </BrowserRouter>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
