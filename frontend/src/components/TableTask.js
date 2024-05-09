import React, { useState, useEffect } from "react";
import axios from 'axios';
import { URL } from "./Constants";

function TableTask() {
    const [taskInput1, setTaskInput1] = useState("");
    const [taskInput2, setTaskInput2] = useState("");
    const [showResult, setShowResult] = useState(false);
    let [result, setResult] = useState(false);
    const [hint, setHint] = useState("");
    const [table, setTable] = useState(null);
    const [column1, setColumn1] = useState("");
    const [column2, setColumn2] = useState("");

    const handleSubmit = async () => {
        const taskInput = taskInput1 + " i " + taskInput2;
        try {
            const data = { type: "tablica", prompt: taskInput };
            console.log(data)
            const response = await axios.post(`${URL}/askAI`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });
            const textJSON = JSON.parse(response.data.result)
            const modifiedJSON = {};
            for (const key in textJSON) {
                if (key === 'stupac1') {
                    modifiedJSON[taskInput1] = textJSON[key];
                } else if (key === 'stupac2') {
                    modifiedJSON[taskInput2] = textJSON[key];
                } else {
                    modifiedJSON[key] = textJSON[key];
                }
            }
            let text = "Tablica:" + "Prvi stupac: " + textJSON.stupac1 + "Drugi stupac: " + textJSON.stupac2 + " HINT: " + textJSON.hint
            setHint(textJSON.hint);
            const { hint, ...tablica } = modifiedJSON;
            setTable(tablica);
            setColumn1(textJSON.stupac1.join(','))
            setColumn2(textJSON.stupac2.join(','))
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

    result =
        <div className="selection-result">
            <h3>Tablica</h3>
            <div>
                Stupac1 ({taskInput1}): {column1}
            </div>
            <div>
                Stupac2 ({taskInput2}): {column2}
            </div>
            <div>
                HINT: {hint}
            </div>
        </div>
    return (
        <div className="selection-content">
            <div className="instructions">
                UPUTE: Unesite dva slova za koja želite da se generiraju riječi. Za ta 2 slova će se stvorit 2 stupca u koje će učenici postavljat ponuđene riječi.
            </div>
            {!showResult && (
                <div className="selection">
                    <div className="">
                        <input style={{ backgroundColor: 'white' }} className='input-container' value={taskInput1} onChange={(e) => setTaskInput1(e.target.value)} placeholder="Unesi prvo slovo" />
                        <input style={{ backgroundColor: 'white' }} className='input-container' value={taskInput2} onChange={(e) => setTaskInput2(e.target.value)} placeholder="Unesi drugo slovo" />
                    </div>
                    <div className="button-container">
                        <button className="submit-btn button" onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
            )}
            {showResult && (
                <div className="selection" style={{ margin: '0 10%' }}>
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

export default TableTask;