import React, { useState, useEffect } from "react";
import "../styles/FillInTask.css";
import axios from 'axios';
import { URL } from "./Constants";

function FillInTask() {
    const [taskInput, setTaskInput] = useState("");
    const [result, setResult] = useState(false);
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
            setResult(text);
            setShowResult(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = async () => {
        try {
            console.log("result" + result)
            const resultParts = result.split(';');
            console.log("part1" + resultParts[0], resultParts[1])
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

    return (
        <div className="">
            <div className="instructions">
                <h2>Upute:</h2>
                <p>Ovo je alat za izradu zadataka uz pomoć AI! Umjetna inteligencija može vam pomoći u generiranju zadatka na temelju vašeg upita.
                 Unesite npr. "Izgeneriraj mi smislenu rečenicu koja sadrži riječ kuća"</p>
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
                <div>
                    <div className="result">
                        {result}
                    </div>
                    <div>
                        <button className="button" onClick={handleSave}>Spremi</button>
                        <button className="button" onClick={() => setShowResult(false)}>Ponovi</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FillInTask;