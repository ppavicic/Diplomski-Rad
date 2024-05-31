import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddTask.css";
import axios from 'axios';
import { URL } from "./Constants";
import FillInTask from "./FillInTask";
import DictationTask from "./DictationTask";
import SelectionTask from "./SelectionTask";
import TableTask from "./TableTask";

function AddTask() {
    const navigate = useNavigate();
    const [type, setType] = useState("");

    useEffect(() => {
        setType("default");
    }, []);

    const handleTypeChange = (event) => {
        setType(event.target.value);
    };

    const typesList = [
        <option key="default" value="default" disabled>Odaberite vrstu zadatka</option>,
        <option key="diktat" value="diktat">Diktat</option>,
        <option key="tablica" value="tablica">Tablica</option>,
        <option key="nadopuna" value="nadopuna">Nadopuna</option>,
        <option key="odabir" value="odabir">Odabir</option>,
    ];

    return (
        <div style={{height:"100%"}}>
            <nav className="main-navbar">
                <div>
                    <select value={type} name="type" className="addtask-input-container" aria-label="Default select example" onChange={handleTypeChange}>
                        {typesList}
                    </select>
                </div>
                <h2>Stvori novi zadatak</h2>
                <button className="logout-button" onClick={() => navigate("/profileTeacher")}>NAZAD</button>
            </nav>
            {type === "diktat" && <DictationTask />}
            {type === "nadopuna" && <FillInTask />}
            {type === "odabir" && <SelectionTask />}
            {type === "tablica" && <TableTask />}
        </div>
    );
}

export default AddTask;