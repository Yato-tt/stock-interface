import React, { useContext, useState } from "react";
import { Settings } from "lucide-react";
import BaseModal from "../Modals/BaseModal";
import TextField from "../Fields/TextField";
import Button from "../Button";
import CardUser from "./CardUser";
import { AuthContext } from "../../context/AuthContext";
import { getImageUrl } from "../../utils/imageHelper";
import avatar from '../../assets/friendly-guy-avatar.png';

function CardProfile({ className, showName = true }) {
  const { user, updateUser } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    nome: user?.nome || "",
    sobrenome: user?.sobrenome || "",
    cargo: user?.cargo || "",
    email: user?.email || "",
    senha: "",
  });

  function handleChange(field, value) {
    setForm({ ...form, [field]: value });
  }

  async function handleSubmit() {
    const payload = { ...form };
    if (!payload.senha) delete payload.senha;

    await updateUser(user.id, payload);
    setModalOpen(false);
  }

  return (
    <>
      <div
        className={`bg-white p-2 mt-10 mb-8 xl:mt-24 xl:mb-16 rounded-2xl flex items-center shadow-lg ${className}`}
      >
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
          <img
            src={getImageUrl(user?.foto_perfil) || avatar}
            alt="Imagem Perfil"
            className="w-full h-full object-cover"
          />
        </div>

        {showName && (
          <div className="grow">
            <p className="text-sm font-bold text-gray-500">{user?.cargo || 'Usuário'}</p>
            <p className="text-base text-gray-500">
              {user?.nome || 'Convidado'} {user?.sobrenome || ''}
            </p>
          </div>
        )}

        <button onClick={() => setModalOpen(true)}>
          <Settings size={20} className="text-primary" />
        </button>
      </div>

      <BaseModal
        open={modalOpen}
        close={() => setModalOpen(false)}
        title="Configurações do Usuário"
      >
        <div className="flex flex-col gap-4">
          {/* CardUser aqui — permite trocar a foto em qualquer tela */}
          <CardUser />

          <div className="flex gap-4">
            <TextField
              className="p-2"
              label="Nome"
              type="text"
              value={form.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
            />
            <TextField
              className="p-2"
              label="Sobrenome"
              type="text"
              value={form.sobrenome}
              onChange={(e) => handleChange("sobrenome", e.target.value)}
            />
          </div>

          <TextField
            className="p-2"
            label="Cargo"
            type="text"
            value={form.cargo}
            onChange={(e) => handleChange("cargo", e.target.value)}
          />

          <div className="flex gap-4">
            <TextField
              className="p-2"
              label="E-mail"
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <TextField
              className="p-2"
              label="Nova Senha"
              type="password"
              placeholder="Deixe vazio para manter"
              value={form.senha}
              onChange={(e) => handleChange("senha", e.target.value)}
            />
          </div>

          <Button className="mt-4 py-1 text-white rounded" onClick={handleSubmit}>
            Aplicar Mudanças
          </Button>
        </div>
      </BaseModal>
    </>
  );
}

export default CardProfile;
