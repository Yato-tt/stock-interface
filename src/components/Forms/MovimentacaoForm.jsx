import { useState } from 'react';
import { toast } from 'react-toastify';
import TextFieldQuantity from '../Fields/TextFieldQuantity';
import SelectField from '../Fields/SelectField';
import Button from '../Button';

const MOTIVOS = [
  { value: '',                label: 'Selecione um motivo...' },
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

export default function MovimentacaoForm({ produtos = [], onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    produto_id: '',
    motivo: '',
    quantidade: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const produtoSelecionado = produtos.find((p) => p.id === parseInt(formData.produto_id));
  const isAjuste = formData.motivo === 'ajuste';
  const tipo = MOTIVO_TIPO[formData.motivo] || null;

  const handleMotivoChange = (motivo) => {
    setFormData((prev) => ({ ...prev, motivo, quantidade: '' }));
  };

  const handleSubmit = async () => {
    if (!formData.produto_id) { toast.info('Selecione um produto!');         return; }
    if (!formData.motivo)      { toast.info('Selecione um motivo!');          return; }
    if (formData.quantidade === '' || parseInt(formData.quantidade) < 0) {
      toast.info('Informe uma quantidade válida!'); return;
    }
    if (!isAjuste && parseInt(formData.quantidade) <= 0) {
      toast.info('A quantidade deve ser maior que zero!'); return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        produto_id: parseInt(formData.produto_id),
        tipo,
        quantidade: parseInt(formData.quantidade),
        motivo: formData.motivo,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col py-3 mx-6 mt-2">

        <SelectField
          label="Produto"
          options={[{ value: '', label: 'Selecione um produto...' }, ...produtos.map((p) => ({ value: String(p.id), label: `${p.nome} (Qtd: ${p.quantidade})` }))]}
          value={String(formData.produto_id)}
          onChange={(e) => setFormData((prev) => ({ ...prev, produto_id: e.target.value }))}
          disabled={isSubmitting}
        />

        {produtoSelecionado && (
          <p className="text-xs text-gray-500 mb-3 -mt-2">
            Estoque atual:{' '}
            <span className="font-semibold text-primary">{produtoSelecionado.quantidade}</span>
          </p>
        )}

        <SelectField
          label="Motivo"
          options={MOTIVOS}
          value={formData.motivo}
          onChange={(e) => handleMotivoChange(e.target.value)}
          disabled={isSubmitting}
        />

        {tipo && (
          <div className="mb-4">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
              {TIPO_LABEL[tipo]}
            </span>
          </div>
        )}

        <TextFieldQuantity
          className="px-1 py-2"
          label={isAjuste ? 'Novo valor do estoque' : 'Quantidade'}
          value={formData.quantidade}
          disabled={isSubmitting}
          onChange={(e) => setFormData((prev) => ({ ...prev, quantidade: e.target.value }))}
        />

        {isAjuste && produtoSelecionado && formData.quantidade !== '' && (
          <p className="text-xs text-gray-400 mt-1 -mb-2">
            {produtoSelecionado.quantidade} →{' '}
            <span className="text-primary font-semibold">{formData.quantidade}</span>
          </p>
        )}

        <div className="flex gap-4 mt-6">
          <Button
            className="flex-1 py-1 bg-gray-200 text-gray-700 rounded"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            className="flex-1 py-1 text-white rounded"
            onClick={handleSubmit}
            loading={isSubmitting}
          >
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
}
