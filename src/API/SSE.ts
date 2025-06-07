// src/components/SseListener.tsx

import React, { useEffect, useState } from 'react';

interface ServerMessage {
  message: string;
  timestamp: string;
}

export default function SseListener() {
  const [messages, setMessages] = useState<ServerMessage[]>([]);

  useEffect(() => {
    const evtSource = new EventSource('http://localhost:3000/events');

    evtSource.onmessage = (event) => {
      const data: ServerMessage = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    evtSource.onerror = (err) => {
      console.error('SSE error:', err);
      evtSource.close();
    };

    return () => {
      evtSource.close();
    };
  }, []);

  return (
    <div>
      <h2>Server-Sent Events Demo</h2>
      <ul>
        {messages.map((msg, idx) => (
          <li key={idx}>
            {msg.message} — <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
