import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Api_ativos = 'http://10.0.0.214/gestao-ativos/api/ativos.php';
const Api_movimentacoes = 'http://10.0.0.214/gestao-ativos/api/movimentacoes.php';

const Home = () => {
    const navigate = useNavigate();
    const [ativos, setAtivos] = useState([]);
    const [movimentacoes, setMovimentacoes] = useState([]);

    useEffect(() => {
        fetch(Api_ativos)
            .then(res => res.json())
            .then(data => setAtivos(Array.isArray(data) ? data : []))
            .catch(err => console.error(err));

        fetch(Api_movimentacoes)
            .then(res => res.json())
            .then(data => setMovimentacoes(Array.isArray(data) ? data : []))
            .catch(err => console.error(err));
    }, []);

    const pendentes = movimentacoes.filter(m => m.status === 'pendente').length;
    const devolvidas = movimentacoes.filter(m => m.status === 'devolvido').length;

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-5">Dashboard de Ativos</h1>

            <div className="row mb-5 g-3">
                <div className="col-md-4">
                    <div className="card text-white shadow h-100 text-center" style={{ backgroundColor: '#2c3e50'}}>
                        <div className="card-body">
                            <i className="bi bi-box-seam display-3 mb-3"></i>
                            <h5 className="card-title">Ativos Cadastrados</h5>
                            <p className="display-5">{ativos.length}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-warning shadow h-100 text-center">
                        <div className="card-body">
                            <i className="bi bi-clock-history display-3 mb-3"></i>
                            <h5 className="card-title">Movimentações Pendentes</h5>
                            <p className="display-5">{pendentes}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-success shadow h-100 text-center">
                        <div className="card-body">
                            <i className="bi bi-check-circle display-3 mb-3"></i>
                            <h5 className="card-title">Movimentações Devolvidas</h5>
                            <p className="display-5">{devolvidas}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mb-5 g-4">
                <div className="col-md-4">
                    <div
                        className="card shadow h-100 text-center p-4"
                        style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                        onClick={() => navigate('/ativos')}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <i className="bi bi-box-seam display-1 mb-3"></i>
                        <h3>Ativos</h3>
                        <p>Gerencie todos os ativos cadastrados.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div
                        className="card shadow h-100 text-center p-4"
                        style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                        onClick={() => navigate('/movimentacoes')}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <i className="bi bi-arrow-left-right display-1 mb-3"></i>
                        <h3>Movimentações</h3>
                        <p>Registre saídas e devoluções de ativos.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div
                        className="card shadow h-100 text-center p-4"
                        style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                        onClick={() => navigate('/romaneios')}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <i className="bi bi-file-earmark-text display-1 mb-3"></i>
                        <h3>Romaneios</h3>
                        <p>Controle ferramentas enviadas para obras e gere relatórios.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
