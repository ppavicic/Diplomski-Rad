import React, { useState } from 'react';
import axios from 'axios';

function TextToSpeechComponent() {
  const [responseText, setResponseText] = useState('');
  const [error, setError] = useState(null);

  const handleTextToSpeech = async () => {
    const requestData = {
      text: "Vaš tekst koji želite pretvoriti u govor",
      language: "hr-HR",
      speaker: "ZPXGtAhiBWa8e3U12aRu",
      speed: "normal"
    };

    try {
      const response = await axios.post('https://api.eleven-labs.com/text-to-speech', requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer c3f49f7cb377b35e8e545f0dd495a25f'
        }
      });

      setResponseText(response.data); // Postavljanje odgovora u stanje komponente
    } catch (error) {
      setError(error); // Postavljanje greške u stanje komponente ako se dogodi greška
    }
  };

  return (
    <div>
      <button onClick={handleTextToSpeech}>Pretvori tekst u govor</button>
      {error && <div>Error: {error.message}</div>}
      {responseText && <div>Odgovor: {responseText}</div>}
    </div>
  );
}

export default TextToSpeechComponent;
