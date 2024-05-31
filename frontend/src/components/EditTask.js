import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../styles/Login.css'
import '../styles/EditTask.css'
import { URL } from "./Constants";

function EditTask() {
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [dictationText, setDictationText] = useState("");
    const [fillinSentence, setFillinSentence] = useState("");
    const [fillinWord, setFillinWord] = useState("");
    const [selectionSentence, setSelectionSentence] = useState("");
    const [selection1, setSelection1] = useState("");
    const [selection2, setSelection2] = useState("");
    const [tablejson, setTablejson] = useState("");
    const [hint, setHint] = useState("");
    const [err, setErr] = useState("");
    const [showErr, setShowErr] = useState(false);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const idtask = JSON.parse(localStorage.getItem("task"));
        const data = { idtask: idtask };
        const response = await axios.post(`${URL}/task/getTask`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
        });
        setTask(response.data.task);
        setHint(response.data.task.hint);
        setDictationText(response.data.task.question);
        setFillinSentence(response.data.task.question);
        setFillinWord(response.data.task.fillin);
        setSelectionSentence(response.data.task.question);
        setSelection1(response.data.task.answer1);
        setSelection2(response.data.task.answer2);
        setTablejson(response.data.task.tablejson);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const idtask = JSON.parse(localStorage.getItem("task"));
        let question;
        if (task.type == 'diktat') {
            question = dictationText;
        } else if (task.type == 'nadopuna') {
            question = fillinSentence;
        } else if (task.type == 'odabir') {
            question = selectionSentence;
        } else {
            question = task.question;
        }

        try {
            const data = {
                idtask: idtask,
                type: task.type,
                question: question,
                hint: hint,
                fillin: fillinWord,
                answer1: selection1,
                answer2: selection2,
                tablejson: tablejson,
                audio: task.audio
            };
            console.log(data)
            const response = await axios.post(`${URL}/task/update`, data, {
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

    const handleBack = () => {
        localStorage.removeItem('task');
        navigate("/profileTeacher");
    };

    return (
        <div className="w-100 d-flex flex-column justify-content-center edit-task">
            <nav className="main-navbar">
                <h2>Uredi zadatak</h2>
                <button className="logout-button" onClick={handleBack}>NAZAD</button>
            </nav>

            <div className="edit-content">
                {task && (
                    <>
                        {task.type == "diktat" &&
                            <div className="edit-dictation-task">
                                <h2>DIKTAT</h2>
                                <div className="input-text">
                                    <label>Tekst za diktat</label>
                                    <div className="input-container" style={{ width: '40%', height: '20%' }}>
                                        <textarea
                                            value={dictationText}
                                            onChange={(e) => setDictationText(e.target.value)}
                                            className="responsive-dictation-textarea"
                                        />
                                    </div>
                                </div>
                            </div>
                        }

                        {task.type === "nadopuna" &&
                            <div>
                                <h2>ZADATAK S NADOPUNOM</h2>
                                <div className="input-text">
                                    <label>Rečenica</label>
                                    <div className="input-container" style={{ width: '40%', height: '20%' }}>
                                        <textarea
                                            value={fillinSentence}
                                            onChange={(e) => setFillinSentence(e.target.value)}
                                            className="responsive-fillin-textarea"
                                        />
                                    </div>
                                </div>
                                <div className="input-text">
                                    <label>Riječ za nadopunit</label>
                                    <div className="input-container">
                                        <input type="text" value={fillinWord} required onChange={(e) => setFillinWord(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        }

                        {task.type == "odabir" &&
                            <div>
                                <h2>ZADATAK S ODABIROM</h2>
                                <div className="input-text">
                                    <label>Rečenica</label>
                                    <div className="input-container" style={{ width: '40%', height: '20%' }}>
                                        <textarea
                                            value={selectionSentence}
                                            onChange={(e) => setSelectionSentence(e.target.value)}
                                            className="responsive-selection-textarea"
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                </div>
                                <div className="input-text">
                                    <label>ODGOVOR 1</label>
                                    <div className="input-container">
                                        <input type="text" value={selection1} required onChange={(e) => setSelection1(e.target.value)} />
                                    </div>
                                </div>
                                <div className="input-text">
                                    <label>ODGOVOR 2</label>
                                    <div className="input-container">
                                        <input type="text" value={selection2} required onChange={(e) => setSelection2(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        }

                        {task.type == "tablica" &&
                            <div className="edit-table">
                                <h2>ZADATAK S TABLICOM</h2>
                                <div className="input-text myedit-table">
                                    <label>TABLICA</label>
                                    <div className=" table-textarea-div">
                                        <textarea
                                            value={tablejson}
                                            onChange={(e) => setTablejson(e.target.value)}
                                            className="responsive-table-textarea"
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        }
                    </>
                )}

                <div className="input-text my-edittask-hint">
                    <h3>HINT</h3>
                    <div className="input-container" style={{ width: '20%', height: '10%' }}>
                        <textarea
                            value={hint}
                            onChange={(e) => setHint(e.target.value)}
                            className="responsive-hint-textarea"
                        />
                    </div>
                </div>
                <div className="button-container">
                    <button type="submit" style={{marginTop: '10px'}} className="addstudentbutton" onClick={handleSubmit}>Uredi</button>
                </div>
                {showErr &&
                    <div className="wrong" style={{ margin: '5px 30%' }}>
                        {err}
                    </div>}
            </div>
        </div>
    );
}

export default EditTask;