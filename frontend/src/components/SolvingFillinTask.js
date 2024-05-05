import React, { useState, useEffect } from "react";
import "../styles/Exercise.css";

const SolvingFillinTask = ({ idtask, question, hint, fillin, nextTask, sendLog }) => {
   const [showHint, setShowHint] = useState(false);
   const [userInput, setUserInput] = useState('');
   const [replacedQuestion, setReplacedQuestion] = useState('');
   const [correctFlag, setCorrectFlag] = useState(false);
   const [wrongFlag, setWrongFlag] = useState(false);
   let [currentTaskIndex, setCurrentTaskIndex] = useState(0)

   useEffect(() => {
      const replaced = question.replace(
         new RegExp(`\\b${fillin}\\b`, 'gi'),
         '____________'
      );
      setReplacedQuestion(replaced);
      const exercise = JSON.parse(localStorage.getItem("exercise"));
      let solvedCounter = exercise.solvedCounter
      setCurrentTaskIndex(++solvedCounter)
   }, [question, fillin]);

   const toggleHint = () => {
      setShowHint(prevShowHint => !prevShowHint);
   };

   const handleSubmit = () => {
      if (userInput === fillin) {
         setCorrectFlag(true);
         sendLog(idtask, false, fillin, userInput, 'fillin');
         setTimeout(() => {
            setCorrectFlag(false);
            nextTask();
         }, 2000);
      } else {
         setWrongFlag(true);
         sendLog(idtask, true, fillin, userInput, 'fillin');
         setTimeout(() => {
            setWrongFlag(false);
         }, 2000);
      }
   };

   const handleSkip = () => {
      sendLog(idtask, false, fillin, userInput, 'fillin');
      nextTask();
   };

   return (
      <div className='content centerContent'>
         <div className='questionContainer'>
            <h2 className='question'>{currentTaskIndex}. Nadopuni rečenicu s ispravnom riječju.</h2>
            <button className='skipBtn' onClick={handleSkip}></button>
         </div>
         <div className='fillin-container'>
            <div className="hint-container">
               <button className='hintBtn' onClick={toggleHint} aria-pressed={showHint} autoComplete="off"> HINT </button>
               {showHint && <div>{hint}</div>}
            </div>
            {replacedQuestion}
            <div className="fillin-input-container">
               <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Ovdje unesite odgovor" />
            </div>
         </div>
         <div className="button-container">
            <button className="button" onClick={handleSubmit}>ODGOVORI</button>
         </div>
         {
            correctFlag && <div className="correct">   Točan odgovor   </div>
         }
         {
            wrongFlag && <div className="wrong">   Netočan odgovor   </div>
         }
      </div>
   );
};

export default SolvingFillinTask;