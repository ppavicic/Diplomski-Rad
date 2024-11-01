import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "../styles/AddExercise.css";
import { URL } from "./Constants";

function AddExercise() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [showSelected, setShowSelected] = useState(false);
    const [exerciseName, setExerciseName] = useState("");
    const [exerciseStart, setExerciseStart] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [error, setError] = useState(false);

    useEffect(() => {
        getTasks();
    }, []);

    const getTasks = async () => {
        const response = await axios.get(`${URL}/teacherProfile/getTasks`, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
        });
        setTasks(response.data.tasks);
    };

    const handleAddTask = (task) => {
        setSelectedTasks(prevSelectedTasks => [...prevSelectedTasks, task]);
        setTasks(prevTasks => prevTasks.filter(prevTask => prevTask.idtask !== task.idtask));
        setShowSelected(true);
    };

    const handleRemoveTask = (taskId) => {
        const removedTask = selectedTasks.find(task => task.idtask === taskId);
        setSelectedTasks(prevSelectedTasks => prevSelectedTasks.filter(task => task.idtask !== taskId));
        setTasks(prevTasks => [...prevTasks, removedTask]);
        if (selectedTasks.length === 1) {
            setShowSelected(false);
        }
    };

    const handleStartExerciseChange = () => {
        setExerciseStart(prevStart => !prevStart);
    };

    const handleSave = async () => {
        console.log(exerciseName);
        console.log(selectedTasks)
        if (selectedTasks.length === 0) {
            setError(true)
            setErrorMsg("Niste odabrali nijedan zadatak!");
        } else {
            try {
                const data = {
                    name: exerciseName,
                    start: exerciseStart,
                    tasks: selectedTasks,
                }
                const response = await axios.post(`${URL}/exercise/save`, data, {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                });

                if (response.data.success) {
                    navigate("/profileTeacher");
                } else {
                    setError(true);
                    setErrorMsg(response.data.message);
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    let i = 0
    const listTasks = tasks.map(task =>
        <tr key={i++}>
            <td>{task.idtask}</td>
            <td>{task.type}</td>
            <td>{task.question}</td>
            <td>{task.hint}</td>
            <td>{task.answer1 === "undefined" ? "-" : task.answer1}</td>
            <td>{task.answer2 === "undefined" ? "-" : task.answer2}</td>
            <td>{task.fillin === "undefined" ? "-" : task.fillin}</td>
            <td>{task.audio === "undefined" ? "-" : task.audio}</td>
            <td>{task.tablejson === "undefined" ? "-" : task.tablejson}</td>
            <td>
                <button className="addbutton" onClick={() => handleAddTask(task)}>Dodaj</button>
            </td>
        </tr>)

    let j = 0
    const listSelectedTasks = selectedTasks.map(task =>
        <tr key={j++}>
            <td>{task.idtask}</td>
            <td>{task.type}</td>
            <td>{task.question}</td>
            <td>{task.hint}</td>
            <td>{task.answer1 === "undefined" ? "-" : task.answer1}</td>
            <td>{task.answer2 === "undefined" ? "-" : task.answer2}</td>
            <td>{task.fillin === "undefined" ? "-" : task.fillin}</td>
            <td>{task.audio === "undefined" ? "-" : task.audio}</td>
            <td>{task.tablejson === "undefined" ? "-" : task.tablejson}</td>
            <td>
                <button className="addbutton" onClick={() => handleRemoveTask(task.idtask)}>Makni</button>
            </td>
        </tr>)
    return (
        <div style={{ height: "100%" }}>
            <nav className="main-navbar">
                <button className="logout-button" onClick={() => navigate("/profileTeacher")}>NAZAD</button>
                <h2>Stvori novu vježbu</h2>
                <button className="addexercisebutton" onClick={handleSave}>SPREMI</button>
            </nav>
            {error &&
                <div className="wrong">
                    {errorMsg}
                </div>}
            <div className="nc-container">
                <input type="text" className="addexercise-name-input" value={exerciseName} onChange={(e) => setExerciseName(e.target.value)} placeholder="Unesite ime vježbe" />
                <div className="checkbox-container">
                    <label htmlFor="exerciseCheckbox" className="checkbox-label">Postavi vježbu učenicima za vježbanje:</label>
                    <input type="checkbox" id="exerciseCheckbox" checked={exerciseStart} onChange={() => setExerciseStart(prev => !prev)} />
                </div>
            </div>
            {showSelected &&
                <section className="tasks-section" style={{ marginTop: '10px' }}>
                    <div>
                        <h2>Odabrani zadaci</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Vrsta</th>
                                    <th>Pitanje</th>
                                    <th>Hint</th>
                                    <th>Odabir 1</th>
                                    <th>Odabir 2</th>
                                    <th>Nadopuna</th>
                                    <th>Audio</th>
                                    <th>Tablica</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {listSelectedTasks}
                            </tbody>
                        </table>
                    </div>
                </section>
            }
            <section className="tasks-section" style={{ marginTop: '10px' }}>
                <h2>Svi zadaci</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Vrsta</th>
                            <th>Pitanje</th>
                            <th>Hint</th>
                            <th>Odabir 1</th>
                            <th>Odabir 2</th>
                            <th>Nadopuna</th>
                            <th>Audio</th>
                            <th>Tablica</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {listTasks}
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default AddExercise;
