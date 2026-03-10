import React, { useEffect, useState } from 'react';
import RomaneiosForm from './RomaneiosForm';

const RomaneiosList = () => {
    const [romaneios, setRomaneios] = useState([]);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [romaneioSelecionado, setRomaneioSelecionado] = useState(null);
    const [filtroStatus, setFiltroStatus] = useState('todos');
    const [detalhesAtivos, setDetalhesAtivos] = useState(null);

    const carregarRomaneios = () => {
        fetch('http://10.0.0.214/gestao-ativos/api/romaneios.php')
            .then(res => res.json())
            .then(data => setRomaneios(Array.isArray(data) ? data : []))
            .catch(err => console.error('Erro ao carregar romaneios', err));
    };

    useEffect(() => {
        carregarRomaneios();
    }, []);

    const editarRomaneio = async (id) => {
        try {
            const res = await fetch(`http://10.0.0.214/gestao-ativos/api/romaneios.php?id=${id}`);
            const data = await res.json();
            setRomaneioSelecionado({
                ...data.romaneio,
                ativos: data.ativos || [],
            });
            setMostrarForm(true);
            setDetalhesAtivos(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error('Erro ao carregar romaneio:', err);
        }
    };

    const verDetalhes = async (id) => {
        try {
            const res = await fetch(`http://10.0.0.214/gestao-ativos/api/romaneios.php?id=${id}`);
            const data = await res.json();
            setDetalhesAtivos(data.ativos || []);
            setMostrarForm(false);
            setRomaneioSelecionado(null);
        } catch (err) {
            console.error('Erro ao carregar detalhes:', err);
        }
    };

    const romaneiosFiltrados = romaneios.filter(r => {
        return filtroStatus === 'todos' || r.status === filtroStatus;
    });

    return (
        <div className="mt-4">
            <button
                className="btn btn-success mb-4"
                style={{ backgroundColor: '#2c3e50' }}
                onClick={() => {
                    setRomaneioSelecionado(null);
                    setMostrarForm(!mostrarForm);
                    setDetalhesAtivos(null);
                }}
            >
                {mostrarForm ? 'Fechar Formulário' : 'Registrar Romaneio'}
            </button>

            {mostrarForm && (
                <RomaneiosForm
                    romaneio={romaneioSelecionado}
                    onSucesso={() => {
                        setMostrarForm(false);
                        setRomaneioSelecionado(null);
                        carregarRomaneios();
                    }}
                    onCancel={() => {
                        setMostrarForm(false);
                        setRomaneioSelecionado(null);
                    }}
                />

            )}

            {detalhesAtivos && (
                <div className="card p-3 mb-4 shadow">
                    <h5>Ativos do Romaneio</h5>
                    <ul className="list-group">
                        {detalhesAtivos.length > 0 ? (
                            detalhesAtivos.map(a => (
                                <li key={a.codigo} className="list-group-item">
                                    {a.nome} ({a.codigo}) - {a.descricao}
                                </li>
                            ))
                        ) : (
                            <li className="list-group-item text-muted">Nenhum ativo</li>
                        )}
                    </ul>

                    <button
                        className="btn btn-secondary mt-3"
                        onClick={() => setDetalhesAtivos(null)}
                    >
                        Fechar Detalhes
                    </button>



                </div>
            )}

            <div className="mb-3">
                {['todos', 'em_obra', 'devolvido'].map(s => (
                    <button
                        key={s}
                        className={`btn me-2 ${filtroStatus === s ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setFiltroStatus(s)}
                    >
                        {s === 'todos' ? 'Todos' : s === 'em_obra' ? 'Em Obra' : 'Devolvido'}
                    </button>
                ))}
            </div>

            <table className="table table-striped">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Projeto</th>
                    <th>Cliente</th>
                    <th>Responsável</th>
                    <th>Data Saída</th>
                    <th>Data Retorno</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                {romaneiosFiltrados.length > 0 ? (
                    romaneiosFiltrados.map(r => (
                        <tr key={r.id}>
                            <td>{r.id}</td>
                            <td>{r.numero_projeto}</td>
                            <td>{r.cliente}</td>
                            <td>{r.responsavel}</td>
                            <td>{new Date(r.data_romaneio).toLocaleString()}</td>
                            <td>{r.data_retorno ? new Date(r.data_retorno).toLocaleString() : '-'}</td>
                            <td>
                                    <span className={`badge ${r.status === 'em_obra' ? 'bg-warning' : 'bg-success'}`}>
                                        {r.status === 'em_obra' ? 'Em Obra' : 'Devolvido'}
                                    </span>
                            </td>
                            <td>
                                <button
                                    className="btn btn-sm me-2"
                                    style={{ backgroundColor: '#2c3e50' }}
                                    onClick={() => editarRomaneio(r.id)}
                                >
                                    ✏️
                                </button>
                                <button
                                    className="btn btn-sm"
                                    style={{ backgroundColor: '#2c3e50' }}
                                    onClick={() => verDetalhes(r.id)}
                                >
                                    👁️
                                </button>
                                <button
                                    className="btn btn-sm ms-2"
                                    style={{ backgroundColor: '#2c3e50', color: '#FFF' }}
                                >
                                    CSV
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="8" className="text-center text-muted">Nenhum romaneio encontrado</td>
                    </tr>
                )}
                </tbody>

            </table>
        </div>
    );
};

export default RomaneiosList;
