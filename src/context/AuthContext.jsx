import { createContext, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserFromToken = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/me");
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      const status = err.response?.status;

      // Só limpa o token se o erro for de autenticação (401)
      // Erros de rede (status undefined) ou servidor (500) não devolvem login
      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.error("Sessão expirada! Faça login novamente.");
      } else {
        // Tenta recuperar o usuário salvo localmente para não perder a sessão
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            // JSON corrompido — limpa
            localStorage.removeItem("user");
          }
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]);

  async function login(email, senha) {
    try {
      const res = await api.post("/login", { email, senha });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setUser(res.data.user);

      toast.success("Login realizado com sucesso!");
      navigate("/");
    } catch (err) {
      toast.error("Credenciais inválidas. Verifique e tente novamente.");
      console.log(err);
    }
  }

  async function register(nome, sobrenome, email, senha) {
    try {
      await api.post("/register", { nome, sobrenome, email, senha });

      toast.success("Conta criada com sucesso!");
      navigate("/login");
    } catch (err) {
      toast.error("Erro ao registrar usuário.");
      console.log(err);
    }
  }

  async function updateUser(id, data) {
    try {
      const response = await api.put(`/edit/${id}`, data);
      const updatedUser = response.data.user;

      setUser((prev) => ({ ...prev, ...updatedUser }));
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Perfil atualizado!");
    } catch (err) {
      toast.error("Erro ao atualizar perfil.");
      console.log(err);
    }
  }

  async function updateProfilePicture(file) {
    try {
      const formData = new FormData();
      formData.append("foto", file);

      const res = await api.post(`/upload-profile/${user.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUser = res.data.user;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Foto atualizada!");
    } catch (err) {
      toast.error("Erro ao enviar imagem.");
      console.log(err);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.info("Você saiu da sua conta.");
    navigate("/login");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        updateUser,
        updateProfilePicture,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
