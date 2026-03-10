import React, { useEffect, useState } from 'react';
import MovimentacaoForm from './MovimentacaoForm';

const Api_URL = 'http://10.0.0.214/gestao-ativos/api/movimentacoes.php';
const Romaneios_URL = 'http://10.0.0.214/gestao-ativos/api/romaneios.php';

const MovimentacoesList = () => {
    const [movs, setMovs] = useState([]);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [movimentoSelecionado, setMovimentoSelecionado] = useState(null);
    const [filtro, setFiltro] = useState('');
    const [statusFiltro, setStatusFiltro] = useState('todos');
    const [projetoFiltro, setProjetoFiltro] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [ativosEmObra, setAtivosEmObra] = useState([]);

    const fetchMovs = () => {
        fetch(Api_URL)
            .then(res => res.json())
            .then(data => setMovs(Array.isArray(data) ? data : []))
            .catch(err => console.error(err));
    };

    const fetchAtivosEmObra = () => {
        fetch(Romaneios_URL)
            .then(res => res.json())
            .then(data => {
                let ativos = [];
                data.forEach(r => {
                    if (r.status === 'em_obra' && r.ativos) {
                        ativos = [...ativos, ...r.ativos.split(',').map(c => parseInt(c))];
                    }
                });
                setAtivosEmObra(ativos);
            });
    };

    useEffect(() => {
        fetchMovs();
        fetchAtivosEmObra();
    }, []);

    const handleNovaOuEdicao = () => {
        fetchMovs();
        fetchAtivosEmObra();
        setMostrarForm(false);
        setMovimentoSelecionado(null);
    };

    const handleEditar = mov => {
        setMovimentoSelecionado(mov);
        setMostrarForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const movsFiltrados = movs.filter(m => {
        if (statusFiltro !== 'todos' && m.status !== statusFiltro) return false;

        const matchTexto =
            m.codigo_ativo.toString().includes(filtro) ||
            m.descricao.toLowerCase().includes(filtro.toLowerCase()) ||
            m.funcionario_responsavel.toLowerCase().includes(filtro.toLowerCase());

        const matchProjeto = m.projeto.toLowerCase().includes(projetoFiltro.toLowerCase());

        let matchData = true;
        if (dataInicio) matchData = matchData && (new Date(m.data_saida) >= new Date(dataInicio));
        if (dataFim) matchData = matchData && (new Date(m.data_saida) <= new Date(dataFim));

        return matchTexto && matchProjeto && matchData;
    });

    const ativoBloqueado = codigo => ativosEmObra.includes(codigo);

    return (
        <div className="mt-4">
            <button
                className="btn btn-success mb-4"
                style={{ backgroundColor: '#2c3e50' }}
                onClick={() => {
                    setMovimentoSelecionado(null);
                    setMostrarForm(!mostrarForm);
                }}
            >
                {mostrarForm ? 'Fechar Formulário' : 'Registrar Movimentação'}
            </button>

            {mostrarForm && (
                <MovimentacaoForm
                    onNovaMovimentacao={handleNovaOuEdicao}
                    movimento={movimentoSelecionado}
                    ativosEmObra={ativosEmObra}
                    onCancel={() => {
                        setMostrarForm(false);
                        setMovimentoSelecionado(null);
                    }}
                />
            )}

            <div className="mb-3">
                {['todos', 'pendente', 'devolvido'].map(s => (
                    <button
                        key={s}
                        className={`btn me-2 ${statusFiltro === s ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setStatusFiltro(s)}
                    >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                ))}
            </div>

            <input
                type="text"
                className="form-control mb-2"
                placeholder="Buscar por código, descrição ou responsável"
                value={filtro}
                onChange={e => setFiltro(e.target.value)}
            />

            <div className="mb-3">
                <label className="form-label">Projeto</label>
                <input
                    type="text"
                    className="form-control"
                    value={projetoFiltro}
                    onChange={e => setProjetoFiltro(e.target.value)}
                />
            </div>

            <div className="d-flex mb-3 gap-2">
                <input type="date" className="form-control" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
                <input type="date" className="form-control" value={dataFim} onChange={e => setDataFim(e.target.value)} />
            </div>

            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Código do Ativo</th>
                    <th>Descrição</th>
                    <th>Responsável</th>
                    <th>Projeto</th>
                    <th>Data Saída</th>
                    <th>Data Devolução</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                {movsFiltrados.length > 0 ? (
                    movsFiltrados.map(m => {
                        const dataSaida = new Date(m.data_saida);
                        const hoje = new Date();
                        const diffTime = hoje - dataSaida;
                        const diasEmUso = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                        const alerta = m.status === 'pendente' && diasEmUso >= 10;
                        const bloqueado = ativoBloqueado(m.codigo_ativo);

                        return (
                            <tr key={m.id} className={alerta ? 'table-danger' : ''}>
                                <td>{m.codigo_ativo}</td>
                                <td>
                                    {m.descricao} {alerta && <span className="text-danger fw-bold" title={`Ativo pendente há ${diasEmUso} dias`}>⚠️</span>}
                                    {bloqueado && <span className="text-warning fw-bold ms-2" title="Ativo em obra">🏗️</span>}
                                </td>
                                <td>{m.funcionario_responsavel}</td>
                                <td>{m.projeto}</td>
                                <td>{m.data_saida}</td>
                                <td>{m.data_devolucao || '-'}</td>
                                <td>
                                    <span className={`badge ${m.status === 'pendente' ? 'bg-warning' : 'bg-success'} fs-6`}>
                                        {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn btn-sm me-2"
                                            style={{ backgroundColor: '#2c3e50' }}
                                            onClick={() => handleEditar(m)}>✏️</button>
                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan="8">Nenhuma movimentação encontrada</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default MovimentacoesList;
