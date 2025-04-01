import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import styles from "./Register.module.css";
import { FaUser, FaLock, FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../constants/api";

interface ErrorResponse {
  message: string;
}

const Register = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/user`, formData);
      if (response.status === 200) {
        setMessage("Usuário registrado com sucesso");
        navigate("/login");
      } else {
        setMessage("Erro ao registrar");
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;
      setMessage(axiosError.response?.data?.message || "Erro ao registrar");
    }
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
              background: "#12b886",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaUserPlus size={28} color="#ffffff" />
          </div>
        </div>
        <h2>Registro</h2>
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
        <button type="submit" className={styles.button}>
          <FaUserPlus size={16} /> REGISTRAR
        </button>
        {message && <p className={styles.message}>{message}</p>}
      </form>
    </div>
  );
};

export default Register;
