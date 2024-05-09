import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css";
import axios from 'axios';
import { URL } from "./Constants";

function ProfileTeacher() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [tasks, setTasks] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [students, setStudents] = useState([]);
    const [showSidebar, setShowSidebar] = useState(false);
    const [grade, setGrade] = useState("default");
    const [grades, setGrades] = useState([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            const { firstname, lastname } = user;
            const name = `${firstname} ${lastname}`;
            setName(name);
        }
        getData();
    }, []);

    const getData = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const data = { idteacher: user.idteacher };
            const response1 = await axios.post(`${URL}/teacherProfile/getGrades`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });
            setGrades(response1.data.grades);

            const response2 = await axios.get(`${URL}/teacherProfile/getTasks`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });
            setTasks(response2.data.tasks);

            const response3 = await axios.get(`${URL}/teacherProfile/getExercises`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });
            console.log(response3.data.exercises)
            setExercises(response3.data.exercises);
        } catch (error) {
            console.error(error);
        }
    };

    const handleStudent = (idstudent) => {
        localStorage.setItem("student", JSON.stringify(idstudent));
        navigate("/editStudent");
    };

    const handleTask = (idtask) => {
        localStorage.setItem("task", JSON.stringify(idtask));
        navigate("/editTask");
    }

    const handleExercise = (idexercise) => {
        localStorage.setItem("exercise", JSON.stringify(idexercise));
        navigate("/editExercise");
    }

    const handleGradeChange = async (event) => {
        event.preventDefault();
        const value = event.target.value;

        if (value !== "default") {
            setGrade(value);
            try {
                const data = { idgrade: value };
                const response = await axios.post(`${URL}/teacherProfile/getStudents`, data, {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                });
                console.log(response.data.students);
                setStudents(response.data.students);
            } catch (error) {
                console.error(error);
            }
        }
    };

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

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const gradesList = grades.map((grade, i) => (
        <option key={i} value={grade.idgrade}>{grade.department}</option>
    ));
    gradesList.push(<option disabled key={-1} value={"default"}>Odaberite razred</option>);

    let i = 0
    const listStudents = students.map(student =>
        <tr key={i++}>
            {/*<td>{student.idstudent}</td>*/}
            <td>{student.firstname}</td>
            <td>{student.lastname}</td>
            <td><button className="button" onClick={() => handleStudent(student.idstudent)}>Uredi</button></td>
        </tr>)

    let j = 0
    const listTasks = tasks.map(task =>
        <tr key={j++}>
            <td>{task.idtask}</td>
            <td>{task.type}</td>
            <td>{task.question}</td>
            <td>{task.hint}</td>
            <td>{task.fillin === "undefined" ? "-" : task.fillin}</td>
            <td>{task.answer1 === "undefined" ? "-" : task.answer1}</td>
            <td>{task.answer2 === "undefined" ? "-" : task.answer2}</td>
            <td>{task.audio === "undefined" ? "-" : task.audio}</td>
            <td>{task.tablejson === "undefined" ? "-" : task.tablejson}</td>
            <td><button className="button" onClick={() => handleTask(task.idtask)}>Uredi</button></td>
        </tr>)

    let k = 0
    const listExercises = exercises.map(exercise =>
        <tr key={k++}>
            <td>{exercise.idexercise}</td>
            <td>{exercise.name}</td>
            <td>{exercise.start ? 'True' : 'False'}</td>
            <td>{exercise.tasks.join(', ')}</td>
            <td><button className="button" onClick={() => handleExercise(exercise.idexercise)}>Uredi</button></td>
        </tr>)

    return (
        <div style={{ height: '100vh' }}>
            <nav className="main-navbar">
                <button className={`toggle-sidebar-button ${showSidebar ? 'move-right' : ''}`} onClick={toggleSidebar}>
                    SIDEBAR
                </button>
                <span>{name}</span>
                <button className="logout-button" onClick={handleLogout}>ODJAVA</button>
            </nav>

            <main className="content">
                {showSidebar &&
                    <aside className="sidebar-navbar">
                        <button className="option-button" onClick={() => navigate("/addStudent")}>Add Student</button>
                        <button className="option-button" onClick={() => navigate("/addTask")}>Add Task</button>
                        <button className="option-button" onClick={() => navigate("/addExercise")}>Add Exercise</button>
                    </aside>
                }

                <section className="tasks-section" style={{ marginTop: '10px' }}>
                    <div>
                        <h2>ZADACI</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tip</th>
                                    <th>Pitanje</th>
                                    <th>Hint</th>
                                    <th>Nadopuna</th>
                                    <th>Odabir1</th>
                                    <th>Odabir2</th>
                                    <th>Audio</th>
                                    <th>Tablica</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {listTasks}
                            </tbody>
                        </table>
                        {tasks.length === 0 && <p>Trenutno nema zadataka</p>}
                    </div>
                </section>

                <section className="exercises-section">
                    <div>
                        <h2>VJEŽBE</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Ime vježbe</th>
                                    <th>Pokreni</th>
                                    <th>Zadaci</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {listExercises}
                            </tbody>
                        </table>
                        {exercises.length === 0 && <p>Trenutno nema vježbi</p>}
                    </div>
                </section>

                <section className="students-section">
                    <div className="grade-select">
                        <h2>UČENICI</h2>
                        <select value={grade} defaultValue={'default'} name="grade" className="input-container" aria-label="Default select example" onChange={handleGradeChange}>
                            {gradesList}
                        </select>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Ime</th>
                                <th>Prezime</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length > 0 && listStudents}
                        </tbody>
                    </table>
                    {students.length === 0 && <p>No students available.</p>}
                </section>
            </main>
        </div>
    );
}

export default ProfileTeacher;