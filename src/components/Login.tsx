import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';

interface LoginProps {
  setToken: (token: string | null) => void;
}

const Login: React.FC<LoginProps> = ({ setToken }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("mypass123");

  const handleLogin = () => {
    const token = password; 
    const usernameValue = username.trim();
    const defaultUsername = "Barbara"; 

    if (usernameValue) {
      localStorage.setItem("username", usernameValue);
    } else {
      localStorage.setItem("username", defaultUsername);
    }

    localStorage.setItem("token", token);
    setToken(token);
    navigate("/");
  };

  return (
    <div className="login-container">
    <h2>Login</h2>
    <div className="input-container">
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
    </div>
    <div className="input-container">
      <label htmlFor="password">Token:</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
    <button className="login-button" onClick={handleLogin}>
      Login
    </button>
  </div>
  );
};

export default Login;