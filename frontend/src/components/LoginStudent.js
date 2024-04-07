import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Login.css'
import titleImg from "../assets/title.png";
import axios from 'axios'
import { URL } from './Constants'

axios.defaults.withCredentials = true;

const LoginStudent = () => {
    const navigate = useNavigate();
    const [school, setSchool] = useState("default");
    const [grade, setGrade] = useState("default");
    const [student, setStudent] = useState("default");
    const [schools, setSchools] = useState([]);
    const [grades, setGrades] = useState([]);
    const [students, setStudents] = useState([]);
    const [showErrMsg, setShowErrMsg] = useState(false);

    useEffect(() => {
        getSchools();
    }, []);

    const getSchools = async () => {
        try {
            const response = await axios.get(`${URL}/session/loginStudent/getSchools`, {
                withCredentials: false
            });

            console.log(response.data.schools);
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
        setStudent("default");

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
            setStudent("default");

            try {
                const data = { idgrade: value };
                const response = await axios.post(`${URL}/session/loginStudent/getStudents`, data, { withCredentials: false });
                setStudents(response.data.students);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        //let exercise = JSON.parse(localStorage.getItem('exercise'));

        try {
            const user = {
                idstudent: student,
                idgrade: grade,
                idschool: school,
            };
            localStorage.setItem('user', JSON.stringify(user));
            navigate("/exercise");
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

    const studentsList = students.map((student, i) => (
        <option key={i} value={student.idstudent}>{student.firstname + " " + student.lastname}</option>
    ));
    studentsList.push(<option disabled key={-1} value={"default"}>Choose an option</option>);

    const login_page = (
        <div className="container">
            <h1 className="title">Prijavi se</h1>
            <form onSubmit={handleSubmit} className="inputs">
                <h2 className="input-title">Škola</h2>
                <select value={school} defaultValue={'default'} name="school" className="input-container" aria-label="Default select example" onChange={handleSchoolChange}>
                    {schoolsList}
                </select>

                <h2 className="input-title">Razred</h2>
                <select value={grade} defaultValue={'default'} name="grade" className="input-container" aria-label="Default select example" onChange={handleGradeChange}>
                    {gradesList}
                </select>

                <h2 className="input-title">Učenik</h2>
                <select value={student} defaultValue={'default'} name="student" className="input-container" aria-label="Default select example"
                    onChange={(event) => {
                        event.preventDefault();
                        setStudent(event.target.value);
                    }} >
                    {studentsList}
                </select>
                <div className="button-container">
                    <button className="button">KRENI</button>
                </div>
                <div className="login-signup-link-container">
                    <a href="/loginTeacher">Nastavnik?</a>
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
};

export default LoginStudent;