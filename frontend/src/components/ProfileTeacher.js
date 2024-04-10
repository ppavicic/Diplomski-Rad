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
            setExercises(response3.data.exercises);
        } catch (error) {
            console.error(error);
        }
    };

    const handleStudent = () => {
        navigate("/addStudent");
    };

    const handleTask = () => {
        navigate("/addTask");
    }

    const handleExercise = () => {
        navigate("/addExercise");
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
        </tr>)

    let j = 0
    const listTasks = tasks.map(task =>
        <tr key={j++}>
            <td>{task.type}</td>
            <td>{task.question}</td>
            <td>{task.fillin}</td>
        </tr>)

    return (
        <div style={{ height: '100vh' }}>
            <nav className="main-navbar">
                <button className="toggle-sidebar-button" onClick={toggleSidebar}>
                    SIDEBAR
                </button>
                <span>{name}</span>
                <button className="logout-button" onClick={handleLogout}>ODJAVA</button>
            </nav>

            <main className="content">
                {showSidebar &&
                    <aside className="sidebar-navbar">
                        <button className="option-button" onClick={handleStudent}>Add Student</button>
                        <button className="option-button" onClick={handleTask}>Add Task</button>
                        <button className="option-button" onClick={handleExercise}>Add Exercise</button>
                    </aside>
                }

                <section className="tasks-section" style={{ marginTop: '10px' }}>
                    <h2>ZADACI</h2>
                    {listTasks}
                    {tasks.length === 0 && <p>Trenutno nema zadataka</p>}
                </section>

                <section className="exercises-section">
                    <h2>VJEŽBE</h2>
                    {/* Display exercises here */}
                    {exercises.length === 0 && <p>Trenutno nema vježbi</p>}
                </section>

                <section className="students-section">
                    <h2>UČENICI</h2>
                    <select value={grade} defaultValue={'default'} name="grade" className="input-container" aria-label="Default select example" onChange={handleGradeChange}>
                        {gradesList}
                    </select>
                    {students.length > 0 && listStudents}
                    {students.length === 0 && <p>No students available.</p>}
                </section>
            </main>
        </div>
    );
}

export default ProfileTeacher;