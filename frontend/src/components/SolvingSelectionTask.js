import React, { useState, useEffect } from "react";
import { Navigate } from 'react-router-dom'

const SolvingSelectionTask = ({ idtask, question, hint, answer1, answer2, nextTask, sendLog }) => {
   const [showHint, setShowHint] = useState(false);
   const [selectedAnswer, setSelectedAnswer] = useState('');
   const [correctFlag, setCorrectFlag] = useState(false);
   const [wrongFlag, setWrongFlag] = useState(false);

   const parts = question.split(answer1);
   const radioButtons = (
      <div>
         <input type="radio" id="option1" name="options" value={answer1} onChange={() => setSelectedAnswer(answer1)} />
         <label htmlFor="option1">{answer1}</label>
         <input type="radio" id="option2" name="options" value={answer2} onChange={() => setSelectedAnswer(answer2)} />
         <label htmlFor="option2">{answer2}</label>
      </div>
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
      <div>
         <h2>Odaberi ispravnu riječ za dovršit rečenicu.</h2>
         <button onClick={handleSkip}>Skip</button>
         <div>
            <div className="my-3">
               <button className="btn btn-warning btn-sm mx-3" onClick={toggleHint} aria-pressed={showHint} autoComplete="off"> HINT </button>
               {showHint && <div>{hint}</div>}
            </div>
            {stringWithRadioButtons}
         </div>
         <button onClick={handleSubmit}>Odgovori</button>
         {
            correctFlag && <div>   Tocan odgovor   </div>
         }
         {
            wrongFlag && <div>   Netocan odgovor   </div>
         }
      </div>
   );
};

export default SolvingSelectionTask;