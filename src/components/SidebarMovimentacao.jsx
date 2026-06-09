import React, { useState } from "react";
import { History } from "lucide-react";
import { toast } from "react-toastify";
import TextFieldQuantity from "./Fields/TextFieldQuantity";
import SelectField from "./Fields/SelectField";
import Button from "./Button";

const MOTIVOS = [
  { value: '',                label: 'Selecione...'   },
  { value: 'compra',          label: 'Compra'          },
  { value: 'reabastecimento', label: 'Reabastecimento' },
  { value: 'ajuste',          label: 'Ajuste'          },
  { value: 'venda',           label: 'Venda'           },
  { value: 'avaria',          label: 'Avaria'          },
];

const MOTIVO_TIPO = {
  compra:          'entrada',
  reabastecimento: 'entrada',
  venda:           'saida',
  avaria:          'saida',
  ajuste:          'ajuste',
};

const TIPO_LABEL = {
  entrada: '↑ Entrada',
  saida:   '↓ Saída',
  ajuste:  '⇄ Ajuste de estoque',
};

function SidebarMovimentacao({ className, produtos, onMovimentar, onHistorico }) {
  const [formData, setFormData] = useState({
    produto_id: '',
    motivo: '',
    quantidade: '',
  });

  const [resetKey, setResetKey] = useState(0);

  const produtoSelecionado = produtos.find((p) => p.id === parseInt(formData.produto_id));
  const isAjuste = formData.motivo === 'ajuste';
  const tipo = MOTIVO_TIPO[formData.motivo] || null;

  const handleMotivoChange = (motivo) => {
    setFormData((prev) => ({ ...prev, motivo, quantidade: '' }));
  };

  const handleSubmit = () => {
    if (!formData.produto_id) {
      toast.info('Selecione um produto!');
      return;
    }
    if (!formData.motivo) {
      toast.info('Selecione um motivo!');
      return;
    }
    if (formData.quantidade === '' || parseInt(formData.quantidade) < 0) {
      toast.info('Informe uma quantidade válida!');
      return;
    }
    if (!isAjuste && parseInt(formData.quantidade) <= 0) {
      toast.info('A quantidade deve ser maior que zero!');
      return;
    }

    onMovimentar({
      produto_id: parseInt(formData.produto_id),
      tipo,
      quantidade: parseInt(formData.quantidade),
      motivo: formData.motivo,
    });

    setFormData({ produto_id: '', motivo: '', quantidade: '' });
    setResetKey((k) => k + 1);
  };

  return (
    <div className={`bg-primary w-100 mt-4 mx-4 rounded-t-2xl min-h-screen flex flex-col ${className}`}>
      <div className="flex flex-col mx-5 mt-6 flex-1">

        <h2 className="text-white font-semibold text-base mb-4">Lançamento</h2>

        {/* Produto */}
        <div className="mb-3">
          <label className="text-sm text-white/80 mb-0.5 block">Produto</label>
          <SelectField
            key={resetKey}
            options={[{ value: '', label: 'Selecione...' }, ...produtos.map((p) => ({ value: String(p.id), label: `${p.nome} (Qtd: ${p.quantidade})` }))]}
            value={String(formData.produto_id)}
            onChange={(e) => setFormData((prev) => ({ ...prev, produto_id: e.target.value }))}
          />
        </div>

        {/* Motivo */}
        <div className="mb-3">
          <label className="text-sm text-white/80 mb-0.5 block">Motivo</label>
          <SelectField
            key={`motivo-${resetKey}`}
            options={MOTIVOS}
            value={formData.motivo}
            onChange={(e) => handleMotivoChange(e.target.value)}
          />
        </div>

        {/* Tipo inferido — badge sempre branco/tema */}
        {tipo && (
          <div className="mb-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white">
              {TIPO_LABEL[tipo]}
            </span>
          </div>
        )}

        {produtoSelecionado && (
          <p className="text-xs text-white/70 mb-2">
            Estoque atual:{' '}
            <span className="font-bold text-white">{produtoSelecionado.quantidade}</span>
          </p>
        )}

        {/* Quantidade / Novo valor */}
        <TextFieldQuantity
          className="px-1 py-1"
          label={<span className="text-white/80">{isAjuste ? 'Novo valor do estoque' : 'Quantidade'}</span>}
          value={formData.quantidade}
          onChange={(e) => setFormData((prev) => ({ ...prev, quantidade: e.target.value }))}
        />

        {isAjuste && produtoSelecionado && formData.quantidade !== '' && (
          <p className="text-xs text-white/60 mt-1">
            {produtoSelecionado.quantidade} →{' '}
            <span className="text-white font-semibold">{formData.quantidade}</span>
          </p>
        )}

        <Button
          className="bg-white mt-4 py-1 rounded text-primary font-semibold hover:bg-gray-100"
          noHover
          onClick={handleSubmit}
        >
          Confirmar
        </Button>
      </div>

      <div className="flex justify-center mb-6 mt-4">
        <Button
          onClick={onHistorico}
          className="bg-white p-2 rounded-full hover:bg-gray-100"
          title="Histórico de movimentações"
          noHover
        >
          <History size={18} className="text-primary" />
        </Button>
      </div>
    </div>
  );
}

export default SidebarMovimentacao;
