import { useState } from 'react';
import { useEffect } from 'react';
import io from 'socket.io-client';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

//maybe can remove connect - io('http://localhost:3000')
const socket = io.connect('http://localhost:3000');

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    socket.on('receive_data', (data) => {
      setCount(data.count);
      console.log(data)
    })
  }, [socket]);

  const sendmessage = () => {
    socket.emit('click', {
      count: count+1
    });
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => sendmessage()}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
