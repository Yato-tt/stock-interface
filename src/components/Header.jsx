import React, { useContext } from "react";
import { Package, Funnel, Search, LogOut } from "lucide-react";

import { AuthContext } from "../context/AuthContext";

import { getImageUrl } from "../utils/imageHelper";

import TextField from "./Fields/TextField";

function Header({ user, produtos, onEditProfile }) {

  const { logout } = useContext(AuthContext);

  return(
    <div className="flex border border-primary m-4 p-4 rounded-2xl items-center justify-between">
      <div className="flex">
        <div className="flex flex-col items-center px-4 py-2 mr-2 rounded-2xl shadow-lg text-white bg-primary">
          <Package />
          <h2>{produtos.length}</h2>
          <h2>Estoque</h2>
        </div>
        <img className="rounded-full shadow-lg m-4 w-14 md:hidden" src={getImageUrl(user?.foto_perfil) || 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F736x%2F90%2Fa6%2Ff7%2F90a6f79cabd6ac95ec5669737f51bc30.jpg&f=1&nofb=1&ipt=b649f891c8db1f5579cd3fd2e34bff21e38ef42fbb1c3a79bd97407cf5c61120'} alt="Foto de Perfil" onClick={onEditProfile} />
        <button onClick={logout} className="md:hidden">
          <LogOut size={18}/>
        </button>
      </div>
      <div className="flex items-center">
        <div className="hidden md:flex justify-center items-center mb-6 gap-4">
          <TextField className='px-3 py-2' label='Filtro' type='text' placeholder='Relevância' />
          <TextField className='px-3 py-2' label='Pesquisa' type='text' placeholder='Pesquisa' />
        </div>
        <Funnel className="md:hidden mx-2" />
        <Search className="mx-2 md:w-24 md:mx-1" />
      </div>
    </div>
  );
}

export default Header;
