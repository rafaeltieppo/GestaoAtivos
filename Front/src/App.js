import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Ativos from './pages/Ativos';
import Movimentacoes from './pages/Movimentacoes';
import Romaneios from "./pages/Romaneios";
import Home from './pages/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function AppRoutes({ usuario, setUsuario }) {
    const location = useLocation();

    const ProtectedRoute = ({ children }) => {
        return usuario ? children : <Navigate to="/login" />;
    };

    return (
        <>
            {usuario && location.pathname !== '/login' && (
                <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#2c3e50'}}>
                    <div className="container-fluid">
                        <Link className="navbar-brand" to="/home">Gestão de Ativos</Link>
                        <div className="d-flex ms-auto align-items-center">
                            <span className="navbar-text me-3">Olá, {usuario.nome}</span>
                            <button className="btn btn-outline-light" onClick={() => {
                                setUsuario(null);
                                localStorage.removeItem('usuario');
                            }}>
                                Sair
                            </button>
                        </div>
                    </div>
                </nav>
            )}

            <div className="container mt-4">
                <Routes>
                    <Route path="/login" element={<Login setUsuario={setUsuario} />} />
                    <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="/ativos" element={<ProtectedRoute><Ativos /></ProtectedRoute>} />
                    <Route path="/movimentacoes" element={<ProtectedRoute><Movimentacoes /></ProtectedRoute>} />
                    <Route path="/romaneios" element={<ProtectedRoute><Romaneios /></ProtectedRoute>} />
                    <Route path="*" element={<Navigate to={usuario ? "/home" : "/login"} />} />
                </Routes>
            </div>
        </>
    );
}

function App() {
    const [usuario, setUsuario] = useState(() => {
        const usuarioSalvo = localStorage.getItem('usuario');
        return usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
    });

    return (
        <Router>
            <AppRoutes usuario={usuario} setUsuario={setUsuario} />
        </Router>
    );
}

export default App;
