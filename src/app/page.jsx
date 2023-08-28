'use client'

import { useEffect, useState } from 'react'

export default function Page() {
  const [messages, setMessages] = useState([])
  const [value, setValue] = useState('')

  useEffect(() => {
    const eventSource = new EventSource('/api')

    eventSource.onmessage = function (event) {
      const message = JSON.parse(event.data);
      setMessages(prev => [message, ...prev]);
    }

    return () => eventSource.close();
  }, [])

  const handleSend = async () => {
    await fetch('/api', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        id: Math.random() * 100000,
        message: value
      })
    })
  }

  return (
    <div>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <button onClick={handleSend}>
        Отправить
      </button>
      <div>
        {messages.map(({id, message}) => 
          <div key={id}>{message}</div>
        )}
      </div>
    </div>
  )
}
