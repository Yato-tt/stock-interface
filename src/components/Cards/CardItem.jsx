import React from "react";
import { Pencil, Trash2, History } from "lucide-react";
import { getImageUrl } from "../../utils/imageHelper";

import yatoIcon from '../../assets/yato-confuse-icon.png';

function CardItem({ nome, preco, quantidade, imagem, onEdit, onDelete, onHistorico }) {
  return(
    <div className="bg-white rounded-2xl shadow-md p-2 flex flex-col items-center w-3/3">
      <div className="relative flex justify-center w-full">
        <img
          src={getImageUrl(imagem) || yatoIcon }
          alt={nome}
          className="w-28 h-32 rounded-lg -mt-14 mr-16 object-cover"
          onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Erro"; }}
        />

        <div className="absolute right-4 top-2 flex gap-2">
          <button
            onClick={onHistorico}
            type="button"
            className="p-1 bg-white rounded-full hover:bg-primary/80 transition shadow-md"
            title="Histórico do item"
          >
            <History size={18} />
          </button>

          <button
            onClick={onEdit}
            type="button"
            className="p-1 bg-white rounded-full hover:bg-primary/80 transition shadow-md"
            title="Editar"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={onDelete}
            type="button"
            className="p-1 bg-white rounded-full hover:bg-red-500 hover:text-white transition shadow-md"
            title="Excluir"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="mt-2 w-full flex justify-between items-start px-4 pb-2">
        <h2 className="font-semibold text-lg">{nome}</h2>
        <div className="flex flex-col items-center">
          <h2 className="text-gray-600 text-sm mb-1">R$: {preco}</h2>
          <h2 className="text-primary font-bold text-md">Qtd: {quantidade}</h2>
        </div>
      </div>
    </div>
  );
}

export default CardItem;
