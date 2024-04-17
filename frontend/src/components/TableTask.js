import React, { useState, useEffect } from "react";
import axios from 'axios';
import { URL } from "./Constants";

function TableTask() {
    const [taskInput1, setTaskInput1] = useState("");
    const [taskInput2, setTaskInput2] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState(false);
    const [hint, setHint] = useState("");
    const [table, setTable] = useState(null);

    const handleSubmit = async () => {
        const taskInput = taskInput1 + " i " + taskInput2;
        try {
            const data = { type: "tablica", prompt: taskInput };
            console.log(data)
            const response = await axios.post(`${URL}/askAI`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });
            console.log(response.data.result);
            const textJSON = JSON.parse(response.data.result)
            let text = "Tablica:" + "Prvi stupac: " + textJSON.stupac1 + "Drugi stupac: " + textJSON.stupac2 + " HINT: " + textJSON.hint
            setHint(textJSON.hint);
            const { hint, ...tablica } = textJSON;
            setTable(tablica);
            setResult(text);
            setShowResult(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = async () => {
        try {
            const data = {
                type: 'tablica',
                hint: hint,
                question: "Postavi riječi u točne stupce",
                tableJSON: JSON.stringify(table)
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

    return (
        <div>
            {!showResult && (
                <div>
                    <div className="">
                        <input value={taskInput1} onChange={(e) => setTaskInput1(e.target.value)} placeholder="Unesi prvo slovo" />
                        <input value={taskInput2} onChange={(e) => setTaskInput2(e.target.value)} placeholder="Unesi drugo slovo" />
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
}

export default TableTask;