import React, { useEffect, useState } from 'react';

const MovimentacaoForm = ({ onNovaMovimentacao, movimento, onCancel }) => {
    const [codigoAtivo, setCodigoAtivo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [funcionario, setFuncionario] = useState('');
    const [projeto, setProjeto] = useState('');
    const [status, setStatus] = useState('pendente');
    const [mensagem, setMensagem] = useState('');

    const isEdit = Boolean(movimento?.id);

    useEffect(() => {
        if (isEdit) {
            setCodigoAtivo(movimento.codigo_ativo || '');
            setDescricao(movimento.descricao || '');
            setFuncionario(movimento.funcionario_responsavel || '');
            setProjeto(movimento.projeto || '');
            setStatus(movimento.status || 'pendente');
        } else {
            setCodigoAtivo('');
            setDescricao('');
            setFuncionario('');
            setProjeto('');
            setStatus('pendente');
        }
    }, [movimento, isEdit]);

    const fetchDescricaoAtivo = async codigo => {
        if (!codigo) {
            setDescricao('');
            return;
        }
        try {
            const res = await fetch(`http://10.0.0.214/gestao-ativos/api/ativos.php?codigo=${codigoAtivo}`);
            const data = await res.json();

            const ativo = data.find(a => a.codigo === codigoAtivo.toString());

            if (ativo) {
                setDescricao(ativo.descricao || '');
                if (ativo.status === 'pendente') {
                    setMensagem("Ativo em uso!");
                } else {
                    setMensagem("");
                }
            } else {
                setDescricao('');
            }

        } catch (err) {
            console.error(err);
            setDescricao('');
        }
    };

    // Busca descrição automatico sempre que o código do ativo mudar
    useEffect(() => {
        fetchDescricaoAtivo(codigoAtivo);
    }, [codigoAtivo]);


    const handleSubmit = e => {
        e.preventDefault();

        if (mensagem.includes("Ativo em uso!")) {
            return;
        }

        if(!descricao) {
            setMensagem("Ativo não cadastrado no sistema!");
            return;
        }

        const codigoAtivoNum = parseInt(codigoAtivo, 10);
        if (!codigoAtivoNum || !funcionario) {
            setMensagem('Todos os campos são obrigatórios');
            return;
        }

        const payload = {
            id: movimento?.id,
            codigo_ativo: codigoAtivoNum,
            descricao: descricao.trim() || '',
            funcionario_responsavel: funcionario.trim(),
            projeto: projeto.trim(),
            status: isEdit ? status : 'pendente'
        };

        fetch(`http://10.0.0.214/gestao-ativos/api/movimentacoes.php`, {
            method: isEdit ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                setMensagem(data.mensagem || '');
                if (data.sucesso) onNovaMovimentacao?.();
            })
            .catch(() => setMensagem('Erro ao conectar com o servidor'));
    };

    return (
        <div className="card p-3 mb-4 shadow">
            <h5 className="mb-3">{isEdit ? 'Editar Movimentação' : 'Registrar Movimentação'}</h5>

            {mensagem && <div className="alert alert-info">{mensagem}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Código do Ativo (nº)</label>
                    <input
                        type="number"
                        className="form-control"
                        value={codigoAtivo}
                        onChange={e => setCodigoAtivo(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Descrição</label>
                    <input
                        type="text"
                        className="form-control"
                        value={descricao}
                        readOnly
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Funcionário Responsável</label>
                    <input
                        type="text"
                        className="form-control"
                        value={funcionario}
                        onChange={e => setFuncionario(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Projeto</label>
                    <input
                        type="text"
                        className="form-control"
                        value={projeto}
                        onChange={e => setProjeto(e.target.value)}
                    />
                </div>

                {isEdit && (
                    <div className="mb-3">
                        <label className="form-label">Status</label>
                        <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
                            <option value="pendente">Pendente</option>
                            <option value="devolvido">Devolvido</option>
                        </select>
                    </div>
                )}

                <div className="d-flex">
                    <button type="submit" className="btn btn-primary me-2">
                        {isEdit ? 'Salvar Alterações' : 'Registrar'}
                    </button>
                    <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MovimentacaoForm;
