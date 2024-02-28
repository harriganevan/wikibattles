import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import socket from '../socket';

function Board() {

    const [links, setLinks] = useState([]);
    const [search, setSearch] = useState('');
    const [timerId, setTimerId] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState('');

    const getStartingLinks = async () => {
        const response = await fetch('http://localhost:3000/links/');
        const startingLinks = await response.json();
        setLinks(startingLinks.links);
        setCurrentPage(startingLinks.currentTitle);
    }

    useEffect(() => {

        socket.on('receive_titles', (data) => {
            setLinks(data.links);
            setCurrentPage(data.currentTitle);
        });

        getStartingLinks();

    }, []);

    const makeGuess = async (link) => {
        const response = await fetch(`http://localhost:3000/guess/${encodeURI(link)}`, {
            method: 'POST',
        });
        const correct = await response.json();
        console.log(correct.correct);
    }

    const delayedFunction = async (value) => {
        if (value) {
            console.log('delayed search:', value);
            const response = await fetch(`https://en.wikipedia.org/w/rest.php/v1/search/title?q=${value}&limit=10`);
            const searchResults = await response.json();
            setSearchResults(searchResults.pages);
        }
    }

    const handleChange = (e) => {
        clearTimeout(timerId);
        setSearch(e.target.value);
        setTimerId(setTimeout(() => delayedFunction(e.target.value), 500));
    }

    return (
        <>
            <Link to="/">
                <h1>WikiBattles</h1>
            </Link>
            <h2>current page: {decodeURI(currentPage)}</h2>
            <input onChange={handleChange} value={search} />
            <div>
                {searchResults.map(result =>
                    <button onClick={() => makeGuess(result.title)} key={result.key}>{result.title}</button>
                )}
            </div>
            <div className='buttons'>
                {links.map(link =>
                    <button key={link}>{decodeURI(link)}</button>
                )}
            </div>
        </>
    )
}

export default Board