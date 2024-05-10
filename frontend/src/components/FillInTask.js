import React, { useState, useEffect } from "react";
import "../styles/FillInTask.css";
import '../styles/AddTask.css'
import axios from 'axios';
import { URL } from "./Constants";

function FillInTask() {
    const [taskInput, setTaskInput] = useState("");
    let [result, setResult] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [fillin, setFillin] = useState("");
    const [hint, setHint] = useState("");
    const [question, setQuestion] = useState("");

    const handleSubmit = async () => {
        try {
            const data = { type: "nadopuna", prompt: taskInput };
            console.log(data)
            const response = await axios.post(`${URL}/askAI`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });
            console.log(response.data.result);
            const textJSON = JSON.parse(response.data.result)
            let text = textJSON.question + " Riječi za unijeti: " + textJSON.fillin + ". HINT: " + textJSON.hint
            setFillin(textJSON.fillin);
            setHint(textJSON.hint);
            setQuestion(textJSON.question);
            setShowResult(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = async () => {
        try {
            const data = {
                type: 'nadopuna',
                fillin: fillin,
                hint: hint,
                question: question
            }
            const response = await axios.post(`${URL}/task/save`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });
            console.log(response.data.result);
            setResult(response.data.result);
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
                Riječ za nadopunit: "{fillin}"
            </div>
            <div>
                HINT: {hint}
            </div>
        </div>
    return (
        <div className="fillin-content">
            <div className="instructions">UPUTE: Unesite upit Umjetnoj Inteligenciji za generiranje rečenice koju će trebat nadopunit s ispravnom riječi.
                Npr. "Izgeneriraj mi smislenu rečenicu koja sadrži riječ kuća". Točna riječ, koju će trebat napisati, mora se nalaziti u rečenici u istom obliku.
            </div>
            {!showResult && (
                <div>
                    <div className="textarea-container">
                        <textarea
                            value={taskInput}
                            onChange={(e) => setTaskInput(e.target.value)}
                            placeholder="Unesi upit..."
                            rows={30}
                            cols={70}
                        />
                    </div>
                    <div>
                        <button className="submit-btn button" onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
            )}
            {showResult && (
                <div className="selection" style={{margin:'0 10%'}}>
                    <div className="result">
                        {result}
                    </div>
                    <div className="button-container">
                        <button className="button" onClick={handleSave}>Spremi</button>
                        <button className="button" style={{marginLeft:'10px'}} onClick={() => setShowResult(false)}>Ponovi</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FillInTask;