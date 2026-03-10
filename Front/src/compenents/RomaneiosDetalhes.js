import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const RomaneiosDetalhes = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [romaneio, setRomaneio] = useState(null);
    const [ativos, setAtivos] = useState([]);
    const [mensagem, setMensagem] = useState('');

    useEffect(() => {
        fetch(`http://10.0.0.214/gestao-ativos/api/romaneios.php?id=${id}`)
            .then(res => res.json())
            .then(data => {
                setRomaneio(data.romaneio);
                setAtivos(data.ativos || []);
            })
            .catch(() => setMensagem('Erro ao carregar dados do romaneio'));
    }, [id]);

    const marcarComoDevolvido = () => {
        fetch(`http://10.0.0.214/gestao-ativos/api/romaneios.php`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: parseInt(id), status: 'devolvido' })
        })
            .then(res => res.json())
            .then(data => {
                setMensagem(data.mensagem || '');
                if (data.sucesso) {
                    setRomaneio(prev => ({ ...prev, data_retorno: new Date().toISOString() }));
                }
            })
            .catch(() => setMensagem('Erro ao atualizar status'));
    };

    const gerarCSV = () => {
        window.open(`http://10.0.0.214/gestao-ativos/api/romaneios_csv.php?id=${id}`, '_blank');
    };

    if (!romaneio) return <p>Carregando...</p>;

    const status = romaneio.data_retorno ? 'Devolvido' : 'Em Obra';

    return (
        <div className="mt-4">
            <h4>Detalhes do Romaneio #{romaneio.id}</h4>

            {mensagem && <div className="alert alert-info">{mensagem}</div>}

            <div className="mb-3">
                <strong>Projeto:</strong> {romaneio.numero_projeto}<br />
                <strong>Cliente:</strong> {romaneio.cliente}<br />
                <strong>Responsável:</strong> {romaneio.responsavel}<br />
                <strong>Data do Romaneio:</strong> {new Date(romaneio.data_romaneio).toLocaleDateString()}<br />
                <strong>Data de Retorno:</strong> {romaneio.data_retorno ? new Date(romaneio.data_retorno).toLocaleDateString() : '-'}<br />
                <strong>Status:</strong> <span className={`badge ${status === 'Em Obra' ? 'bg-warning' : 'bg-success'}`}>{status}</span>
            </div>

            <h5>Ativos Enviados</h5>
            <ul className="list-group mb-4">
                {ativos.length > 0 ? (
                    ativos.map(a => (
                        <li key={a.codigo} className="list-group-item">
                            <strong>{a.nome}</strong> ({a.codigo}) - {a.descricao}
                        </li>
                    ))
                ) : (
                    <li className="list-group-item text-muted">Nenhum ativo vinculado</li>
                )}
            </ul>

            <div className="d-flex gap-2">
                {!romaneio.data_retorno && (
                    <button className="btn btn-success" onClick={marcarComoDevolvido}>
                        Marcar como Devolvido
                    </button>
                )}
                <button className="btn btn-outline-primary" onClick={gerarCSV}>
                    Gerar CSV
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/romaneios')}>
                    Voltar
                </button>
            </div>
        </div>
    );
};

export default RomaneiosDetalhes;
