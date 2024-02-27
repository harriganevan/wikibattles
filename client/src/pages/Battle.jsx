import { useState } from 'react';
import { useEffect } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

//move this to useEffect if you want new connection every time page is reloaded
const socket = io('http://localhost:3000', {
    autoConnect: false,
});

function Battle() {

    let { gameId } = useParams();

    const [links, setLinks] = useState([]);
    const [search, setSearch] = useState('');
    const [timerId, setTimerId] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState('');

    const getStartingLink = async () => {
        const response = await fetch('http://localhost:3000/links/');
        const startingLinks = await response.json();
        setLinks(startingLinks.links);
        setCurrentPage(startingLinks.currentTitle);
    }

    useEffect(() => {

        socket.connect();

        socket.on('receive_titles', (data) => {
            setLinks(data.links);
            setCurrentPage(data.currentTitle);
        });

        getStartingLink();

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
            {/* <div className='battle-home-container'>
                render different divs here depending on buttons clicks
            </div> */}
            <p>{gameId}</p>
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

export default Battle
