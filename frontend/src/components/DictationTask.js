import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import '../styles/AddTask.css'
import { URL } from "./Constants";

function DictationTask() {
    const [taskInput, setTaskInput] = useState("");
    const [result, setResult] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showSaveBtn, setShowSaveBtn] = useState(false);
    const audioRef = useRef(null);

    const handleSave = async () => {
        console.log(audioRef.current.src);
        try {
            const data = {
                type: 'diktat',
                audio: audioRef.current.src,
                hint: 'none',
                question: result,
            }
            const response = await axios.post(`${URL}/task/save`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });
            console.log(response.data.result);
            setShowSaveBtn(false);
            setShowResult(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async () => {
        try {
            const data = { type: "diktat", prompt: taskInput };
            console.log(data)
            const response = await axios.post(`${URL}/askAI`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });
            const textJSON = JSON.parse(response.data.result)
            const text = textJSON.text
            console.log(text);
            setResult(text);
            setShowResult(true);
        } catch (error) {
            console.error(error);
        }
    };

    const convertTextToAudio = async () => {
        const options = {
            method: 'POST',
            headers: {
                'xi-api-key': 'ddc8e54f6d8a0c8ac9bdbf80ce5783ad',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: result,
                voice_settings: {
                    stability: 1,
                    similarity_boost: 0.75,
                    style: 1,
                    use_speaker_boost: true
                },
                model_id: "eleven_multilingual_v2"
            })
        };

        try {
            const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/adxhr4Ei7ASJ3Cz7fxwX?output_format=mp3_44100', options);
            const audioBlob = await response.blob();

            const audioURL = window.URL.createObjectURL(audioBlob);
            audioRef.current.src = audioURL;
            console.log(audioURL)
            setShowSaveBtn(true);
        } catch (error) {
            console.error(error);
        }
    };

    const togglePlay = () => {
        if (audioRef.current.paused) {
            audioRef.current.play();
            setIsPlaying(true);
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleTimeUpdate = () => {
        const currentTime = audioRef.current.currentTime;
        const duration = audioRef.current.duration;
        const progressPercentage = (currentTime / duration) * 100;
        setProgress(progressPercentage);
    };

    const handleSeek = (e) => {
        const seekTime = (e.nativeEvent.offsetX / e.target.offsetWidth) * audioRef.current.duration;
        audioRef.current.currentTime = seekTime;
    };

    const handleReset = () => {
        setShowResult(false);
        setShowSaveBtn(false);
    };

    return (
        <div className="dictation-content">
            {!showResult && (
                <div>
                    <div className="instructions">UPUTE: Unesite upit Umjetnoj Inteligenciji za generiranje diktata. Npr. "Izgeneriraj mi teskt za diktat".</div>
                    <div className="textarea-container">
                        <textarea
                            value={taskInput}
                            onChange={(e) => setTaskInput(e.target.value)}
                            placeholder="Unesi upit..."
                            className="responsive-textarea"
                        />
                    </div>
                    <div className="button-container">
                        <button className="submit-btn button" onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
            )}

            {showResult && (
                <div className="dictation-result-container">
                    <div className="dictation-audio-result">
                        <div className='dictation-audio'>
                            <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} />
                            <button className='audioBtn' onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
                            <div className='audioBarContainer' onClick={handleSeek}>
                                <div className='audioBar' style={{ width: `${progress}%`, height: '100%', backgroundColor: 'blue', position: 'absolute', top: 0, left: 0 }} />
                            </div>
                        </div>
                        <div className="dictation-text-result">
                            TEKST: {result}
                        </div>
                    </div>
                    <div>
                        {!showSaveBtn && <button className="submit-btn button" onClick={convertTextToAudio}>Generiraj audio</button>}
                        {showSaveBtn && <button className="submit-btn button" onClick={handleSave}>Spremi</button>}
                        <button style={{marginLeft:"10px"}} className="button" onClick={handleReset}>Ponovi</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DictationTask;