import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { URL } from "./Constants";
import SolvingFillinTask from "./SolvingFillinTask";
import SolvingSelectionTask from "./SolvingSelectionTask";
import SolvingDictationTask from "./SolvingDictationTask";
import SolvingTableTask from "./SolvingTableTask";

function Exercise() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [exerciseExist, setExerciseExist] = useState(false);
    const [exerciseName, setExerciseName] = useState("");
    const [tasks, setTasks] = useState([]);
    const [currentTask, setCurrentTask] = useState(null);

    useEffect(() => {
        const studentName = JSON.parse(localStorage.getItem("studentName"));
        const exercise = JSON.parse(localStorage.getItem("exercise"));
        
        if (studentName) {
            setUserName(studentName);
        }

        if (exercise) {
            setExerciseExist(true);
            setExerciseName(exercise.name)
            setTasks(exercise.tasks)
            let solvedCounter = exercise.solvedCounter
            if (solvedCounter >= exercise.tasks.length) {
                localStorage.removeItem('exercise');
                localStorage.removeItem('studentName');
                navigate("/");
            } else {
                setCurrentTask(exercise.tasks[solvedCounter])
            }
        }
    }, []);

    const handleLogout = async () => {
        try {
            localStorage.removeItem("user");
            localStorage.removeItem("studentName")
            navigate("/");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const renderTask = () => {
        if (currentTask.type === 'nadopuna') {
            return (
                <SolvingFillinTask
                    idtask={currentTask.idtask}
                    question={currentTask.question}
                    hint={currentTask.hint}
                    fillin={currentTask.fillin}
                    nextTask={nextTask}
                    sendLog={sendLog}
                />
            );
        } else if (currentTask.type === 'odabir') {
            return (
                <SolvingSelectionTask
                    idtask={currentTask.idtask}
                    question={currentTask.question}
                    hint={currentTask.hint}
                    answer1={currentTask.answer1}
                    answer2={currentTask.answer2}
                    nextTask={nextTask}
                    sendLog={sendLog}
                />
            );
        } else if (currentTask.type === 'diktat') {
            return (
                <SolvingDictationTask
                    idtask={currentTask.idtask}
                    question={currentTask.question}
                    audio={currentTask.audio}
                    nextTask={nextTask}
                    sendLog={sendLog}
                />
            );
        } else if (currentTask.type === 'tablica') {
            return (
                <SolvingTableTask
                    idtask={currentTask.idtask}
                    question={currentTask.question}
                    hint={currentTask.hint}
                    tablejson={currentTask.tablejson}
                    nextTask={nextTask}
                    sendLog={sendLog}
                />
            );
        }
    };

    const nextTask = () => {
        const exercise = JSON.parse(localStorage.getItem("exercise"));
        let solvedCounter = exercise.solvedCounter
        solvedCounter = solvedCounter + 1
        const exercise2 = {
            "idexercise": exercise.idexercise,
            "name": exercise.name,
            "tasks": exercise.tasks,
            "solvedCounter": solvedCounter
        }
        localStorage.setItem('exercise', JSON.stringify(exercise2))

        if (solvedCounter < exercise.tasks.length) {
            setCurrentTask(exercise.tasks[solvedCounter])
        } else {
            localStorage.removeItem('exercise')
            navigate("/");
        }
    };

    const sendLog = (idtask, correctFlag, correctAnswer, studentAnswer, type) => {
        const user = JSON.parse(localStorage.getItem("user"));
        let exercise = JSON.parse(localStorage.getItem('exercise'))
        let log = {
            idexercise: exercise.idexercise,
            idtask: idtask,
            idstudent: user.idstudent,
            correctAnswer: correctAnswer,
            studentAnswer: studentAnswer,
            correct: correctFlag,
            type: type
        }
        console.log(log);
        axios.post(URL + '/exercise/sendLog', log, { withCredentials: false })
            .then(result => {
                console.log(result.data)
            })
            .catch(err => {
                console.log(err)
            })
    }

    //console.log(currentTask);
    return (
        <div style={{ height: '100vh' }}>
            <nav className="main-navbar">
                <span>{userName}</span>
                <span>{exerciseName}</span>
                <button className="logout-button" onClick={handleLogout}>ODJAVA</button>
            </nav>
            {!exerciseExist &&
                <div>
                    Nema vježbe koja je zadana za rješavanje!
                </div>}
            {exerciseExist &&
                <div style={{ height: '85vh' }}>
                    {renderTask()}
                </div>}
        </div>
    );
}


export default Exercise;