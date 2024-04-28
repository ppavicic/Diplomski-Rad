import React, { useState } from 'react';

const SolvingTableTask = ({ idtask, question, hint, tablejson, nextTask, sendLog }) => {
   const [draggedItem, setDraggedItem] = useState(null);
   const [columns, setColumns] = useState({});
   const [showHint, setShowHint] = useState(false);
   const [showIncorrectNumber, setShowIncorrectNumber] = useState(false);
   const [correctFlag, setCorrectFlag] = useState(false);

   const parsedTableJson = JSON.parse(tablejson);
   const [remainingWords, setRemainingWords] = useState(Object.values(parsedTableJson).flat());
   const [incorrectWords, setIncorrectWords] = useState(0);

   const toggleHint = () => {
      setShowHint(prevShowHint => !prevShowHint);
   };

   const handleDragStart = (e, item) => {
      setDraggedItem(item);
   };

   const handleDragOver = e => {
      e.preventDefault();
   };

   const handleDrop = (e, newColumn) => {
      e.preventDefault();

      // If the dragged item is from the remaining words
      if (remainingWords.includes(draggedItem)) {
         // Remove the dragged item from the list of remaining words
         setRemainingWords(prevWords => prevWords.filter(word => word !== draggedItem));

         // Add the dragged item to the new column
         setColumns(prevColumns => ({
            ...prevColumns,
            [newColumn]: [...(prevColumns[newColumn] || []), draggedItem]
         }));
      } else {
         // If the dragged item is from a column
         const updatedColumns = { ...columns };

         // Remove the dragged item from its previous column
         for (const column in updatedColumns) {
            updatedColumns[column] = updatedColumns[column].filter(word => word !== draggedItem);
         }

         // Add the dragged item to the new column
         updatedColumns[newColumn] = [...(updatedColumns[newColumn] || []), draggedItem];

         setColumns(updatedColumns);
      }

      setDraggedItem(null);
   };

   const renderColumnDropZone = (column, items) => {
      return (
         <div
            key={column}
            className="column"
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDrop(e, column)}
         >
            <h3>{column}</h3>
            {items[column] !== undefined && items[column].length !== 0 ? (
               items[column].map((item, index) => (
                  <div
                     key={index}
                     className="drag-item"
                     draggable
                     onDragStart={(e) => handleDragStart(e, item)}
                  >
                     {item}
                  </div>
               ))
            ) : (
               <div className="empty-message"> </div>
            )}
         </div>
      );
   };

   const shuffleArray = array => {
      for (let i = array.length - 1; i > 0; i--) {
         const j = Math.floor(Math.random() * (i + 1));
         [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
   };

   const handleSubmit = () => {
      let incorrectCount = 0;
      Object.entries(columns).forEach(([column, items]) => {
         items.forEach((item, index) => {
            if (!parsedTableJson[column].includes(item)) {
               incorrectCount++;
            }
         });
      });
      setIncorrectWords(incorrectCount);
      setShowIncorrectNumber(true);
      sendLog(idtask, incorrectCount === 0, JSON.stringify(tablejson).replace(/\\/g, '').slice(1, -1), JSON.stringify(columns).replace(/\\/g, '').slice(1, -1), 'table');
      if (incorrectCount === 0) {
         setCorrectFlag(true)
         nextTask();
      }
      setTimeout(() => {
         setShowIncorrectNumber(false);
      }, 4000);
   };

   const handleSkip = () => {
      sendLog(idtask, false, JSON.stringify(tablejson).replace(/\\/g, '').slice(1, -1), JSON.stringify(columns).replace(/\\/g, '').slice(1, -1), 'table');
      nextTask();
   };
   //console.log('Current columns state: ', columns);
   //console.log('Current remainingWords state: ', remainingWords);

   return (
      <div>
         <h2>{question}</h2>
         <button onClick={handleSkip}>Skip</button>
         <div className="my-3">
            <button className="btn btn-warning btn-sm mx-3" onClick={toggleHint} aria-pressed={showHint} autoComplete="off"> HINT </button>
            {showHint && <div>{hint}</div>}
         </div>
         <div className="table-container">
            {Object.entries(parsedTableJson).map(([column, items]) => (
               renderColumnDropZone(column, columns)
            ))}
         </div>
         <div className="word-container">
            <h3>Words</h3>
            {shuffleArray(remainingWords).map((item, idx) => (
               <div
                  key={idx}
                  draggable
                  onDragStart={e => handleDragStart(e, item)}
                  className="drag-item"
               >
                  {item}
               </div>
            ))}
         </div>
         <button onClick={handleSubmit}>Odgovori</button>
         {
            showIncorrectNumber && <div>Total incorrect words: {incorrectWords}</div>
         }

         {
            correctFlag && <div>   Točno sve!   </div>
         }
      </div>
   );
};

export default SolvingTableTask;
