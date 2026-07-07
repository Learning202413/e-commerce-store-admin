import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Settings, LogOut, LayoutDashboard, Package, ShoppingBag, User } from 'lucide-react';
import '../App.css'; // Conexión a tus estilos globales
import '../estilos.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // Hook para saber en qué página estamos

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Función de UX para resaltar el enlace activo
    const isActive = (path) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname.startsWith(path);
    };

    return (
        <header className="navbar">
            <div className="container navbar-content">

                {/* LOGO EMPRESARIAL */}
                <Link to="/" className="navbar-logo">
                    <div className="logo-icon-small">
                        <ShoppingBag size={20} />
                    </div>
                    <span>Store Admin</span>
                </Link>

                <div className="navbar-menu">
                    {user ? (
                        <>
                            {/* ENLACES DE NAVEGACIÓN */}
                            <nav className="navbar-links">
                                <Link
                                    to="/"
                                    className={`nav-link ${isActive('/') ? 'active' : ''}`}
                                >
                                    <LayoutDashboard size={18} /> Dashboard
                                </Link>
                                <Link
                                    to="/products"
                                    className={`nav-link ${isActive('/products') ? 'active' : ''}`}
                                >
                                    <Package size={18} /> Inventario
                                </Link>
                            </nav>

                            <div className="navbar-divider"></div>

                            {/* PERFIL DE USUARIO Y SALIDA */}
                            <div className="navbar-user">
                                <div className="user-badge" title="Usuario Administrativo">
                                    <User size={16} />
                                    <span>{user.username}</span>
                                </div>

                                <button
                                    className="secondary logout-btn"
                                    onClick={handleLogout}
                                >
                                    <LogOut size={16} /> <span>Salir</span>
                                </button>
                            </div>
                        </>
                    ) : (
                        <Link to="/login" className="login-link">
                            Iniciar Sesión
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;