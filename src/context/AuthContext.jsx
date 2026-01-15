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

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    try {
      const res = await api.get("/me");

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));

    } catch (err) {
      console.log("Token inválido ou expirado", err);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.error("Sessão expirada! Faça login novamente.");
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

      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

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

      setUser((prev) => ({
        ...prev,
        ...updatedUser,
      }));

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
