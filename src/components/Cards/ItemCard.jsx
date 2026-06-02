import React from "react";
import CardItem from "./CardItem";
import emptyBox from "../../assets/empty.png";

function ItemCard({ items, onEditItem, onDeletaItem, onHistoricoItem }) {
  const isEmpty = !items || items.length === 0;

  return(
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-y-16 gap-x-6 px-6 py-16">
      { isEmpty ? (
        <div className="col-span-full flex flex-col-reverse items-center justify-center text-gray-400 py-10">
          <img src={emptyBox} alt="Nenhum item encontrado" className="w-76 h-64 opacity-80" />
          <p className="text-lg font-medium">Nenhum item encontrado</p>
        </div>
      ) : (items.map((item) => (
        <CardItem
          key={item.id}
          nome={item.nome}
          preco={item.preco}
          quantidade={item.quantidade}
          imagem={item.foto || item.imagem}
          onEdit={() => onEditItem(item)}
          onDelete={() => onDeletaItem(item.id)}
          onHistorico={() => onHistoricoItem(item)}
        />
      )))}
    </div>
  );
}

export default ItemCard;
