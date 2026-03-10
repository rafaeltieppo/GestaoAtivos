import React, { useState, useEffect } from 'react';

const AtivosForm = ({ onSucesso, ativo, onCancel }) => {
    const [nome, setNome] = useState('');
    const [codigo, setCodigo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [mensagem, setMensagem] = useState('');

    const isEdit = Boolean(ativo?.id);

    useEffect(() => {
        if (isEdit) {
            setNome(ativo.nome || '');
            setCodigo(ativo.codigo || '');
            setDescricao(ativo.descricao || '');
        } else {
            setNome('');
            setCodigo('');
            setDescricao('');
        }
    }, [isEdit, ativo]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            id: ativo?.id,
            nome,
            codigo: parseInt(codigo, 10),
            descricao
        };

        fetch('http://10.0.0.214/gestao-ativos/api/ativos.php', {
            method: isEdit ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                setMensagem(data.mensagem || '');
                if (data.sucesso) onSucesso?.();
            })
            .catch(() => setMensagem('Erro ao conectar com o servidor'));
    };

    return (
        <div className="card p-3 mb-4 shadow">
            <h5 className="mb-3">{isEdit ? 'Editar Ativo' : 'Cadastrar Ativo'}</h5>

            {mensagem && <div className="alert alert-info">{mensagem}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nome</label>
                    <input
                        type="text"
                        className="form-control"
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Código</label>
                    <input
                        type="number"
                        className="form-control"
                        value={codigo}
                        onChange={e => setCodigo(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Descrição</label>
                    <textarea
                        className="form-control"
                        value={descricao}
                        onChange={e => setDescricao(e.target.value)}
                        rows={2}
                        required
                    />
                </div>

                <div className="d-flex">
                    <button type="submit" className="btn btn-primary me-2">
                        {isEdit ? 'Salvar Alterações' : 'Cadastrar'}
                    </button>
                    <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AtivosForm;
