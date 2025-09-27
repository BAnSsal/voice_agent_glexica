// app/page.js
'use client';

import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState('Hello from my first Next.js voice app!');
  const [isLoading, setIsLoading] = useState(false);

  const handleSpeak = async () => {
    if (!text.trim()) {
      alert('Please enter some text.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('API call failed.');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();

    } catch (error) {
      console.error("Error playing audio:", error);
      alert('Sorry, there was an error generating the voice.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>Simple Cartesia Voice Agent</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        cols={50}
        style={{ padding: '10px', fontSize: '16px', display: 'block', margin: '20px auto' }}
        placeholder="Enter text to speak"
      />
      <button onClick={handleSpeak} disabled={isLoading} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
        {isLoading ? 'Generating...' : 'Speak'}
      </button>
    </main>
  );
}