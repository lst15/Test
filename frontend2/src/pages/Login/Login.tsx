import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import styles from "./Login.module.css";
import { FaUser, FaLock, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { API_URL } from "../../constants/api";

interface ErrorResponse {
  message: string;
}

const Login = ({ onLogin }: { onLogin: () => void }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/user/login`, formData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userID", response.data.userID);
      onLogin();
      navigate("/play");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response?.status === 400) {
        setError("Usuário não encontrado. Por favor, registre-se primeiro.");
      } else {
        setError(axiosError.response?.data?.message || "Erro ao fazer login");
      }
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              margin: "0 auto",
              background: "#4263eb",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaSignInAlt size={28} color="#ffffff" />
          </div>
        </div>
        <h2>Bem-vindo</h2>
        <div style={{ position: "relative", marginBottom: "16px" }}>
          <FaUser
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: "16px",
              zIndex: 1,
            }}
          />
          <input
            type="text"
            placeholder="Nome de usuário"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className={styles.input}
            style={{ paddingLeft: "36px" }}
          />
        </div>
        <div style={{ position: "relative", marginBottom: "16px" }}>
          <FaLock
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: "16px",
              zIndex: 1,
            }}
          />
          <input
            type="password"
            placeholder="Senha"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className={styles.input}
            style={{ paddingLeft: "36px" }}
          />
        </div>
        <button
          type="submit"
          className={`${styles.button} ${styles.loginButton}`}
        >
          <FaSignInAlt size={16} /> ENTRAR
        </button>
        <button
          type="button"
          onClick={handleRegisterRedirect}
          className={`${styles.button} ${styles.registerButton}`}
        >
          <FaUserPlus size={16} /> REGISTRAR
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
