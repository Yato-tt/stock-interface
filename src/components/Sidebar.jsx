import React, { useContext, useState } from "react";
import { AuthContext } from '../context/AuthContext';
import { LogOut } from "lucide-react";
import TextFieldImage from "./Fields/TextFieldImage";
import TextField from "./Fields/TextField";
import TextFieldPrice from "./Fields/TextFieldPrice";
import TextFieldQuantity from "./Fields/TextFieldQuantity";
import Button from "./Button";
import CardProfile from "./Cards/CardProfile";

function Sidebar({ className, onCreateProduto }) {
  const { user, logout } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    quantidade: '',
    foto: null
  });

  const [resetImage, setResetImage] = useState(false);

  const handleSubmit = () => {
    if (!formData.nome || !formData.preco || !formData.quantidade) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    const produtoData = {
      nome: formData.nome.trim(),
      descricao: formData.descricao.trim(),
      preco: parseFloat(formData.preco),
      quantidade: parseInt(formData.quantidade),
      foto: formData.foto
    };

    onCreateProduto(null, produtoData);

    setFormData({
      nome: '',
      descricao: '',
      preco: '',
      quantidade: '',
      foto: null
    });

    setResetImage(true);
    setTimeout(() => setResetImage(false), 100);

  };

  return(
    <div className={`bg-primary w-80 mt-4 mx-4 rounded-t-2xl min-h-screen ${className}`}>
      <TextFieldImage
        placeholder='Selecione a Imagem'
        onChange={(file) => setFormData(prev => ({ ...prev, foto: file }))}
        reset={resetImage}
      />

      <div className="flex flex-col mx-6">
        <TextField
          className='px-1 py-0.5'
          label='Nome'
          type='text'
          value={formData.nome}
          onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
          placeholder="Nome do produto"
        />

        <TextField
          className='px-1 py-0.5'
          label='Descrição'
          type='text'
          value={formData.descricao}
          onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
          placeholder="Descrição opcional"
        />

        <div className="flex gap-4">
          <TextFieldQuantity
            className='px-1 py-0.5'
            label='Quantidade'
            value={formData.quantidade}
            onChange={(e) => setFormData(prev => ({ ...prev, quantidade: e.target.value }))}
          />

          <TextFieldPrice
            className='px-1 py-0.5'
            label='Preço'
            value={formData.preco}
            onChange={(e) => setFormData(prev => ({ ...prev, preco: e.target.value }))}
          />
        </div>

        <Button
          className='bg-white mt-6 py-1 rounded'
          onClick={handleSubmit}
        >
          Salvar
        </Button>
      </div>

      <div className="mx-6">
        <CardProfile showName={window.innerWidth >= 1024} />
        {/* <CardProfile /> */}
      </div>

      <div className="flex justify-center mb-6">
        <Button
          onClick={logout}
          className='bg-white p-2 rounded-full'
        >
          <LogOut size={18} />
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;
