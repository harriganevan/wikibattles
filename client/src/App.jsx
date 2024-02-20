import { useState } from 'react';
import { useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

//maybe can remove connect - io('http://localhost:3000')
const socket = io.connect('http://localhost:3000');

function App() {

  const [links, setLinks] = useState([]);

  const getLinks = async () => {
    const response = await fetch('http://localhost:3000/links');
    const newLinks = await response.json();
    setLinks(newLinks.links);
    console.log(links)
  }

  useEffect(() => {

    getLinks();

    socket.on('receive_titles', (links) => {
      setLinks(links);
    })

  }, [socket]);

  const getNewLinks = async (link) => {
    const response = await fetch(`http://localhost:3000/links/${link.replaceAll('/', '%2F')}`, {
      method: 'POST',
    });
    const newLinks = await response.json();
    console.log(newLinks)
  }

  return (
    <>
      <h1>WikiBattles</h1>
      <div>
        {links.map(link =>
          <button onClick={() => getNewLinks(link[0])}>{link[1]}</button>
        )}
      </div>
    </>
  )
}

export default App
