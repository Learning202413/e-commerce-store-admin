import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, LogIn, ShoppingBag } from 'lucide-react';
import '../estilos.css';
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Credenciales inválidas. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="login-split-container">
        {/* PANEL IZQUIERDO - Branding e Imagen (E-commerce) */}
        <div className="login-brand-panel">
          <div className="login-overlay"></div>
          <div className="login-brand-content">
            <h1>
              Gestión Central de <br />
              <span className="text-highlight">E-commerce</span>
            </h1>
            <p>
              Administre el catálogo de prendas, controle el inventario en tiempo real
              y gestione el flujo de órdenes y reseñas de clientes.
            </p>
          </div>
        </div>

        {/* PANEL DERECHO - Formulario Minimalista */}
        <div className="login-form-panel">
          <div className="login-form-wrapper">

            {/* Logo y Encabezado */}
            <div className="login-header">
              <div className="logo-icon">
                <ShoppingBag size={24} />
              </div>
              <div>
                <h2 className="logo-title">Store Admin</h2>
                <span className="logo-subtitle">PLATAFORMA DE RETAIL</span>
              </div>
            </div>

            <div className="login-titles">
              <h3>Bienvenido al Portal</h3>
              <p>Ingrese sus credenciales administrativas.</p>
            </div>

            {/* Caja de Info (Opcional) */}
            <div className="credentials-hint">
              <div className="hint-row">
                <span>Usuario:</span> <strong>admin</strong>
              </div>
              <div className="hint-row">
                <span>Contraseña:</span> <strong>admin1</strong>
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="login-form">
              {error && <div className="login-error">{error}</div>}

              <div className="input-group">
                <User className="input-icon" size={20} />
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Usuario"
                    required
                />
              </div>

              <div className="input-group">
                <Lock className="input-icon" size={20} />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    required
                />
              </div>

              <button type="submit" className="login-btn-primary" disabled={loading}>
                {loading ? 'Verificando...' : 'Iniciar Sesión'}
                {!loading && <LogIn size={18} />}
              </button>
            </form>

            {/* Footer */}
            <div className="login-footer">
              UPLA - Ingeniería de Sistemas © 2026
            </div>

          </div>
        </div>
      </div>
  );
};

export default Login;