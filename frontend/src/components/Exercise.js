import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { URL } from "./Constants";

function Exercise() {
    const navigate = useNavigate();
    const [name, setName] = useState("");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            const { idstudent, idgrade, idschool } = user;
            const name = `${idstudent} ${idgrade} ${idschool}`;
            setName(name);
        }
    }, []);

    const handleLogout = async () => {
        try {
            localStorage.removeItem("user");
            navigate("/");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <div>
            <h1>PROFILNA STRANICA</h1>
            <div>
                Bok {name}!
            </div>
            <div className="button-container">
                <button className="button" onClick={handleLogout} >ODJAVA</button>
            </div>
        </div>
    );
}

export default Exercise;