import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Contexts
import { AuthProvider } from './context/AuthContext';
import { CityProvider } from './context/CityContext';
import { ThemeProvider } from './components/ThemeProvider';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewReport from './pages/NewReport';
import MyComplaints from './pages/MyComplaints';
import Settings from './pages/Settings';

const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
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
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Routes>
          </CityProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
