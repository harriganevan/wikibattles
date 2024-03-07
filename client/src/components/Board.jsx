import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import socket from '../socket';

function Board({ gameStartState, username }) {

    const [gameState, setGameState] = useState(gameStartState);
    const [playerName, setPlayerName] = useState(username);

    const [search, setSearch] = useState('');
    const [timerId, setTimerId] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(gameStartState.currentPage);

    useEffect(() => {

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

        return () => {
            socket.off('receive_titles', onReceiveTitles);
            socket.off('update-game', onUpdateGame);
        };

    }, []);

    const makeGuess = async (link) => {
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
            {gameState.playerTurn == gameState.playersData[playerName].playerNumber ? (
                <>
                    <input onChange={handleChange} value={search} />
                    <div>
                        {searchResults.map(result =>
                            <button onClick={() => makeGuess(result.title)} key={result.key}>{result.title}</button>
                        )}
                    </div>
                </> ) : <p>not your turn</p>}
        </>
    )
}

export default Board