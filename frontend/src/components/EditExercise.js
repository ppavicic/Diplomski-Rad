import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../styles/Login.css'
import { URL } from "./Constants";

function EditExercise() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [exercise, setExercise] = useState(null);
    const [start, setStart] = useState(false);
    const [exerciseName, setExerciseName] = useState("");
    const [showName, setShowName] = useState(false);
    const [taskIds, setTaskIds] = useState([]);
    const [err, setErr] = useState("");
    const [showErr, setShowErr] = useState(false);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const idexercise = JSON.parse(localStorage.getItem("exercise"));
        const data = { idexercise: idexercise };
        const response = await axios.post(`${URL}/exercise/getExercise`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
        });
        setExercise(response.data.exercise[0])
        setShowName(true);
        const parsedTasks = response.data.exercise[0].tasks.map(task => JSON.parse(task));
        setTasks(parsedTasks)
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const idexercise = JSON.parse(localStorage.getItem("exercise"));
        try {
            const data = {
                idexercise: idexercise,
                name: exerciseName,
                start: start,
                tasks: taskIds,
            };
            console.log(data)
            const response = await axios.post(`${URL}/exercise/update`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });

            console.log(response)
            if (response.data.success) {
                localStorage.removeItem('exercise');
                navigate("/profileTeacher");
            } else {
                setErr(response.data.err)
                setShowErr(true)
            }
        } catch (error) {
            console.error(error);
        }
    };
    const handleStartChange = (event) => {
        setStart(event.target.value);
    };

    const handleRemoveTask = (taskId) => {
        setTasks(prevTasks => prevTasks.filter(task => task.idtask !== taskId));
        setTaskIds(prevIds => [...prevIds, taskId]);
    };

    const handleBack = () => {
        localStorage.removeItem('exercise');
        navigate("/profileTeacher");
    };
    
    let i = 0
    const listTasks = tasks.map((task) => {
        return (
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
                    <button className="button-danger" onClick={() => handleRemoveTask(task.idtask)}>Makni</button>
                </td>
            </tr>
        );
    });

    let namePlaceholder = showName ? exercise.name : "";
    return (
        <div>
            <nav className="main-navbar">
                <h2>Uredi vježbu</h2>
                <button className="button-danger" onClick={handleBack}>NAZAD</button>
            </nav>

            <div className="inputs">
                <div className="inputs">
                    <div className="input-text">
                        <label>Naziv vježbe</label>
                        <div className="input-container">
                            <input type="text" placeholder={namePlaceholder} name="username" required onChange={(e) => setExerciseName(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="inputs">
                    <div>
                        <label className="input-title">Odabrat vježbu za rješavanje?</label>
                        <select value={start} name="pokreni" className="input-container" aria-label="Default select example" onChange={handleStartChange}>
                            <option value="true">DA</option>
                            <option value="false">NE</option>
                        </select>
                    </div>
                </div>
                <section className="tasks-section" style={{ marginTop: '10px', border: '1px solid grey' }}>
                    <h3>ZADACI U VJEŽBI</h3>
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

                <div className="button-container">
                    <button type="submit" className="button" onClick={handleSubmit}>Uredi</button>
                </div>
                {showErr &&
                    <div className="wrong" style={{ margin: '5px 30%' }}>
                        {err}
                    </div>}
            </div>
        </div>
    );
}

export default EditExercise;