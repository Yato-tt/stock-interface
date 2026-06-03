import React, { useState, useContext, useEffect, useMemo, useCallback, useRef } from "react";
import { Package, ArrowLeftRight } from "lucide-react";
import { toast } from "react-toastify";

import { AuthContext } from "../context/AuthContext";
import produtoService from "../services/produtoService";
import movimentacaoService from "../services/movimentacaoService";
import { useEstoqueSync } from "../hooks/useEstoqueSync";

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
  const [historicoOpen, setHistoricoOpen] = useState(false);
  const [historicoProduto, setHistoricoProduto] = useState(null);
  const [confirmState, setConfirmState] = useState({ open: false, message: '', onConfirm: null });

  // Ref para ignorar eventos SSE gerados pela própria aba
  const ignorarProximoCatalogo = useRef(false);
  const ignorarProximoEstoque  = useRef(null); // produto_id a ignorar

  const abrirConfirm  = (message, onConfirm) => setConfirmState({ open: true, message, onConfirm });
  const fecharConfirm = () => setConfirmState({ open: false, message: '', onConfirm: null });

  const carregarProdutos = useCallback(async () => {
    try {
      const data = await produtoService.listarProdutos();
      setProdutos(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  }, []);

  useEffect(() => {
    if (user) carregarProdutos();
  }, [user, carregarProdutos]);

  useEstoqueSync({
    // Quantidade mudou — atualiza só o produto afetado sem refetch
    onEstoque: ({ produto_id, quantidade }) => {
      // Ignora o eco do próprio lançamento feito nesta aba
      if (ignorarProximoEstoque.current === produto_id) {
        ignorarProximoEstoque.current = null;
        return;
      }
      setProdutos((prev) =>
        prev.map((p) => p.id === produto_id ? { ...p, quantidade } : p)
      );
    },
    // Catálogo mudou — refetch apenas se veio de outro dispositivo
    onCatalogo: () => {
      if (ignorarProximoCatalogo.current) {
        ignorarProximoCatalogo.current = false;
        return;
      }
      carregarProdutos();
    },
  });

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
      case 'az':         lista.sort((a, b) => a.nome.localeCompare(b.nome));  break;
      case 'za':         lista.sort((a, b) => b.nome.localeCompare(a.nome));  break;
      case 'recentes':   lista.sort((a, b) => b.id - a.id);                   break;
      case 'quantidade': lista.sort((a, b) => b.quantidade - a.quantidade);   break;
      case 'preco':      lista.sort((a, b) => a.preco - b.preco);             break;
      default: break;
    }

    return lista;
  }, [produtos, busca, filtro]);

  const handleCriaProduto = async (_, produtoData) => {
    try {
      // Sinaliza para ignorar o próximo evento SSE 'catalogo' — é desta ação
      ignorarProximoCatalogo.current = true;

      const produto = await produtoService.criarProduto({
        ...produtoData,
        empresa_id:    user.empresa_id,
        fornecedor_id: null,
      });

      setProdutos((prev) => [...prev, produto]);
      setModalType(null);
      toast.success('Item cadastrado!');
    } catch (error) {
      // Mostra a mensagem de validação da API se disponível
      const erros = error?.response?.data?.erros;
      const mensagem = error?.response?.data?.message;

      if (erros && erros.length > 0) {
        erros.forEach((e) => toast.error(e));
      } else {
        toast.error(mensagem || 'Erro ao criar produto. Tente novamente.');
      }

      // Se falhou, desfaz o flag de ignorar
      ignorarProximoCatalogo.current = false;
    }
  };

  const handleEditaProduto = async (produtoId, produtoData) => {
    try {
      ignorarProximoCatalogo.current = true;
      await produtoService.atualizarProduto(produtoId, produtoData);
      await carregarProdutos();
      setProdutoSelecionado(null);
      setModalType(null);
      toast.success('Alteração feita!');
    } catch (error) {
      ignorarProximoCatalogo.current = false;
      const erros = error?.response?.data?.erros;
      const mensagem = error?.response?.data?.message;
      if (erros && erros.length > 0) {
        erros.forEach((e) => toast.error(e));
      } else {
        toast.error(mensagem || 'Erro ao editar produto. Tente novamente.');
      }
    }
  };

  const handleDeletaProduto = (id) => {
    abrirConfirm('Tem certeza que deseja excluir este produto?', async () => {
      fecharConfirm();
      try {
        ignorarProximoCatalogo.current = true;
        await produtoService.deletarProduto(id);
        setProdutos((prev) => prev.filter((p) => p.id !== id));
        toast.success('Produto excluído!');
      } catch (error) {
        ignorarProximoCatalogo.current = false;
        toast.error('Erro ao deletar produto. Tente novamente.');
      }
    });
  };

  const handleMovimentar = async (dados) => {
    try {
      ignorarProximoEstoque.current = dados.produto_id;
      await movimentacaoService.registrarMovimentacao(dados);
      await carregarProdutos();
      setProdutoSelecionado(null);
      setModalType(null);
      toast.success(
        dados.tipo === 'entrada' ? 'Entrada registrada!' :
        dados.tipo === 'ajuste'  ? 'Ajuste registrado!'  :
        'Saída registrada!'
      );
    } catch (error) {
      ignorarProximoEstoque.current = null;
      const mensagem = error?.response?.data?.message || 'Erro ao registrar movimentação.';
      toast.error(mensagem);
    }
  };

  return (
    <div className="flex h-screen relative">
      <Sidebar className="hidden md:block" onCreateProduto={handleCriaProduto} />

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

        <HistoricoModal
          open={historicoOpen}
          close={() => {
            setHistoricoOpen(false);
            setHistoricoProduto(null);
          }}
          produto={historicoProduto}
        />

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

        <div className="fixed right-4 bottom-4 flex flex-col items-center gap-3 md:hidden">
          <Button
            onClick={() => {
              setProdutoSelecionado(null);
              setModalType('movimentar-mobile');
            }}
            className="p-2 rounded-full shadow-xl"
          >
            <ArrowLeftRight size={22} className="m-1 text-white" />
          </Button>
          <Button
            onClick={() => setModalType('create')}
            className="p-2 rounded-full shadow-xl"
          >
            <Package size={24} className="m-1 text-white" />
          </Button>
        </div>

        <BaseModal
          open={modalType !== null}
          close={() => {
            setModalType(null);
            setProdutoSelecionado(null);
          }}
          title={
            modalType === 'create' ? 'Cadastrar Produto' :
            modalType === 'edit'   ? 'Editar Produto'    :
            'Lançamento'
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
