import React, { useContext, useState, useRef } from "react";
import { Package, SlidersHorizontal, X, LogOut, History } from "lucide-react";

import { AuthContext } from "../context/AuthContext";
import { getImageUrl } from "../utils/imageHelper";

function Header({ user, produtos, onEditProfile, busca, onBusca, filtro, onFiltro, onHistorico }) {
  const { logout } = useContext(AuthContext);
  const [filtroMobileOpen, setFiltroMobileOpen] = useState(false);
  const buscaMobileRef = useRef(null);


  const opcoesFiltro = [
    { value: '',          label: 'Relevância'    },
    { value: 'az',        label: 'A → Z'         },
    { value: 'za',        label: 'Z → A'         },
    { value: 'recentes',  label: 'Mais recentes' },
    { value: 'quantidade',label: 'Maior estoque' },
    { value: 'preco',     label: 'Menor preço'   },
  ];

  const fecharPainelMobile = () => {
    buscaMobileRef.current?.blur(); // fecha o teclado no mobile
    setFiltroMobileOpen(false);
  };

  const handleBuscaMobileKeyDown = (e) => {
    if (e.key === 'Enter') {
      fecharPainelMobile();
    }
  };

  return (
    <div className="relative flex border border-primary m-4 p-4 rounded-2xl items-center justify-between gap-2">

      {/* Esquerda */}
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center px-4 py-2 rounded-2xl shadow-lg text-white bg-primary shrink-0">
          <Package size={20} />
          <h2 className="text-sm font-bold">{produtos.length}</h2>
          <h2 className="text-xs">Estoque</h2>
        </div>

        <button
          onClick={onHistorico}
          className="md:hidden flex flex-col items-center px-3 py-2 rounded-2xl shadow-lg text-white bg-primary hover:bg-primary/80 transition shrink-0"
          title="Histórico"
        >
          <History size={20} />
          <span className="text-xs mt-0.5">Histórico</span>
        </button>

        <img
          className="rounded-full shadow-lg w-10 h-10 object-cover md:hidden cursor-pointer"
          src={getImageUrl(user?.foto_perfil) || 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F736x%2F90%2Fa6%2Ff7%2F90a6f79cabd6ac95ec5669737f51bc30.jpg&f=1&nofb=1&ipt=b649f891c8db1f5579cd3fd2e34bff21e38ef42fbb1c3a79bd97407cf5c61120'}
          alt="Foto de Perfil"
          onClick={onEditProfile}
        />
        <button onClick={logout} className="md:hidden">
          <LogOut size={18} />
        </button>
      </div>

      {/* Direita desktop */}
      <div className="hidden md:flex items-end gap-3">
        <div className="flex flex-col">
          <label className="text-sm mb-0.5">Filtro</label>
          <select
            value={filtro}
            onChange={(e) => onFiltro(e.target.value)}
            className="border border-primary bg-white rounded-lg text-black text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 shadow-lg px-3 py-2 w-40"
          >
            {opcoesFiltro.map((op) => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-0.5">Pesquisa</label>
          <input
            type="text"
            placeholder="Nome do produto"
            value={busca}
            onChange={(e) => onBusca(e.target.value)}
            className="border border-primary bg-white rounded-lg text-black text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 shadow-lg px-3 py-2 w-40"
          />
        </div>
      </div>

      {/* Botão filtro mobile */}
      <button
        className="md:hidden p-2 rounded-full bg-primary text-white shadow-lg shrink-0"
        onClick={() => setFiltroMobileOpen((v) => !v)}
        title="Filtros"
      >
        {filtroMobileOpen ? <X size={18} /> : <SlidersHorizontal size={18} />}
      </button>

      {/* Painel filtro mobile */}
      {filtroMobileOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-30 bg-white border border-primary rounded-2xl shadow-xl p-4 flex flex-col gap-3 md:hidden">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-0.5">Filtro</label>
            <select
              value={filtro}
              onChange={(e) => { onFiltro(e.target.value); fecharPainelMobile(); }}
              className="border border-primary bg-white rounded-lg text-black text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 shadow w-full px-3 py-2"
            >
              {opcoesFiltro.map((op) => (
                <option key={op.value} value={op.value}>{op.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-0.5">Pesquisa</label>
            <input
              ref={buscaMobileRef}
              type="search"
              enterKeyHint="search"
              placeholder="Nome do produto"
              value={busca}
              onChange={(e) => onBusca(e.target.value)}
              onKeyDown={handleBuscaMobileKeyDown}
              className="border border-primary bg-white rounded-lg text-black text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 shadow w-full px-3 py-2"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
