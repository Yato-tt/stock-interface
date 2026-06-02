import React, { useState, useContext, useEffect, useMemo } from "react";
import { Package, ArrowLeftRight } from "lucide-react";
import { toast } from "react-toastify";

import { AuthContext } from "../context/AuthContext";
import produtoService from "../services/produtoService";
import movimentacaoService from "../services/movimentacaoService";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import SidebarMovimentacao from "../components/SidebarMovimentacao";

import Button from "../components/Button";
import ItemCard from "../components/Cards/ItemCard";

import BaseModal from "../components/Modals/BaseModal";
import HistoricoModal from "../components/Modals/HistoricoModal";
import ConfirmModal from "../components/Modals/ConfirmModal";

import UserEditForm from "../components/Forms/UserEditForm";
import ProdutoForm from "../components/Forms/ProdutoForm";
import MovimentacaoForm from "../components/Forms/MovimentacaoForm";

function Home() {
  const { user } = useContext(AuthContext);

  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('');

  const [modalType, setModalType] = useState(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const [userModalOpen, setUserModalOpen] = useState(false);

  // Histórico — produto null = geral, produto = específico
  const [historicoOpen, setHistoricoOpen] = useState(false);
  const [historicoProduto, setHistoricoProduto] = useState(null);

  // Modal de confirmação
  const [confirmState, setConfirmState] = useState({ open: false, message: '', onConfirm: null });

  const abrirConfirm = (message, onConfirm) =>
    setConfirmState({ open: true, message, onConfirm });
  const fecharConfirm = () =>
    setConfirmState({ open: false, message: '', onConfirm: null });

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const data = await produtoService.listarProdutos();
        setProdutos(data);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      }
    }
    if (user) carregarProdutos();
  }, [user]);

  const produtosFiltrados = useMemo(() => {
    let lista = [...produtos];

    if (busca.trim()) {
      const termo = busca.trim().toLowerCase();
      lista = lista.filter((p) =>
        p.nome.toLowerCase().includes(termo) ||
        (p.descricao && p.descricao.toLowerCase().includes(termo))
      );
    }

    switch (filtro) {
      case 'az':        lista.sort((a, b) => a.nome.localeCompare(b.nome));   break;
      case 'za':        lista.sort((a, b) => b.nome.localeCompare(a.nome));   break;
      case 'recentes':  lista.sort((a, b) => b.id - a.id);                    break;
      case 'quantidade':lista.sort((a, b) => b.quantidade - a.quantidade);    break;
      case 'preco':     lista.sort((a, b) => a.preco - b.preco);              break;
      default: break;
    }

    return lista;
  }, [produtos, busca, filtro]);

  const handleCriaProduto = async (_, produtoData) => {
    try {
      const produto = await produtoService.criarProduto({
        ...produtoData,
        empresa_id: user.empresa_id,
        fornecedor_id: 1,
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
      const atualizados = await produtoService.listarProdutos();
      setProdutos(atualizados);
      setProdutoSelecionado(null);
      setModalType(null);
      toast.success('Alteração feita!');
    } catch (error) {
      console.error('Erro ao editar produto:', error);
      toast.error('Erro ao editar produto. Tente novamente.');
    }
  };

  const handleDeletaProduto = (id) => {
    abrirConfirm('Tem certeza que deseja excluir este produto?', async () => {
      fecharConfirm();
      try {
        await produtoService.deletarProduto(id);
        setProdutos((prev) => prev.filter((p) => p.id !== id));
        toast.success('Produto excluído!');
      } catch (error) {
        console.error('Erro ao deletar produto:', error);
        toast.error('Erro ao deletar produto. Tente novamente.');
      }
    });
  };

  const handleMovimentar = async (dados) => {
    try {
      await movimentacaoService.registrarMovimentacao(dados);
      const atualizados = await produtoService.listarProdutos();
      setProdutos(atualizados);
      setProdutoSelecionado(null);
      setModalType(null);
      toast.success(dados.tipo === 'entrada' ? 'Entrada registrada!' : 'Saída registrada!');
    } catch (error) {
      console.error('Erro ao registrar movimentação:', error);
      const mensagem = error?.response?.data?.message || 'Erro ao registrar movimentação.';
      toast.error(mensagem);
    }
  };

  return (
    <div className="flex h-screen relative">
      {/* Sidebar esquerda — cadastro de produto (desktop) */}
      <Sidebar className="hidden md:block" onCreateProduto={handleCriaProduto} />

      {/* Conteúdo central */}
      <div className="w-full h-screen flex flex-col min-w-0">
        <Header
          produtos={produtos}
          onEditProfile={() => setUserModalOpen(true)}
          user={user}
          busca={busca}
          onBusca={setBusca}
          filtro={filtro}
          onFiltro={setFiltro}
          onHistorico={() => {
            setHistoricoProduto(null);
            setHistoricoOpen(true);
          }}
        />

        {userModalOpen && (
          <BaseModal
            open={userModalOpen}
            close={() => setUserModalOpen(false)}
            title="Configurações do Usuário"
          >
            <UserEditForm />
          </BaseModal>
        )}

        {/* Histórico — geral ou por produto */}
        <HistoricoModal
          open={historicoOpen}
          close={() => {
            setHistoricoOpen(false);
            setHistoricoProduto(null);
          }}
          produto={historicoProduto}
        />

        {/* Modal de confirmação temático */}
        <ConfirmModal
          open={confirmState.open}
          title="Confirmar exclusão"
          message={confirmState.message}
          onConfirm={confirmState.onConfirm}
          onCancel={fecharConfirm}
          confirmLabel="Excluir"
        />

        <div className="flex-1 overflow-y-auto scroll-smooth scrollable-list">
          <ItemCard
            items={produtosFiltrados}
            onEditItem={(item) => {
              setProdutoSelecionado(item);
              setModalType("edit");
            }}
            onDeletaItem={(id) => handleDeletaProduto(id)}
            onHistoricoItem={(item) => {
              setHistoricoProduto(item);
              setHistoricoOpen(true);
            }}
          />
        </div>

        {/* FABs mobile — empilhados verticalmente */}
        <div className="fixed right-4 bottom-4 flex flex-col items-center gap-3 md:hidden">
          <Button
            onClick={() => {
              setProdutoSelecionado(null);
              setModalType('movimentar-mobile');
            }}
            className="p-2 rounded-full shadow-xl"
            title="Lançamento"
          >
            <ArrowLeftRight size={22} className="m-1 text-white" />
          </Button>
          <Button
            onClick={() => setModalType('create')}
            className="p-2 rounded-full shadow-xl"
            title="Cadastrar produto"
          >
            <Package size={24} className="m-1 text-white" />
          </Button>
        </div>

        {/* Modais de formulário */}
        <BaseModal
          open={modalType !== null}
          close={() => {
            setModalType(null);
            setProdutoSelecionado(null);
          }}
          title={
            modalType === 'create'            ? 'Cadastrar Produto' :
            modalType === 'edit'              ? 'Editar Produto'    :
            modalType === 'movimentar-mobile' ? 'Lançamento'        :
            'Movimentar Estoque'
          }
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

          {/* FAB mobile — seleção de produto + E/S */}
          {modalType === 'movimentar-mobile' && (
            <MovimentacaoForm
              produtos={produtos}
              onSubmit={handleMovimentar}
              onCancel={() => {
                setModalType(null);
                setProdutoSelecionado(null);
              }}
            />
          )}
        </BaseModal>
      </div>

      {/* Sidebar direita — lançamentos E/S (desktop) */}
      <SidebarMovimentacao
        className="hidden md:flex"
        produtos={produtos}
        onMovimentar={handleMovimentar}
        onHistorico={() => {
          setHistoricoProduto(null);
          setHistoricoOpen(true);
        }}
      />
    </div>
  );
}

export default Home;
