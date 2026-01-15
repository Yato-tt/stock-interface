import React from "react";
import { LogOut } from "lucide-react";

import TextFieldImage from "./TextFieldImage";
import TextField from "./TextField";
import Button from "./Button";
import CardProfile from "../components/CardProfile";

function Sidebar({ className }) {

  const handleImage = (file) => {
    console.log(`Peguei ${file}`);
  }

  return(
    <div className={`bg-primary w-80 mt-4 mx-4 rounded-t-2xl min-h-screen ${className}`}>
      <TextFieldImage placeholder='Selecione a Imagem' onChange={handleImage} />
      <div className="flex flex-col mx-6 mt-2">
        <TextField className='px-1 py-0.5' label='Nome' type='text' />
        <TextField className='px-1 py-0.5' label='Descrição' type='text' />
        <div className="flex gap-4">
        <TextField className='px-1 py-0.5' label='Quantidade' type='number' placeholder='0' />
        <TextField className='px-1 py-0.5' label='Preço' type='text' placeholder='R$:' />
        </div>
        <Button className='bg-white mt-6 py-1' >Salvar</Button>
      </div>
      <div className="mx-6">
        <CardProfile />
      </div>
      <div className="flex justify-center mb-6">
        <Button className='bg-white p-2 rounded-full'><LogOut size={18} /></Button>
      </div>
    </div>
  );
}

export default Sidebar;
