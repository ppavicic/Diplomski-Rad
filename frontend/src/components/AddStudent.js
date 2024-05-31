import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddStudent.css";
import axios from 'axios';
import { URL } from "./Constants";

function AddStudent() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [school, setSchool] = useState("default");
    const [grade, setGrade] = useState("default");
    const [schools, setSchools] = useState([]);
    const [grades, setGrades] = useState([]);

    useEffect(() => {
        getSchools();
    }, []);

    const getSchools = async () => {
        try {
            const response = await axios.get(`${URL}/session/loginStudent/getSchools`, {
                withCredentials: false
            });
            setSchools(response.data.schools);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSchoolChange = async (event) => {
        event.preventDefault();
        const value = event.target.value;
        setSchool(value);
        setGrade("default");

        try {
            const data = { idschool: value };
            const response = await axios.post(`${URL}/session/loginStudent/getGrades`, data, { withCredentials: false });
            setGrades(response.data.grades);
        } catch (error) {
            console.error(error);
        }
    };

    const handleGradeChange = async (event) => {
        event.preventDefault();
        const value = event.target.value;

        if (value !== "default") {
            setGrade(value);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const data = {
                firstname: firstName,
                lastname: lastName,
                idgrade: grade,
            };
            console.log(data)
            const response = await axios.post(`${URL}/student/save`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });

            if (response) {
                navigate("/profileTeacher");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const schoolsList = schools.map((school, i) => (
        <option key={i} value={school.idschool}>{school.name}</option>
    ));
    schoolsList.push(<option disabled key={-1} value={"default"}>Choose an option</option>);

    const gradesList = grades.map((grade, i) => (
        <option key={i} value={grade.idgrade}>{grade.department}</option>
    ));
    gradesList.push(<option disabled key={-1} value={"default"}>Choose an option</option>);

    return (
        <div style={{ height: '100%' }}>
            <nav className="main-navbar">
                <h2>Stvori novog učenika</h2>
                <button className="logout-button" onClick={() => navigate("/profileTeacher")}>NAZAD</button>
            </nav>
            <form onSubmit={handleSubmit} className="inputs">
                <h2 className="input-text">Unesi ime</h2>
                <div className="input-container">
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Unesite ime" />
                </div>

                <h2 className="input-text">Unesi prezime</h2>
                <div className="input-container">
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Unesite prezime" />
                </div>

                <h2 className="input-text">Škola</h2>
                <select value={school} defaultValue={'default'} name="school" className="input-container" aria-label="Default select example" onChange={handleSchoolChange}>
                    {schoolsList}
                </select>

                <h2 className="input-text">Odaberi Razred</h2>
                <select value={grade} defaultValue={'default'} name="grade" className="input-container" aria-label="Default select example" onChange={handleGradeChange}>
                    {gradesList}
                </select>
                <div className="button-container">
                    <button className="addstudentbutton">Spremi</button>
                </div>
            </form>
        </div>
    );
}

export default AddStudent;