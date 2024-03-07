import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import socket from '../socket';

function Board({ gameStartState, username }) {

    const [gameState, setGameState] = useState(gameStartState);
    const [playerName, setPlayerName] = useState(username);

    // const [links, setLinks] = useState([]);
    const [search, setSearch] = useState('');
    const [timerId, setTimerId] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(gameStartState.currentPage);

    // const getStartingLinks = async () => {
    //     const response = await fetch('http://localhost:3000/links/');
    //     const startingLinks = await response.json();
    //     setLinks(startingLinks.links);
    //     setCurrentPage(startingLinks.currentTitle);
    // }

    useEffect(() => {

        //start turn stuff

        function onReceiveTitles(data) {
            setLinks(data.links);
            setCurrentPage(data.currentTitle);
        }

        function onUpdateGame(data) {
            setGameState(data.gameState);
            setCurrentPage(data.gameState.currentPage);
            console.log(data);
        }

        socket.on('receive_titles', onReceiveTitles);
        socket.on('update-game', onUpdateGame);

        // getStartingLinks();

        return () => {
            socket.off('receive_titles', onReceiveTitles);
            socket.off('update-game', onUpdateGame);
        };

    }, []);

    //these need to be socket events now
    const makeGuess = async (link) => {
        // const response = await fetch(`http://localhost:3000/guess/${encodeURI(link)}`, {
        //     method: 'POST',
        // });
        // const correct = await response.json();
        // console.log(correct.correct);

        socket.emit('submit-page', {
            guess: encodeURI(link),
            gameState,
            username,
        })
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
            <p>current turn: {gameState.playerTurn}</p>
            <p>you are: {gameState.playersData[playerName].playerNumber}</p>
            <h2>current page: {decodeURI(currentPage)}</h2>
            {gameState.playerTurn == gameState.playersData[playerName].playerNumber ? <input onChange={handleChange} value={search} /> : <p>not your turn</p>}
            <div>
                {searchResults.map(result =>
                    <button onClick={() => makeGuess(result.title)} key={result.key}>{result.title}</button>
                )}
            </div>
            {/* <div className='buttons'>
                {links.map(link =>
                    <button key={link}>{decodeURI(link)}</button>
                )}
            </div> */}
        </>
    )
}

export default Board