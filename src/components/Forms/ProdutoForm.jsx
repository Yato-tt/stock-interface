import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { Pencil } from "lucide-react";

import TextFieldImage from "../Fields/TextFieldImage";
import TextField from "../Fields/TextField";
import TextFieldPrice from "../Fields/TextFieldPrice";
import TextFieldQuantity from "../Fields/TextFieldQuantity";
import Button from "../Button";
import { buildFileUrl } from "../../services/api";

const TIPOS_ACEITOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const TAMANHO_MAX_MB = 5;

export default function ProdutoForm({ produto = null, onSubmit, onCancel }) {
  const modoEdicao = produto !== null;

  const [formData, setFormData] = useState({
    nome:       '',
    descricao:  '',
    preco:      '',
    quantidade: '',
    foto:       null,
  });
  const [imagemAtual, setImagemAtual]   = useState(null);
  const [previewNova, setPreviewNova]   = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputFotoRef = useRef(null);

  useEffect(() => {
    if (produto) {
      setFormData({
        nome:       produto.nome       || '',
        descricao:  produto.descricao  || '',
        preco:      produto.preco      || '',
        quantidade: produto.quantidade || '',
        foto:       null,
      });
      if (produto.foto) setImagemAtual(buildFileUrl(produto.foto));
    }
  }, [produto]);

  const handleFotoEdicao = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!TIPOS_ACEITOS.includes(file.type)) {
      toast.error('Formato não suportado. Use: JPEG, PNG, WebP ou GIF.');
      e.target.value = '';
      return;
    }
    if (file.size / (1024 * 1024) > TAMANHO_MAX_MB) {
      toast.error(`A imagem deve ter no máximo ${TAMANHO_MAX_MB}MB.`);
      e.target.value = '';
      return;
    }

    setPreviewNova(URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, foto: file }));
  };

  const handleSubmit = async () => {
    const nome      = formData.nome.trim();
    const descricao = formData.descricao.trim();

    if (!nome)                             { toast.info('O campo nome é obrigatório!');                  return; }
    if (nome.length < 3)                   { toast.info('O nome deve ter no mínimo 3 caracteres!');      return; }
    if (nome.length > 100)                 { toast.info('O nome deve ter no máximo 100 caracteres!');    return; }
    if (descricao && descricao.length < 3) { toast.info('A descrição deve ter no mínimo 3 caracteres!'); return; }
    if (!formData.preco)                   { toast.info('O campo preço é obrigatório!');                 return; }
    if (!modoEdicao && !formData.quantidade && formData.quantidade !== 0) {
      toast.info('O campo quantidade é obrigatório!'); return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        nome,
        descricao,
        preco: parseFloat(formData.preco),
        foto:  formData.foto,
      };
      if (!modoEdicao) payload.quantidade = parseInt(formData.quantidade);

      await onSubmit(modoEdicao ? produto.id : null, payload);
    } finally {
      setIsSubmitting(false);
    }
  };

  const srcImagem = previewNova || imagemAtual;

  return (
    <div className="flex flex-col gap-2">

      {/* Modo edição — foto com lápis sobreposto, sem TextFieldImage */}
      {modoEdicao ? (
        <div className="flex justify-center mt-4">
          <div className="relative w-32 h-32">
            <img
              src={srcImagem || 'https://via.placeholder.com/150?text=Sem+foto'}
              alt="Foto do produto"
              className="w-32 h-32 object-cover rounded-xl shadow-md"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Erro'; }}
            />
            {/* Lápis — mesmo padrão do CardUser */}
            <button
              type="button"
              onClick={() => inputFotoRef.current?.click()}
              disabled={isSubmitting}
              className="absolute bottom-1 right-1 bg-primary p-1.5 border-2 border-white rounded-full shadow-md disabled:opacity-50 group"
            >
              <Pencil size={14} className="text-white transition-transform duration-200 group-hover:-rotate-12 group-hover:scale-110" />
            </button>
            <input
              ref={inputFotoRef}
              type="file"
              accept={TIPOS_ACEITOS.join(',')}
              className="hidden"
              onChange={handleFotoEdicao}
            />
          </div>
        </div>
      ) : (
        /* Modo cadastro — TextFieldImage normal */
        <TextFieldImage
          placeholder="Selecione a imagem do produto"
          onChange={(file) => setFormData((prev) => ({ ...prev, foto: file }))}
          disabled={isSubmitting}
        />
      )}

      <div className="flex flex-col py-3 mx-6 mt-2">
        <TextField
          className="px-1 py-2"
          label="Nome"
          type="text"
          value={formData.nome}
          disabled={isSubmitting}
          onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
          placeholder="Digite o nome do produto"
        />

        <TextField
          className="px-1 py-2"
          label="Descrição"
          type="text"
          value={formData.descricao}
          disabled={isSubmitting}
          onChange={(e) => setFormData((prev) => ({ ...prev, descricao: e.target.value }))}
          placeholder="Descrição opcional"
        />

        <div className="flex py-3 gap-4">
          <TextFieldQuantity
            className="px-1 py-2"
            label={modoEdicao ? 'Quantidade em estoque' : 'Quantidade inicial'}
            value={formData.quantidade}
            disabled={isSubmitting || modoEdicao}
            onChange={modoEdicao ? undefined : (e) => setFormData((prev) => ({ ...prev, quantidade: e.target.value }))}
          />
          <TextFieldPrice
            className="px-1 py-2"
            label="Preço"
            value={formData.preco}
            disabled={isSubmitting}
            onChange={(e) => setFormData((prev) => ({ ...prev, preco: e.target.value }))}
          />
        </div>

        {modoEdicao && (
          <p className="text-xs text-gray-400 mt-1 mb-2">
            Para alterar o estoque, use o painel de <span className="font-semibold text-primary">Lançamento</span>.
          </p>
        )}

        <div className="flex gap-4">
          <Button
            className="flex-1 mt-4 py-1 bg-gray-200 text-gray-700 rounded"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            className="flex-1 mt-4 py-1 text-white rounded"
            onClick={handleSubmit}
            loading={isSubmitting}
          >
            {modoEdicao ? 'Salvar Alterações' : 'Salvar'}
          </Button>
        </div>
      </div>
    </div>
  );
}
