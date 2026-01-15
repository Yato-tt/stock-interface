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
  const [cargo, setCargo] = useState(user?.cargo || "");
  const [senha, setSenha] = useState("");

  async function handleUpdate() {
    const data = {
      nome,
      sobrenome,
      email,
      cargo,
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

        <TextField
          label="Cargo"
          type="text"
          value={cargo}
          className='p-2'
          onChange={(e) => setCargo(e.target.value)}
        />
      </div>

      <Button className="my-4 py-2 text-white rounded" onClick={handleUpdate}>
        Aplicar Mudanças
      </Button>
    </div>
  );
}
