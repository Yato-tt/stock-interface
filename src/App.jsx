import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider, AuthContext } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

function Private({ children }) {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) return <p>Carregando. . .</p>;
  if (!user) return <Navigate to="/login" />;

  return children;
}

export default function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/"
              element={
                <Private>
                  <Home />
                </Private>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        pauseOnHover
        theme="colored"
        toastStyle={{
          backgroundColor: "#1f2937", // cinza escuro elegante
          color: "#f3f4f6",           // texto claro
          borderRadius: "10px",
          fontSize: "0.95rem",
        }}
        bodyClassName="font-medium"
      />
    </>
  );
}
