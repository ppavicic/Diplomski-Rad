import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../styles/Login.css'
import { URL } from "./Constants";

function EditStudent() {
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [err, setErr] = useState("");
    const [showErr, setShowErr] = useState(false);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const idstudent = JSON.parse(localStorage.getItem("student"));
        const data = { idstudent: idstudent };
        const response = await axios.post(`${URL}/student/getStudent`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
        });
        setStudent(response.data.student[0]);
        setFirstName(response.data.student[0].firstname);
        setLastName(response.data.student[0].lastname);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const idstudent = JSON.parse(localStorage.getItem("student"));
        try {
            const data = {
                idstudent: idstudent,
                firstname: firstName,
                lastname: lastName
            };
            const response = await axios.post(`${URL}/student/update`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });

            if (response.data.success) {
                localStorage.removeItem('student');
                navigate("/profileTeacher");
            } else {
                setErr(response.data.err)
                setShowErr(true)
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleBack = () => {
        localStorage.removeItem('student');
        navigate("/profileTeacher");
    };

    return (
        <div className="w-100 d-flex flex-column justify-content-center h-100">
            <nav className="main-navbar">
                <h2>Uredi učenika</h2>
                <button className="logout-button" onClick={handleBack}>NAZAD</button>
            </nav>
            <div>
                {student && (
                    <>
                        <div className="input-text">
                            <label>IME</label>
                            <div className="input-container">
                                <input type="text" value={firstName} required onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                        </div>
                        <div className="input-text">
                            <label>PREZIME</label>
                            <div className="input-container">
                                <input type="text" value={lastName} required onChange={(e) => setLastName(e.target.value)} />
                            </div>
                        </div>
                    </>
                )}
            </div>
            <div className="button-container">
                <button type="submit" className="addstudentbutton" onClick={handleSubmit}>Uredi</button>
            </div>
            {showErr &&
                <div className="wrong" style={{ margin: '5px 30%' }}>
                    {err}
                </div>}
        </div>
    );
}

export default EditStudent;