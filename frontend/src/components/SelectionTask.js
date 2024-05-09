import React, { useState, useEffect } from "react";
import axios from 'axios';
import '../styles/AddTask.css'
import { URL } from "./Constants";

function SelectionTask() {
    const [taskInput, setTaskInput] = useState("");
    let [result, setResult] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [selection1, setSelection1] = useState("");
    const [selection2, setSelection2] = useState("");
    const [hint, setHint] = useState("");
    const [question, setQuestion] = useState("");

    const handleSubmit = async () => {
        try {
            const data = { type: "odabir", prompt: taskInput };
            console.log(data)
            const response = await axios.post(`${URL}/askAI`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });
            console.log(response.data.result);
            const textJSON = JSON.parse(response.data.result)
            let text = textJSON.pitanje + " Riječi za odabrati: " + textJSON.odgovor1 + ", " + textJSON.odgovor2 + ". HINT: " + textJSON.hint
            setQuestion(textJSON.pitanje);
            setSelection1(textJSON.odgovor1);
            setSelection2(textJSON.odgovor2);
            setHint(textJSON.hint);
            //setResult(text);
            setShowResult(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = async () => {
        try {
            const data = {
                type: 'odabir',
                hint: hint,
                question: question,
                answer1: selection1,
                answer2: selection2
            }
            const response = await axios.post(`${URL}/task/save`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });
            console.log(response.data.result);
            setShowResult(false);
        } catch (error) {
            console.error(error);
        }
    };

    result =
        <div className="selection-result">
            <div>
                Rečenica: {question}
            </div>
            <div>
                Riječi za odabrati: "{selection1}" i "{selection2}"
            </div>
            <div>
                HINT: {hint}
            </div>
        </div>

    return (
        <div className="selection-content">
            <div className="instructions">
                UPUTE: Unesite riječ koju želite da se provjeri u zadatku. Nakon što ju unesete, AI će izgenerirat rečenicu i zadatak s upisanom riječi.
                Unesena riječ se mora u istom obliku naći u rečenici ili inače morate ponovit upit.
            </div>
            {!showResult && (
                <div className="selection">
                    <div className="input-container">
                        <input value={taskInput} onChange={(e) => setTaskInput(e.target.value)} placeholder="Unesi riječ" />
                    </div>
                    <div className="button-container">
                        <button className="submit-btn button" onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
            )}
            {showResult && (
                <div className="selection">
                    <div className="result">
                        {result}
                    </div>
                    <div className="button-container">
                        <button className="button" onClick={handleSave}>Spremi</button>
                        <button className="button" style={{ marginLeft: '10px' }} onClick={() => setShowResult(false)}>Ponovi</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SelectionTask;