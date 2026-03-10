import React, { useEffect, useState } from 'react';
import ModalAtivos from './ModalAtivos'; // importa o modal

const RomaneiosForm = ({ romaneio, onSucesso, onCancel }) => {
    const [form, setForm] = useState({
        id: null,
        numero_projeto: '',
        cliente: '',
        responsavel: '',
        data_romaneio: '',
        data_retorno: '',
        status: 'em_obra',
        ativos: []
    });

    const [ativos, setAtivos] = useState([]);
    const [mostrarModalAtivos, setMostrarModalAtivos] = useState(false);

    useEffect(() => {
        if (romaneio) {
            setForm({
                ...romaneio,
                ativos: romaneio.ativos?.map(a => a.codigo) || []
            });
        }
    }, [romaneio]);

    useEffect(() => {
        fetch('http://10.0.0.214/gestao-ativos/api/ativos.php')
            .then(res => res.json())
            .then(data => setAtivos(data))
            .catch(err => console.error('Erro ao carregar ativos', err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = form.id ? 'PUT' : 'POST';
        const url = 'http://10.0.0.214/gestao-ativos/api/romaneios.php';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (data.sucesso) onSucesso();
            else alert(data.mensagem || 'Erro ao salvar romaneio');
        } catch (err) {
            console.error('Erro ao salvar romaneio:', err);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="card p-4 mb-4 shadow">
                <h5>{form.id ? 'Editar Romaneio' : 'Novo Romaneio'}</h5>

                <div className="mb-3">
                    <label className="form-label">Número do Projeto</label>
                    <input
                        type="text"
                        name="numero_projeto"
                        value={form.numero_projeto}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Cliente</label>
                    <input
                        type="text"
                        name="cliente"
                        value={form.cliente}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Responsável</label>
                    <input
                        type="text"
                        name="responsavel"
                        value={form.responsavel}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                {form.id && (
                    <div className="mb-3">
                        <label className="form-label">Status</label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="form-select"
                            required
                        >
                            <option value="em_obra">Em Obra</option>
                            <option value="devolvido">Devolvido</option>
                        </select>
                    </div>
                )}

                <div className="mb-3">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setMostrarModalAtivos(true)}
                    >
                        Adicionar/Remover Ativos ({form.ativos.length})
                    </button>
                </div>

                <div className="d-flex justify-content-between">
                    <button type="submit" className="btn"
                            style={{ backgroundColor: '#2c3e50', color: 'white' }}
                    >

                        {form.id ? 'Atualizar' : 'Cadastrar'}
                    </button>
                    <button type="button" className="btn"
                            style={{ backgroundColor: '#2c3e50', color: 'white' }}
                            onClick={onCancel}>
                        Cancelar
                    </button>
                </div>
            </form>

            {mostrarModalAtivos && (
                <ModalAtivos
                    ativos={ativos}
                    selecionados={form.ativos}
                    onConfirmar={(selecionados) => {
                        setForm({ ...form, ativos: selecionados });
                        setMostrarModalAtivos(false);
                    }}
                    onCancelar={() => setMostrarModalAtivos(false)}
                />
            )}
        </>
    );
};

export default RomaneiosForm;
