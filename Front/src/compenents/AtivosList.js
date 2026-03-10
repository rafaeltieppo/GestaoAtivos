import React, { useEffect, useState } from 'react';
import AtivosForm from './AtivosForm';

const API_URL = 'http://10.0.0.214/gestao-ativos/api/ativos.php';

const AtivosList = () => {
    const [ativos, setAtivos] = useState([]);
    const [ativoSelecionado, setAtivoSelecionado] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [filtro, setFiltro] = useState('');

    const fetchAtivos = () => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => setAtivos(Array.isArray(data) ? data : []))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchAtivos();
    }, []);

    const handleAdd = () => {
        setAtivoSelecionado(null);
        setShowForm(true);
    };

    const handleEdit = ativo => {
        setAtivoSelecionado(ativo);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = id => {
        if (!window.confirm('Tem certeza que deseja excluir este ativo?')) return;

        fetch(API_URL, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })
            .then(res => res.json())
            .then(() => fetchAtivos())
            .catch(err => console.error(err));
    };

    const ativosFiltrados = ativos.filter(a =>
        a.codigo.toString().includes(filtro) ||
        a.nome.toLowerCase().includes(filtro.toLowerCase()) ||
        a.descricao.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <div className="container">
            {!showForm && (
                <button className="btn mb-4 mt-4"
                        style={{ backgroundColor: '#2c3e50', color: 'white' }}
                        onClick={handleAdd}>
                    Cadastrar
                </button>
            )}

            {showForm && (
                <AtivosForm
                    ativo={ativoSelecionado}
                    onSucesso={() => {
                        setShowForm(false);
                        setAtivoSelecionado(null);
                        fetchAtivos();
                    }}
                    onCancel={() => {
                        setShowForm(false);
                        setAtivoSelecionado(null);
                    }}
                />
            )}

            <input
                type="text"
                className="form-control mb-3"
                placeholder="Buscar por código, nome ou descrição..."
                value={filtro}
                onChange={e => setFiltro(e.target.value)}
            />

            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Código</th>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                {ativosFiltrados.length > 0 ? (
                    ativosFiltrados.map(a => (
                        <tr key={a.id}>
                            <td>{a.codigo}</td>
                            <td>{a.nome}</td>
                            <td>{a.descricao}</td>
                            <td>
                                <button
                                    className="btn btn-sm me-2"
                                    style={{ backgroundColor: '#2c3e50' }}
                                    onClick={() => handleEdit(a)}
                                >
                                    ✏️
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(a.id)}
                                >
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4">Nenhum ativo encontrado</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default AtivosList;