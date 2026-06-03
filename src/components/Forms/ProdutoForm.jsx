import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import TextFieldImage from "../Fields/TextFieldImage";
import TextField from "../Fields/TextField";
import TextFieldPrice from "../Fields/TextFieldPrice";
import TextFieldQuantity from "../Fields/TextFieldQuantity";
import Button from "../Button";
import { buildFileUrl } from "../../services/api";

export default function ProdutoForm({ produto = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    quantidade: '',
    foto: null,
  });

  const [imagemAtual, setImagemAtual] = useState(null);

  useEffect(() => {
    if (produto) {
      setFormData({
        nome:       produto.nome      || '',
        descricao:  produto.descricao || '',
        preco:      produto.preco     || '',
        quantidade: produto.quantidade || '',
        foto:       null,
      });

      if (produto.foto) {
        setImagemAtual(buildFileUrl(produto.foto));
      }
    }
  }, [produto]);

  const handleSubmit = () => {
    const nome = formData.nome.trim();
    const descricao = formData.descricao.trim();

    if (!nome) {
      toast.info('O campo nome é obrigatório!');
      return;
    }

    if (nome.length < 3) {
      toast.info('O nome deve ter no mínimo 3 caracteres!');
      return;
    }

    if (nome.length > 100) {
      toast.info('O nome deve ter no máximo 100 caracteres!');
      return;
    }

    if (descricao && descricao.length < 3) {
      toast.info('A descrição deve ter no mínimo 3 caracteres!');
      return;
    }

    if (!formData.preco) {
      toast.info('O campo preço é obrigatório!');
      return;
    }

    if (!formData.quantidade && formData.quantidade !== 0) {
      toast.info('O campo quantidade é obrigatório!');
      return;
    }

    onSubmit(produto ? produto.id : null, {
      nome,
      descricao,
      preco:      parseFloat(formData.preco),
      quantidade: parseInt(formData.quantidade),
      foto:       formData.foto,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {produto && imagemAtual && !formData.foto && (
        <div className="mx-6 mt-4 text-center">
          <p className="text-sm text-gray-500 mb-2">Imagem atual:</p>
          <img
            src={imagemAtual}
            alt="Imagem atual"
            className="w-32 h-32 object-cover rounded-lg mx-auto border-2 border-gray-300"
            onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Erro"; }}
          />
          <p className="text-xs text-gray-400 mt-1">Selecione nova imagem abaixo para substituir</p>
        </div>
      )}

      <TextFieldImage
        placeholder="Selecione a imagem do produto"
        onChange={(file) => setFormData((prev) => ({ ...prev, foto: file }))}
      />

      <div className="flex flex-col py-3 mx-6 mt-2">
        <TextField
          className="px-1 py-2"
          label="Nome"
          type="text"
          value={formData.nome}
          onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
          placeholder="Digite o nome do produto"
        />

        <TextField
          className="px-1 py-2"
          label="Descrição"
          type="text"
          value={formData.descricao}
          onChange={(e) => setFormData((prev) => ({ ...prev, descricao: e.target.value }))}
          placeholder="Descrição opcional"
        />

        <div className="flex py-3 gap-4">
          <TextFieldQuantity
            className="px-1 py-2"
            label="Quantidade"
            value={formData.quantidade}
            onChange={(e) => setFormData((prev) => ({ ...prev, quantidade: e.target.value }))}
          />
          <TextFieldPrice
            className="px-1 py-2"
            label="Preço"
            value={formData.preco}
            onChange={(e) => setFormData((prev) => ({ ...prev, preco: e.target.value }))}
          />
        </div>

        <div className="flex gap-4">
          <Button
            className="flex-1 mt-6 py-1 bg-gray-200 text-gray-700 rounded"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            className="flex-1 mt-6 py-1 text-white rounded"
            onClick={handleSubmit}
          >
            {produto ? 'Salvar Alterações' : 'Salvar'}
          </Button>
        </div>
      </div>
    </div>
  );
}
