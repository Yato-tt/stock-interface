import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from '../context/AuthContext';

import deliveryBox from "../assets/delivery_box.jpg";
import TextField from "../components/Fields/TextField";
import Button from "../components/Button";

function Register() {
  const { register } = useContext(AuthContext);

  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function handleRegister(e) {
    e.preventDefault();
    register(nome, sobrenome, email, senha);
  }

  return (
    <div className="flex flex-col md:flex-row lg:flex-row md:mt-12 md:justify-around">

      <img className="w-min h-min md:w-1/3 md:h-1/2 mx-6 md:mt-12" src={deliveryBox} alt="Caixa de Entrega" />

      <div className="mx-4 my-2 md:ml-24">
        <form onSubmit={handleRegister}>

          <h1 className="mogra-regular text-6xl text-center">First Time?</h1>
          <h2 className="text-center p-2 my-6">
            Nós cuidamos do seu negócio por você<br />
            sua vida mais simples com <strong>Stock-It.</strong>
          </h2>
          <div className="flex sm:justify-between gap-3">
            <TextField
              className="px-3 p-2"
              label="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome"
            />

            <TextField
              className="px-3 p-2"
              label="Sobrenome"
              value={sobrenome}
              onChange={(e) => setSobrenome(e.target.value)}
              placeholder="Digite seu sobrenome"
            />
          </div>

          <TextField
            className="px-3 py-2"
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu e-mail"
          />

          <TextField
            className="px-3 py-2"
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="••••••"
          />

          <Button type='submit' className="w-full mt-8 p-2 text-white rounded">
            Cadastrar-se
          </Button>
        </form>
        <p className="text-center mt-4">Já tem uma conta?<br /> Faça login <Link to="/login" className="text-primary underline">aqui</Link></p>
      </div>
    </div>
  );
}

export default Register;
