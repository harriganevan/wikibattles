import { useState } from 'react';
import { useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

//maybe can remove connect - io('http://localhost:3000')
const socket = io.connect('http://localhost:3000');

function App() {

  const [links, setLinks] = useState([]);
  const [search, setSearch] = useState('');
  const [timerId, setTimerId] = useState('');
  const [searchResults, setSearchResults] = useState([]);

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
  }

  const delayedFunction = async (value) => {
    console.log('delayed search', value);
    const response = await fetch(`https://en.wikipedia.org/w/rest.php/v1/search/title?q=${value}&limit=5`);
    const searchResults = await response.json();
    console.log(searchResults);
  }

  const handleChange = (e) => {
    clearTimeout(timerId);
    setSearch(e.target.value);
    console.log(search);
    setTimerId(setTimeout(() => delayedFunction(e.target.value), 500));
  }

  return (
    <>
      <h1>WikiBattles</h1>
      <input onChange={handleChange} value={search}/>
      <div></div>
      <div className='buttons'>
        {links.map(link =>
          <button onClick={() => getNewLinks(link[0])}>{link[1]}</button>
        )}
      </div>
    </>
  )
}

export default App
