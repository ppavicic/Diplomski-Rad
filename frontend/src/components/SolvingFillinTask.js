import React, { useState, useEffect } from "react";

const SolvingFillinTask = ({ idtask, question, hint, fillin, nextTask, sendLog }) => {
   const [showHint, setShowHint] = useState(false);
   const [userInput, setUserInput] = useState('');
   const [replacedQuestion, setReplacedQuestion] = useState('');
   const [correctFlag, setCorrectFlag] = useState(false);
   const [wrongFlag, setWrongFlag] = useState(false);

   useEffect(() => {
      const replaced = question.replace(
         new RegExp(`\\b${fillin}\\b`, 'gi'),
         '____________'
      );
      setReplacedQuestion(replaced);
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
      <div>
         <h2>Nadopuni rečenicu s ispravnom riječju.</h2>
         <button onClick={handleSkip}>Skip</button>
         <div>
            <div className="my-3">
               <button className="btn btn-warning btn-sm mx-3" onClick={toggleHint} aria-pressed={showHint} autoComplete="off"> HINT </button>
               {showHint && <div>{hint}</div>}
            </div>
            {replacedQuestion}
            <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Ovdje unesite odgovor" />
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

export default SolvingFillinTask;