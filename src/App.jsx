import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductsManager from './pages/ProductsManager';
import ProductForm from './pages/ProductForm';
import Navbar from './components/Navbar';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex justify-center items-center" style={{ height: '100vh' }}><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const AppContent = () => {
  const { user } = useAuth();
  return (
    <>
      {user && <Navbar />}
      <main>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><ProductsManager /></ProtectedRoute>} />
          <Route path="/products/new" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
