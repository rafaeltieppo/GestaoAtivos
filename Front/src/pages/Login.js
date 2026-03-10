import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUsuario }) => {
    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        fetch('http://10.0.0.214/gestao-ativos/api/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, senha })
        })
            .then(res => res.json())
            .then(data => {
                setLoading(false);
                if (data.sucesso) {
                    setUsuario(data.usuario);
                    localStorage.setItem("usuario", JSON.stringify(data.usuario));
                    navigate("/home");
                } else {
                    setErro(data.mensagem);
                }
            })
            .catch(() => {
                setLoading(false);
                setErro('Erro ao conectar com o servidor')
            });
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%', borderRadius: '12px' }}>
                <h2 className="text-center mb-4">Login</h2>
                {erro && <div className="alert alert-danger">{erro}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nome</label>
                        <input autoFocus type="text" className="form-control" value={nome} onChange={(e)=>setNome(e.target.value)} required/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Senha</label>
                        <input type="password" className="form-control" value={senha} onChange={(e)=>setSenha(e.target.value)} required/>
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>

    );
};

export default Login;
