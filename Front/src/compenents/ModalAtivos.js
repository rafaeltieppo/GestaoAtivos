import React, { useState, useEffect } from 'react';

const ModalAtivos = ({ ativos, selecionados, onConfirmar, onCancelar }) => {
    const [ativosMarcados, setAtivosMarcados] = useState([]);

    // Inicializa o estado interno com os ativos já selecionados
    useEffect(() => {
        setAtivosMarcados(selecionados || []);
    }, [selecionados]);

    const toggleAtivo = (codigo) => {
        if (ativosMarcados.includes(codigo)) {
            setAtivosMarcados(ativosMarcados.filter(c => c !== codigo));
        } else {
            setAtivosMarcados([...ativosMarcados, codigo]);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onCancelar}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
                <h5>Selecionar Ativos</h5>
                <ul className="list-group" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {ativos.length > 0 ? ativos.map(a => (
                        <li key={a.codigo} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <input
                                    type="checkbox"
                                    checked={ativosMarcados.includes(a.codigo)}
                                    onChange={() => toggleAtivo(a.codigo)}
                                />
                                <span style={{ marginLeft: '10px' }}>
                                    {a.nome} ({a.codigo}) - {a.descricao}
                                </span>
                            </div>
                            <span className={`badge ${a.disponibilidade === 'disponível' ? 'bg-success' : 'bg-danger'}`}>
                                {a.disponibilidade}
                            </span>
                        </li>
                    )) : (
                        <li className="list-group-item text-muted">Nenhum ativo disponível</li>
                    )}
                </ul>

                <div className="d-flex justify-content-end mt-3">
                    <button className="btn me-2"
                            style={{ backgroundColor: '#2c3e50', color: 'white' }}
                            onClick={onCancelar}>Cancelar</button>
                    <button className="btn btn-success"
                            style={{ backgroundColor: '#2c3e50', color: 'white' }}
                            onClick={() => onConfirmar(ativosMarcados)}>Confirmar</button>
                </div>
            </div>
        </div>
    );
};

export default ModalAtivos;
