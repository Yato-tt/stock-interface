import React from "react";
import { Pencil, Trash2 } from "lucide-react";

import { getImageUrl } from "../../utils/imageHelper";

// const API_BASE_URL = "http://192.168.3.203:3000"; // Mesma URL do api.js

function CardItem({ nome, preco, quantidade, imagem, onEdit, onDelete }) {
  return(
    <div className="bg-white rounded-2xl shadow-md p-2 flex flex-col items-center w-3/3">
      <div className="relative flex justify-center w-full">
        <img
          src={getImageUrl(imagem) || 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F736x%2F90%2Fa6%2Ff7%2F90a6f79cabd6ac95ec5669737f51bc30.jpg&f=1&nofb=1&ipt=b649f891c8db1f5579cd3fd2e34bff21e38ef42fbb1c3a79bd97407cf5c61120'}
          alt={nome}
          className="w-28 h-32 rounded-lg -mt-14 mr-16 object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/150?text=Erro";
          }}
        />

        <div className="absolute right-4 top-2 flex gap-2">
          <button
            onClick={onEdit}
            type="button"
            className="p-1 bg-white rounded-full hover:bg-primary/80 transition shadow-md"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={onDelete}
            type="button"
            className="p-1 bg-white rounded-full hover:bg-red-500 hover:text-white transition shadow-md"
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
