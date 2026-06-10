import React, { useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Pencil } from "lucide-react";
import { getImageUrl } from "../../utils/imageHelper";
import avatar from "../../assets/friendly-guy-avatar.png";

function CardUser({ classname }) {
  const { user, updateProfilePicture } = useContext(AuthContext);
  const fileInputRef = useRef(null);

  function openFilePicker() {
    fileInputRef.current.click();
  }

  return (
    <div
      className={`relative h-24 flex items-center rounded-2xl overflow-hidden shadow-lg bg-primary p-3 ${classname}`}
    >
      {/* Avatar */}
      <div className="w-20 h-20 relative rounded-full overflow-hidden shadow-md">
        <img
          src={getImageUrl(user?.foto_perfil) || avatar}
          alt="Avatar"
          className="w-full h-full object-cover"
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => updateProfilePicture(e.target.files[0])}
        />
      </div>

      {/* Botão editar imagem */}
      <button
        onClick={openFilePicker}
        className="absolute bottom-4 left-16 bg-primary p-1 border border-white rounded-full group"
      >
        <Pencil size={16} className="text-white transition-transform duration-200 group-hover:-rotate-12 group-hover:scale-110" />
      </button>

      {/* Info */}
      <div className="ml-6 text-white">
        <p className="text-lg">{user?.nome} {user?.sobrenome}</p>
        <p className="text-sm font-bold">{user?.cargo}</p>
      </div>
    </div>
  );
}

export default CardUser;
