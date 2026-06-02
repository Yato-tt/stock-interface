import { useState } from 'react';
import { toast } from 'react-toastify';

import TextField from '../Fields/TextField';
import TextFieldQuantity from '../Fields/TextFieldQuantity';
import Button from '../Button';

// 1. Alterado de 'produto' para 'produtos' nas propriedades recebidas
export default function MovimentacaoForm({ produtos = [], onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    produto_id: '', // Novo estado para controlar o id do produto selecionado
    tipo: 'entrada',
    quantidade: '',
    motivo: '',
  });

  // Encontra o objeto do produto selecionado para exibir o estoque atual em tempo real
  const produtoSelecionado = produtos.find((p) => p.id === parseInt(formData.produto_id));

  const handleSubmit = () => {
    // Validação para garantir que um produto foi escolhido na lista
    if (!formData.produto_id) {
      toast.info('Selecione um produto!');
      return;
    }

    if (!formData.quantidade || parseInt(formData.quantidade) <= 0) {
      toast.info('Informe uma quantidade válida!');
      return;
    }

    const dados = {
      produto_id: parseInt(formData.produto_id),
      tipo: formData.tipo,
      quantidade: parseInt(formData.quantidade),
      motivo: formData.motivo.trim() || null,
    };

    onSubmit(dados);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col py-3 mx-6 mt-2">

        {/* 2. Novo Campo de Seleção (Listagem de Produtos) */}
        <div className="flex flex-col mb-4">
          <label className="text-sm text-gray-600 mb-1 font-medium">Produto</label>
          <select
            value={formData.produto_id}
            onChange={(e) => setFormData(prev => ({ ...prev, produto_id: e.target.value }))}
            className="border border-gray-300 bg-white rounded-lg text-black text-sm focus:outline-none focus:ring-1 focus:ring-primary w-full shadow-sm px-3 py-2"
          >
            <option value="">Selecione um produto...</option>
            {produtos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} (Qtd: {p.quantidade})
              </option>
            ))}
          </select>
        </div>

        {/* Exibe o estoque atual dinamicamente se houver um produto selecionado */}
        {produtoSelecionado && (
          <p className="text-xs text-gray-500 mb-3 -mt-2">
            Estoque atual: <span className="font-semibold text-primary">{produtoSelecionado.quantidade}</span>
          </p>
        )}

        <div className="flex gap-3 mb-4">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, tipo: 'entrada' }))}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition ${
              formData.tipo === 'entrada'
                ? 'bg-primary text-white border-primary shadow-lg'
                : 'bg-white text-gray-500 border-gray-300 hover:border-primary'
            }`}
          >
            Entrada
          </button>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, tipo: 'saida' }))}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition ${
              formData.tipo === 'saida'
                ? 'bg-red-500 text-white border-red-500 shadow-lg'
                : 'bg-white text-gray-500 border-gray-300 hover:border-red-400'
            }`}
          >
            Saída
          </button>
        </div>

        <TextFieldQuantity
          className="px-1 py-2"
          label="Quantidade"
          value={formData.quantidade}
          onChange={(e) => setFormData(prev => ({ ...prev, quantidade: e.target.value }))}
        />

        <TextField
          className="px-1 py-2"
          label="Motivo (opcional)"
          type="text"
          value={formData.motivo}
          onChange={(e) => setFormData(prev => ({ ...prev, motivo: e.target.value }))}
          placeholder="Ex: Reposição, Venda, Ajuste..."
        />

        <div className="flex gap-4">
          <Button
            className="flex-1 mt-6 py-1 bg-gray-200 text-gray-700 rounded"
            onClick={onCancel}
          >
            Cancelar
          </Button>

          <Button
            className={`flex-1 mt-6 py-1 text-white rounded ${
              formData.tipo === 'saida' ? 'bg-red-500 hover:bg-red-400 border-red-500' : ''
            }`}
            onClick={handleSubmit}
          >
            Confirmar {formData.tipo === 'entrada' ? 'Entrada' : 'Saída'}
          </Button>
        </div>
      </div>
    </div>
  );
}
