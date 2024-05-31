import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom'
import axios from 'axios';
import "../styles/Exercise.css";
import { URL } from "./Constants";

const SolvingDictationTask = ({ idtask, question, audio, nextTask, sendLog }) => {
   const [isPlaying, setIsPlaying] = useState(false);
   const [progress, setProgress] = useState(0);
   const audioRef = useRef(null);
   const [userInput, setUserInput] = useState("");
   const [correctFlag, setCorrectFlag] = useState(false);
   const [wrongFlag, setWrongFlag] = useState(false);
   let [currentTaskIndex, setCurrentTaskIndex] = useState(0)
   const [responseIspraviMe, setResponseIspraviMe] = useState([]);

   useEffect(() => {
      const exercise = JSON.parse(localStorage.getItem("exercise"));
      let solvedCounter = exercise.solvedCounter
      setCurrentTaskIndex(++solvedCounter)
      setTimeout(() => {
         convertAudio();
      }, 3000);
   }, []);

   const convertAudio = async () => {
      const options = {
         method: 'POST',
         headers: {
            'xi-api-key': 'ddc8e54f6d8a0c8ac9bdbf80ce5783ad',
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
            text: question,
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
         const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/adxhr4Ei7ASJ3Cz7fxwX?output_format=mp3_44100', options)
         const audioBlob = await response.blob();

         const audioURL = window.URL.createObjectURL(audioBlob);
         audioRef.current.src = audioURL;
         console.log(audioURL);
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

   const handleSubmit = async () => {
      //ispravi.me API
      let data = {
         text: userInput,
         context: 'on',
         punctuation: 'off'
      }

      axios.post(URL + '/task/proxy-ispravi', data, { withCredentials: false })
         .then(result => {
            console.log(result.data.response.error)
            const ispraviMeErrors = result.data.response.error
            setResponseIspraviMe(ispraviMeErrors)
         })
         .catch(err => {
            console.log(err)
         })

      if (userInput === question || responseIspraviMe.length == 0) {
         setCorrectFlag(true)
         sendLog(idtask, true, question, userInput, 'dictation');
         setTimeout(() => {
            setCorrectFlag(false);
         }, 2000);
         nextTask();
      }else{
         sendLog(idtask, false, question, userInput, 'dictation');
      }
   };

   const handleSkip = () => {
      sendLog(idtask, false, question, userInput, 'dictation')
      nextTask();
   };

   let i = 0
   const listDictationErrors = responseIspraviMe.map((error, index) => {
      const wrongWordIndex = error.position;
      let endIndex = wrongWordIndex;
      while (endIndex < userInput.length && userInput[endIndex] !== ' ') {
         endIndex++;
      }
      let wrongWord = userInput.substring(wrongWordIndex, endIndex);
      wrongWord = wrongWord.replace(/[.!?,]/g, '');
      return (
         <div key={i++}>
            <span style={{ color: 'red' }}>Kriva riječ: </span>{wrongWord} - <span style={{ color: 'green' }}>Ispravna riječ: </span>  {error.suggestions[0]}
         </div>
      );
   });

   return (
      <div className='content centerContent'>
         <div className='questionContainer'>
            <h2 className='question'>{currentTaskIndex}. Pokrenite digitalni diktat pritiskom na play i upišite tekst u navedeno polje.</h2>
            <button className='skipBtn' onClick={handleSkip}></button>
         </div>
         <div style={{ borderBottom: '1px solid grey', paddingBottom: '2%' }}>
            <div className='audioContent'>
               <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} />
               <button className='audioBtn' onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
               <div className='audioBarContainer' onClick={handleSeek}>
                  <div className='audioBar' style={{ width: `${progress}%`, height: '100%', backgroundColor: 'blue', position: 'absolute', top: 0, left: 0 }} />
               </div>
            </div>
            <textarea
               className='dictationInput'
               value={userInput}
               onChange={(e) => setUserInput(e.target.value)}
               placeholder="Ovdje unesite odgovor"
               rows={20}
            />
         </div>
         <div className="button-container">
            <button className="button" onClick={handleSubmit}>ODGOVORI</button>
         </div>
         {responseIspraviMe && (
            <div className="responseContainer">
               {listDictationErrors}
            </div>
         )}
         {
            correctFlag && <div className='correct'>   Točan odgovor   </div>
         }
         {
            wrongFlag && <div className='wrong'>   Netočan odgovor   </div>
         }
      </div>
   );
};

export default SolvingDictationTask;