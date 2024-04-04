import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//import "../styles/ProfilePage.css";
import axios from 'axios';
import { URL } from "./Constants";

function ProfileTeacher() {
    const navigate = useNavigate();
    const [name, setName] = useState("");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            const { firstname, lastname } = user;
            const name = `${firstname} ${lastname}`;
            setName(name);
        }
    }, []);

    const handleLogout = async () => {
        try {
            const response = await axios.post(`${URL}/session/logoutTeacher`, {}, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });

            if (response.status !== 201) {
                console.log("Didn't logout");
            } else {
                localStorage.removeItem("user");
                navigate("/loginTeacher");
            }
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

export default ProfileTeacher;