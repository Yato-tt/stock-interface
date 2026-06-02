import React, { useState } from "react";
import { History } from "lucide-react";
import { toast } from "react-toastify";
import TextField from "./Fields/TextField";
import TextFieldQuantity from "./Fields/TextFieldQuantity";
import Button from "./Button";

function SidebarMovimentacao({ className, produtos, onMovimentar, onHistorico }) {
  const [formData, setFormData] = useState({
    produto_id: '',
    tipo: 'entrada',
    quantidade: '',
    motivo: '',
  });

  const [resetKey, setResetKey] = useState(0);

  const produtoSelecionado = produtos.find((p) => p.id === parseInt(formData.produto_id));

  const handleSubmit = () => {
    if (!formData.produto_id) {
      toast.info('Selecione um produto!');
      return;
    }
    if (!formData.quantidade || parseInt(formData.quantidade) <= 0) {
      toast.info('Informe uma quantidade válida!');
      return;
    }

    onMovimentar({
      produto_id: parseInt(formData.produto_id),
      tipo: formData.tipo,
      quantidade: parseInt(formData.quantidade),
      motivo: formData.motivo.trim() || null,
    });

    setFormData({ produto_id: '', tipo: 'entrada', quantidade: '', motivo: '' });
    setResetKey((k) => k + 1);
  };

  return (
    <div className={`bg-primary w-100 mt-4 mx-4 rounded-t-2xl min-h-screen flex flex-col ${className}`}>
      <div className="flex flex-col mx-5 mt-6 flex-1">

        <h2 className="text-white font-semibold text-base mb-4">Lançamento</h2>

        <div className="mb-3">
          <label className="text-sm text-white/80">Produto</label>
          <select
            key={resetKey}
            value={formData.produto_id}
            onChange={(e) => setFormData((prev) => ({ ...prev, produto_id: e.target.value }))}
            className="border border-primary bg-white rounded-lg text-black text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 w-full shadow-lg px-2 py-1.5 mt-0.5"
          >
            <option value="">Selecione...</option>
            {produtos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} (Qtd: {p.quantidade})
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, tipo: 'entrada' }))}
            className={`flex-1 py-1.5 rounded-lg text-sm font-semibold border transition ${
              formData.tipo === 'entrada'
                ? 'bg-white text-primary border-white shadow'
                : 'bg-transparent text-white border-white/40 hover:border-white'
            }`}
          >
            Entrada
          </button>
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, tipo: 'saida' }))}
            className={`flex-1 py-1.5 rounded-lg text-sm font-semibold border transition ${
              formData.tipo === 'saida'
                ? 'bg-red-500 text-white border-red-500 shadow'
                : 'bg-transparent text-white border-white/40 hover:border-red-300'
            }`}
          >
            Saída
          </button>
        </div>

        {produtoSelecionado && (
          <p className="text-xs text-white/70 mb-2">
            Estoque atual:{' '}
            <span className="font-bold text-white">{produtoSelecionado.quantidade}</span>
          </p>
        )}

        <TextFieldQuantity
          className="px-1 py-1"
          label={<span className="text-white/80">Quantidade</span>}
          value={formData.quantidade}
          onChange={(e) => setFormData((prev) => ({ ...prev, quantidade: e.target.value }))}
        />

        <TextField
          className="px-1 py-1"
          label={<span className="text-white/80">Motivo (opcional)</span>}
          type="text"
          value={formData.motivo}
          onChange={(e) => setFormData((prev) => ({ ...prev, motivo: e.target.value }))}
          placeholder="Ex: Reposição, Venda..."
        />

        <Button
          className="bg-white mt-4 py-1 rounded text-primary font-semibold"
          onClick={handleSubmit}
        >
          Confirmar
        </Button>
      </div>

      <div className="flex justify-center mb-6 mt-4">
        <Button
          onClick={onHistorico}
          className="bg-white p-2 rounded-full"
          title="Histórico de movimentações"
        >
          <History size={18} />
        </Button>
      </div>
    </div>
  );
}

export default SidebarMovimentacao;
