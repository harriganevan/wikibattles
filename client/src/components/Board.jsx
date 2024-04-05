import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import socket from '../socket';
import defaultPhoto from '../assets/default.svg';
import SearchResultBoard from './SearchResultBoard';

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

        function onPlayerLeft() {
            console.log('player left');
        }

        socket.on('receive_titles', onReceiveTitles);
        socket.on('update-game', onUpdateGame);
        socket.on('game-over', onGameOver);
        socket.on('player-left', onPlayerLeft);

        return () => {
            socket.off('receive_titles', onReceiveTitles);
            socket.off('update-game', onUpdateGame);
            socket.off('game-over', onGameOver);
            socket.off('player-left', onPlayerLeft);
        };

    }, []);

    //for countdown timer
    useEffect(() => {

        if (countdown > 0) {
            const interval = setInterval(() => {
                let tempTime = Math.floor((startedTime - Date.now()) / 1000);
                if (tempTime < 0) {
                    tempTime = 0;
                }
                setCountdown(tempTime);
            }, 500);

            return () => clearInterval(interval);
        }

    }, [countdown]);

    const makeGuess = async (title) => {
        //send entire result object so i can include title, descr, img 
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
        setSearchTimerId(setTimeout(() => delayedFunction(e.target.value), 200));
    }

    return (
        <>
            <div className='board-header'>
                <p className={'player-name-left' + (gameState.playerTurn == 1 ? ' bold' : '')}>
                    {Object.values(gameState.playersData).find(obj => obj.playerNumber == 1).username}
                    {gameState.playersData[playerName].playerNumber == 1 && ' (you)'}
                </p>
                <h2>{countdown}</h2>
                <p className={'player-name-right' + (gameState.playerTurn == 2 ? ' bold' : '')}>
                    {Object.values(gameState.playersData).find(obj => obj.playerNumber == 2).username}
                    {gameState.playersData[playerName].playerNumber == 2 && ' (you)'}
                </p>
            </div>

            <div className='board-state'>
                {gameOver ? <h2>GAME OVER</h2> :
                    gameState.playersData[playerName].playerNumber == gameState.playerTurn
                        ? <h2>YOUR TURN</h2>
                        : <h2>OPONENETS TURN</h2>
                }
            </div>

            {!gameOver ?
                <>
                    <div>
                        <h2>current page:</h2>
                        <h2>{decodeURI(currentPage)}</h2>
                    </div>
                    {gameState.playerTurn == gameState.playersData[playerName].playerNumber ?
                        <>
                            <input onChange={handleChange} value={search} placeholder="search for page" />
                            {searchResults.length !== 0 ?
                                <div className="search-menu flex-fill">
                                    <ul role="listbox" className="search-result-container">
                                        {searchResults.map(result =>
                                            <SearchResultBoard makeGuess={makeGuess} result={result} key={result.key} />
                                        )}
                                    </ul>
                                </div>
                                : null}
                        </>
                        : null}
                </>
                : //when game is over
                <>
                    <h2 className='win-lose-msg'>{gameState.playersData[playerName].playerNumber === gameState.playerTurn ? 'YOU LOSE' : 'YOU WIN'}</h2>
                    <div className='flex-fill'>
                        <p>pages:</p>
                        <div className='board-pages'>
                            {gameState.connectedPages.map(page =>
                                <p key={page}>{decodeURI(page)}</p>
                            )}
                        </div>
                    </div>

                </>}
        </>
    )
}

export default Board