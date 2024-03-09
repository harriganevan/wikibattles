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

    const makeGuess = async (title) => {
        socket.emit('submit-page', {
            guess: encodeURI(title),
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
            <h2>current page: {decodeURI(currentPage)}</h2>
            
            {gameState.playerTurn == gameState.playersData[playerName].playerNumber ? (
                <>
                    <input onChange={handleChange} value={search} />

                    {searchResults.length !== 0 ? (
                        <div className="search-menu">
                            <ul role="listbox" className="search-result-container">
                                {searchResults.map(result =>
                                    <li role="option" className="search-result-item" onClick={() => makeGuess(result.title)} key={result.key}>
                                        <div className="search-result-content">
                                            {result.thumbnail !== null ?
                                                <span className="search-result-img" style={{ backgroundImage: 'url(' + result.thumbnail.url + ')' }} />
                                                :
                                                <span className="search-result-img" style={{ backgroundImage: 'url(' + './default.PNG' + ')' }} />
                                            }
                                            <span className="search-result-text">
                                                <span className="search-result-title">{result.title}</span>
                                                {result.description !== null ?
                                                    <span className="search-result-description">{result.description}</span>
                                                    : null}
                                            </span>
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )
                        :
                        null}
                </>
            )
                :
                <p>not your turn</p>}
        </>
    )
}

export default Board