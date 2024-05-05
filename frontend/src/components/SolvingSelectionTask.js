import React, { useState, useEffect } from "react";
import "../styles/Exercise.css";
import "../styles/SelectionTask.css";


const SolvingSelectionTask = ({ idtask, question, hint, answer1, answer2, nextTask, sendLog }) => {
   const [showHint, setShowHint] = useState(false);
   const [selectedAnswer, setSelectedAnswer] = useState('');
   const [correctFlag, setCorrectFlag] = useState(false);
   const [wrongFlag, setWrongFlag] = useState(false);
   let [currentTaskIndex, setCurrentTaskIndex] = useState(0)

   useEffect(() => {
      const exercise = JSON.parse(localStorage.getItem("exercise"));
      let solvedCounter = exercise.solvedCounter
      setCurrentTaskIndex(++solvedCounter)
   }, []);

   const parts = question.split(answer1);
   const radioButtons = (
      <span className="select-container">
         <input type="radio" id="option1" name="options" value={answer1} onChange={() => setSelectedAnswer(answer1)} />
         <label htmlFor="option1">{answer1}</label>
         <input type="radio" id="option2" name="options" value={answer2} onChange={() => setSelectedAnswer(answer2)} />
         <label htmlFor="option2">{answer2}</label>
      </span>
   );

   // Join the parts with the radio buttons JSX in between
   const stringWithRadioButtons = parts.reduce((result, part, index) => {
      result.push(part);
      if (index !== parts.length - 1) {
         result.push(radioButtons);
      }
      return result;
   }, []);

   const toggleHint = () => {
      setShowHint(prevShowHint => !prevShowHint);
   };

   const handleSubmit = () => {
      if (selectedAnswer === answer1) {
         setCorrectFlag(true)
         sendLog(idtask, true, answer1, selectedAnswer, 'selection')
         setTimeout(() => {
            setCorrectFlag(false);
            nextTask();
         }, 2000);
      } else {
         setWrongFlag(true)
         sendLog(idtask, false, answer1, selectedAnswer, 'selection')
         setTimeout(() => {
            setWrongFlag(false);
         }, 2000);
      }
   };

   const handleSkip = () => {
      sendLog(idtask, false, answer1, selectedAnswer, 'selection')
      nextTask();
   };

   return (
      <div className='content centerContent'>
         <div className='questionContainer'>
            <h2 className='question'>{currentTaskIndex}. Odaberi ispravnu riječ za dovršit rečenicu.</h2>
            <button className='skipBtn' onClick={handleSkip}></button>
         </div>
         <div className="hb-container">
            <div className="hint-container">
               <button className='hintBtn' onClick={toggleHint} aria-pressed={showHint} autoComplete="off"> HINT </button>
               {showHint && <div>{hint}</div>}
            </div>
            <div>
               {stringWithRadioButtons}
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

export default SolvingSelectionTask;