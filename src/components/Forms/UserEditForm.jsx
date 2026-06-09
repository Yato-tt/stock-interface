import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

import TextField from "../Fields/TextField";
import Button from "../Button";
import CardUser from "../Cards/CardUser";

export default function UserEditForm() {
  const { user, updateUser } = useContext(AuthContext);

  const [nome, setNome] = useState(user?.nome || "");
  const [sobrenome, setSobrenome] = useState(user?.sobrenome || "");
  const [email, setEmail] = useState(user?.email || "");
  const [senha, setSenha] = useState("");

  async function handleUpdate() {
    const data = {
      nome,
      sobrenome,
      email,
      ...(senha && { senha })
    };

    await updateUser(user.id, data);
  }

  return (
    <div className="flex flex-col gap-6">

      <CardUser />

      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">

        <TextField
          label="Nome"
          type="text"
          value={nome}
          className='p-2'
          onChange={(e) => setNome(e.target.value)}
        />

        <TextField
          label="Sobrenome"
          type="text"
          value={sobrenome}
          className='p-2'
          onChange={(e) => setSobrenome(e.target.value)}
        />

        <TextField
          label="E-mail"
          type="email"
          value={email}
          className='p-2'
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Senha"
          type="password"
          placeholder="••••••"
          value={senha}
          className='p-2'
          onChange={(e) => setSenha(e.target.value)}
        />

        <div className="px-2 py-1">
          <p className="text-xs text-gray-400 mb-0.5">Cargo</p>
          <p className="text-sm font-medium text-gray-700">{user?.cargo || '—'}</p>
        </div>
      </div>

      <Button className="my-4 py-2 text-white rounded" onClick={handleUpdate}>
        Aplicar Mudanças
      </Button>
    </div>
  );
}
