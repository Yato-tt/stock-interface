import React, { useState, useContext, useEffect } from "react";
import { Package } from "lucide-react";
import { toast } from "react-toastify";

import { AuthContext } from "../context/AuthContext";
import produtoService from "../services/produtoService";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

import Button from "../components/Button";
import CardUser from "../components/Cards/CardUser";
import ItemCard from "../components/Cards/ItemCard";

import BaseModal from "../components/Modals/BaseModal";

import UserEditForm from "../components/Forms/UserEditForm";
import ProdutoForm from "../components/Forms/ProdutoForm";

import TextFieldImage from "../components/Fields/TextFieldImage";
import TextField from "../components/Fields/TextField";

function Home() {

  const { user } = useContext(AuthContext);

  const [produtos, setProdutos] = useState([
    // { id: 1, nome: "Caixa", preco: 25, quantidade: 12, imagem: deliveryBox },
  ]);

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const produtosData = await produtoService.listarProdutos();
        setProdutos(produtosData);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      }
    }

    if (user) {
      carregarProdutos();
    }
  }, [user]);

  const handleCriaProduto = async (_, produtoData) => {
    try {
      const produto = await produtoService.criarProduto({
        ...produtoData,
        empresa_id: user.empresa_id,
        fornecedor_id: 1
      });

      setProdutos((prev) => [...prev, produto]);
      setModalType(null);
      toast.success('Item cadastrado!');
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      toast.error('Erro ao criar produto. Tente novamente.');
    }
  };

  const handleEditaProduto = async (produtoId, produtoData) => {
    try {
      await produtoService.atualizarProduto(produtoId, produtoData);

      const produtosAtualizados = await produtoService.listarProdutos();
      setProdutos(produtosAtualizados);

      setProdutoSelecionado(null);
      setModalType(null);
      toast.success('Alteração feita!');
    } catch (error) {
      toast.error('Erro ao editar produto:', error);
      toast.error('Erro ao editar produto. Tente novamente.');
    }
  };

  const handleDeletaProduto = async (id) => {
    try {
      const confirma = window.confirm('Tem certeza que deseja excluir este produto?');
      if (!confirma) return;

      await produtoService.deletarProduto(id);

      setProdutos((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      alert('Erro ao deletar produto. Tente novamente.');
    }
  };

  const [modalType, setModalType] = useState(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const [userModalOpen, setUserModalOpen] = useState(false);

  return(
    <div className="flex h-screen">
        <Sidebar className='hidden md:block' onCreateProduto={handleCriaProduto} />
      <div className="w-full h-screen flex flex-col">
        <Header produtos={produtos} onEditProfile={() => setUserModalOpen(true)} user={user} />
          {userModalOpen && (
            <BaseModal
              open={userModalOpen}
              close={() => setUserModalOpen(false)}
              title="Configurações do Usuário"
            >
              <UserEditForm />
            </BaseModal>
          )}
        <div className="flex-1 overflow-y-auto scroll-smoth scrollable-list">
          <ItemCard items={produtos} onEditItem={(item) => {
              setProdutoSelecionado(item);
              setModalType("edit");
            }} onDeletaItem={(id) => handleDeletaProduto(id)}  />
        </div>
        <Button onClick={() => setModalType('create')} className="fixed right-4 bottom-4 p-2 rounded-full md:hidden"><Package size={24} className="m-1 text-white"/></Button>
        <BaseModal
          open={modalType !== null}
          close={() => {
            setModalType(null);
            setProdutoSelecionado(null);
          }}
          title={modalType === 'create' ? 'Cadastrar Produto' : 'Editar Produto'}
        >
          {modalType === 'create' && (
            <ProdutoForm
              onSubmit={handleCriaProduto}
              onCancel={() => setModalType(null)}
            />
          )}

          {modalType === 'edit' && produtoSelecionado && (
            <ProdutoForm
              produto={produtoSelecionado}
              onSubmit={handleEditaProduto}
              onCancel={() => {
                setModalType(null);
                setProdutoSelecionado(null);
              }}
            />
          )}
        </BaseModal>
      </div>
    </div>
  );
}

export default Home;
