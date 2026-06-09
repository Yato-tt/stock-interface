import React, { useContext, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, SlidersHorizontal, X, Delete, LogOut, History } from "lucide-react";

import { AuthContext } from "../context/AuthContext";
import SelectField from "./Fields/SelectField";
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
    buscaMobileRef.current?.blur();
    setFiltroMobileOpen(false);
  };

  const limparBusca = () => {
    onBusca('');
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
          src={getImageUrl(user?.foto_perfil) || 'https://i.pinimg.com/736x/90/a6/f7/90a6f79cabd6ac95ec5669737f51bc30.jpg'}
          alt="Foto de Perfil"
          onClick={onEditProfile}
          onError={(e) => { e.target.src = 'https://i.pinimg.com/736x/90/a6/f7/90a6f79cabd6ac95ec5669737f51bc30.jpg'; }}
        />
        <button onClick={logout} className="md:hidden">
          <LogOut size={18} />
        </button>
      </div>

      {/* Direita desktop */}
      <div className="hidden md:flex items-end gap-3">
        <div className="flex flex-col w-40">
          <SelectField
            label="Filtro"
            options={opcoesFiltro}
            value={filtro}
            onChange={(e) => onFiltro(e.target.value)}
            className="!mb-0"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-0.5">Pesquisa</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Nome do produto"
              value={busca}
              onChange={(e) => onBusca(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') fecharPainelMobile(); }}
              className="border border-primary bg-white rounded-lg text-black text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 shadow-lg px-3 py-2 w-40 pr-8"
            />
            {busca && (
              <button
                onClick={limparBusca}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
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
      <AnimatePresence>
      {filtroMobileOpen && (
        <motion.div
          className="absolute top-[calc(100%+8px)] left-0 right-0 z-30 bg-white border border-primary rounded-2xl shadow-xl p-4 flex flex-col gap-3 md:hidden"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-0.5">Filtro</label>
            <SelectField
              options={opcoesFiltro}
              value={filtro}
              onChange={(e) => { onFiltro(e.target.value); fecharPainelMobile(); }}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-0.5">Pesquisa</label>
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <input
                  ref={buscaMobileRef}
                  type="text"
                  enterKeyHint="search"
                  placeholder="Nome do produto"
                  value={busca}
                  onChange={(e) => onBusca(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { fecharPainelMobile(); } }}
                  className="border border-primary bg-white rounded-lg text-black text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 shadow w-full px-3 py-2 pr-8"
                />
                {/* Ícone interno — limpa só o texto */}
                {busca && (
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => { limparBusca(); buscaMobileRef.current?.focus(); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Delete size={14} />
                  </button>
                )}
              </div>
              {/* Botão externo — limpa e fecha o painel */}
              <button
                onClick={fecharPainelMobile}
                className="p-2 rounded-full bg-primary text-white shadow shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}

export default Header;
