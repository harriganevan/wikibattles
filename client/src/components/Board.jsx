import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import socket from '../socket';
import defaultPhoto from '../assets/default.svg';

function Board({ gameStartState, username }) {

    const [gameState, setGameState] = useState(gameStartState);
    const [playerName, setPlayerName] = useState(username);

    const [search, setSearch] = useState('');
    const [searchTimerId, setSearchTimerId] = useState(null);
    const [searchResults, setSearchResults] = useState([]);

    const [countdown, setCountdown] = useState(gameStartState.secondsPerTurn);
    const [startedTime, setStartedTime] = useState(Date.now() + (gameStartState.secondsPerTurn * 1000));

    const [currentPage, setCurrentPage] = useState(gameStartState.currentPage);

    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {

        function onReceiveTitles(data) {
            setLinks(data.links);
            setCurrentPage(data.currentTitle);
        }

        function onUpdateGame(data) {
            //reset countdown timer
            setCountdown(gameStartState.secondsPerTurn);
            setStartedTime(Date.now() + (gameStartState.secondsPerTurn * 1000));
            setGameState(data.gameState);
            setCurrentPage(data.gameState.currentPage);
            console.log(data);
        }

        function onGameOver() {
            setGameOver(true);
            console.log('game over');
        }

        socket.on('receive_titles', onReceiveTitles);
        socket.on('update-game', onUpdateGame);
        socket.on('game-over', onGameOver);

        return () => {
            socket.off('receive_titles', onReceiveTitles);
            socket.off('update-game', onUpdateGame);
            socket.off('game-over', onGameOver);
        };

    }, []);

    //for countdown timer
    useEffect(() => {

        if (countdown > 0) {
            const interval = setInterval(() => {
                let tempTime = Math.floor((startedTime - Date.now()) / 1000);
                if(tempTime < 0){
                    tempTime = 0;
                }
                setCountdown(tempTime);
            }, 500);

            return () => clearInterval(interval);
        }

    }, [countdown]);

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
        clearTimeout(searchTimerId);
        setSearch(e.target.value);
        setSearchTimerId(setTimeout(() => delayedFunction(e.target.value), 500));
    }

    return (
        <>
            <Link to="/">
                <h1>WikiBattles</h1>
            </Link>

            <h2>{countdown}</h2>

            {!gameOver ?
                <>
                    <h2>current page: {decodeURI(currentPage)}</h2>
                    {gameState.playerTurn == gameState.playersData[playerName].playerNumber ?
                        <>
                            <input onChange={handleChange} value={search} />
                            {searchResults.length !== 0 ? 
                                <div className="search-menu">
                                    <ul role="listbox" className="search-result-container">
                                        {searchResults.map(result =>
                                            <li role="option" className="search-result-item" onClick={() => makeGuess(result.title)} key={result.key}>
                                                <div className="search-result-content">
                                                    {result.thumbnail !== null ?
                                                        <span className="search-result-img" style={{ backgroundImage: 'url(' + result.thumbnail.url + ')' }} />
                                                        :
                                                        <span className="search-result-img-placeholder">
                                                            <span className="search-result-img-default" style={{ backgroundImage: 'url(' + defaultPhoto + ')' }} />
                                                        </span>
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
                                : null}
                        </>
                        : <p>not your turn</p>}
                </> 
                : //when game is over
                <>
                    <h1>GAME OVER</h1>
                    <h2>{gameState.playersData[playerName].playerNumber === gameState.playerTurn ? 'you lose' : 'you win'}</h2>
                    {gameState.connectedPages.map(page => 
                        <p key={page}>{decodeURI(page)}</p>
                    )}
                </>}
        </>
    )
}

export default Board