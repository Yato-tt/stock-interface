import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from '../context/AuthContext';

import deliveryBox from "../assets/delivery_box.jpg"
import TextField from "../components/Fields/TextField";
import Button from "../components/Button";

function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    login(email, senha);
  }

  return(
    <div className="flex flex-col-reverse md:flex-row lg:flex-row md:mt-12 md:justify-around">
      <div className="mx-4 my-2 md:mr-24">
        <form onSubmit={handleSubmit}>

          <h1 className="mogra-regular text-6xl text-center">Welcome</h1>
          <h2 className="text-center p-2 mt-6">Simplifique seu negócio e produtividade<br /> cresça seu negócio com Stock-It.</h2>
          <TextField className='px-3 py-2' label='E-mail' type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Digite seu e-mail' />
          <TextField className='px-3 py-2' label='Senha' type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder='••••••' />
          <Button type='submit' className='w-full mt-9 p-2 text-white rounded'>Login</Button>

        </form>
        <p className="text-center mt-4">Ei! Ainda não tem conta?<br /> Cadastre-se <Link to="/register" className="text-primary underline">aqui</Link></p>
      </div>
      <img className="w-min h-min md:w-1/3 md:h-1/2" src={deliveryBox} alt="Caixa de Entrega" />
    </div>
  )
}

export default Login
