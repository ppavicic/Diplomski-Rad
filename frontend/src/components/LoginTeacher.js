import React, { useState } from "react";
import "../styles/Login.css";
import titleImg from "../assets/title.png";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { URL } from "./Constants";

function LoginTeacher() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showErrMsg, setShowErrMsg] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const session = { username, password };

    try {
      const response = await axios.post(`${URL}/session/loginTeacher`, { session }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });

      if (response.status !== 201) {
        setShowErrMsg(true);
      } else {
        const data = response.data;
        localStorage.setItem("user", JSON.stringify(data.user));
        setShowErrMsg(false);
        navigate("/profileTeacher");
      }
    } catch (error) {
      console.error(error);
      setShowErrMsg(true);
    }
  };


  const login_page = (
    <div className="container">
      <h1 className="title">Prijavi se</h1>
      <form onSubmit={handleSubmit}>
        <div className="inputs">
          <div className="input-text">Korisničko ime</div>
          <div className="input-container">
            <input type="text" placeholder="Unesite korisničko ime" name="username" required onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="input-text">Lozinka</div>
          <div className="input-container">
            <input type="password" placeholder="Unesite lozinku" name="password" required onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>
        <div className="button-container">
          <button className="button">Prijava</button>
        </div>
        <div className="login-signup-link-container">
          <a href="/">Učenik?</a>
        </div>
      </form>
      {showErrMsg && (
        <div className="error-msg-div">
          <div className="error-msg">Neispravni podaci za prijavu</div>
        </div>
      )}
    </div>
  );

  return (
    <div className="app">
      <div className="title-container">
        <img src={titleImg} alt="Title" className="title-image"></img>
      </div>
      <div className="login-form">{login_page}</div>
    </div>
  );
}

export default LoginTeacher;