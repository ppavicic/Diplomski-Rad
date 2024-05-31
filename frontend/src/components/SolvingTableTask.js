import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5toTouch } from 'react-dnd-multi-backend';
import MultiBackend from 'react-dnd-multi-backend';
import "../styles/Exercise.css";
import "../styles/TableTask.css";

const ItemTypes = {
  WORD: 'word',
};

const Word = ({ item, index }) => {
  const [, drag] = useDrag({
    type: ItemTypes.WORD,
    item: { item, index },
  });

  return (
    <div ref={drag} className="drag-item">
      {item}
    </div>
  );
};

const Column = ({ column, items, onDrop }) => {
  const [, drop] = useDrop({
    accept: ItemTypes.WORD,
    drop: (draggedItem) => {
      onDrop(draggedItem.item, column);
    },
  });

  return (
    <div ref={drop} className="column">
      <h3 className='th'>{column}</h3>
      {items.map((item, index) => (
        <Word key={index} item={item} index={index} />
      ))}
      {items.length === 0 && <div className="empty-message"> </div>}
    </div>
  );
};

const SolvingTableTask = ({ idtask, question, hint, tablejson, nextTask, sendLog }) => {
  const [columns, setColumns] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [showIncorrectNumber, setShowIncorrectNumber] = useState(false);
  const [correctFlag, setCorrectFlag] = useState(false);
  let [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  const parsedTableJson = JSON.parse(tablejson);
  const [remainingWords, setRemainingWords] = useState(Object.values(parsedTableJson).flat());
  const [incorrectWords, setIncorrectWords] = useState(0);

  useEffect(() => {
    const exercise = JSON.parse(localStorage.getItem("exercise"));
    let solvedCounter = exercise.solvedCounter;
    setCurrentTaskIndex(++solvedCounter);
  }, []);

  const toggleHint = () => {
    setShowHint(prevShowHint => !prevShowHint);
  };

  const handleDrop = (item, newColumn) => {
    // If the dragged item is from the remaining words
    if (remainingWords.includes(item)) {
      // Remove the dragged item from the list of remaining words
      setRemainingWords(prevWords => prevWords.filter(word => word !== item));

      // Add the dragged item to the new column
      setColumns(prevColumns => ({
        ...prevColumns,
        [newColumn]: [...(prevColumns[newColumn] || []), item],
      }));
    } else {
      // If the dragged item is from a column
      const updatedColumns = { ...columns };

      // Remove the dragged item from its previous column
      for (const column in updatedColumns) {
        updatedColumns[column] = updatedColumns[column].filter(word => word !== item);
      }

      // Add the dragged item to the new column
      updatedColumns[newColumn] = [...(updatedColumns[newColumn] || []), item];

      setColumns(updatedColumns);
    }
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
      setCorrectFlag(true);
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

  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <div className='content centerContent'>
        <div className='questionContainer'>
          <h2 className='question'>{currentTaskIndex}. {question}</h2>
          <button className='skipBtn' onClick={handleSkip}></button>
        </div>
        <div className="hint-container">
          <button className='hintBtn' onClick={toggleHint} aria-pressed={showHint} autoComplete="off"> HINT </button>
          {showHint && <div>{hint}</div>}
        </div>
        <div className='tw-container'>
          <div className="word-container">
            <h3>RIJEČI</h3>
            {shuffleArray(remainingWords).map((item, idx) => (
              <Word key={idx} item={item} index={idx} />
            ))}
          </div>
          <div className="table-container">
            {Object.entries(parsedTableJson).map(([column, items]) => (
              <Column key={column} column={column} items={columns[column] || []} onDrop={handleDrop} />
            ))}
          </div>
        </div>
        <div className="button-container">
          <button className="button" onClick={handleSubmit}>ODGOVORI</button>
        </div>
        {showIncorrectNumber && <div>Broj netočno postavljenih riječi: {incorrectWords}</div>}
        {correctFlag && <div>Točno sve!</div>}
      </div>
    </DndProvider>
  );
};

export default SolvingTableTask;
