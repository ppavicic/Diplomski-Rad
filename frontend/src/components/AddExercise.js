import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { URL } from "./Constants";

function AddExercise() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [showSelected, setShowSelected] = useState(false);

    useEffect(() => {
        getTasks();
    }, []);

    const getTasks = async () => {
        const response = await axios.get(`${URL}/teacherProfile/getTasks`, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
        });
        console.log(tasks);
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
        console.log(selectedTasks.length )
        if (selectedTasks.length === 1) {
            setShowSelected(false);
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
                <button onClick={() => handleAddTask(task)}>Dodaj</button>
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
                <button onClick={() => handleRemoveTask(task.idtask)}>Makni</button>
            </td>
        </tr>)
    return (
        <div style={{ height: "100%" }}>
            <nav className="main-navbar">
                <h2>Stvori novu vježbu</h2>
                <button className="button" onClick={() => navigate("/profileTeacher")}>NAZAD</button>
            </nav>
            {showSelected &&
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
                </div>}
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
        </div>
    );
}

export default AddExercise;
