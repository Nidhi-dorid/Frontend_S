import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Contexts
import { AuthProvider } from './context/AuthContext';
import { CityProvider } from './context/CityContext';

// Components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import NewReport from './pages/NewReport';
import MyComplaints from './pages/MyComplaints';
import Settings from './pages/Settings';
import AboutUs from './pages/AboutUs';
import HowItWorks from './pages/HowItWorks';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CityProvider>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/new-report" element={<NewReport />} />
              <Route path="/my-complaints" element={<MyComplaints />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/about" element={<AboutUs />} />
            </Route>
          </Routes>
        </CityProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
