import { useState } from 'react';
import { useEffect } from 'react';
import socket from '../../socket';
import DurationSearchResultBoard from './DurationSearchResultBoard';
import DurationEndPage from './DurationEndPage';

function DurationBoard({ gameStartState, username }) {

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
            setCountdown(gameStartState.secondsPerTurn);
            setStartedTime(Date.now() + (gameStartState.secondsPerTurn * 1000));
            setGameState(data.gameState);
            setCurrentPage(data.gameState.currentPage);
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

        const interval = setInterval(() => {
            let tempTime = Math.floor((startedTime - Date.now()) / 1000);
            if (tempTime < 0) {
                tempTime = 0;
            }
            setCountdown(tempTime);
        }, 200);

        if(gameOver){
            clearInterval(interval)
        }

        return () => clearInterval(interval);

    }, [countdown, gameOver]);

    const makeGuess = async (result) => {
        socket.emit('submit-page', {
            guess: { title: encodeURI(result.title), thumbnail: result.thumbnail, description: result.description },
            gameState,
            username,
        })
    }

    const delayedFunction = async (value) => {
        if (value) {
            const response = await fetch(`https://en.wikipedia.org/w/rest.php/v1/search/title?q=${value}&limit=10`);
            const searchResults = await response.json();
            setSearchResults(searchResults.pages);
        }
    }

    const handleChange = (e) => {
        clearTimeout(searchTimerId);
        setSearch(e.target.value);
        setSearchTimerId(setTimeout(() => delayedFunction(e.target.value), 300));
    }

    return (
        <>
            <div className='duration-board-header'>
                <p className={'player-name-left' + (!gameOver && gameState.playerTurn == 1 ? ' bold' : '') + (gameOver && gameState.playerTurn !== 1 ? ' winner' : '')}>
                    {Object.values(gameState.playersData).find(obj => obj.playerNumber == 1).username}
                    {gameState.playersData[playerName].playerNumber == 1 && ' (you)'}
                </p>
                <h2>{countdown}</h2>
                <p className={'player-name-right' + (!gameOver && gameState.playerTurn == 2 ? ' bold' : '') + (gameOver && gameState.playerTurn !== 2 ? ' winner' : '')}>
                    {Object.values(gameState.playersData).find(obj => obj.playerNumber == 2).username}
                    {gameState.playersData[playerName].playerNumber == 2 && ' (you)'}
                </p>
            </div>

            <div className={(!gameOver && gameState.playersData[playerName].playerNumber == gameState.playerTurn ? 'board-state-blue' : 'board-state')}>
                {gameOver ? <h2>GAME OVER</h2> :
                    gameState.playersData[playerName].playerNumber == gameState.playerTurn
                        ? <h2>YOUR TURN</h2>
                        : <h2>OPONENETS TURN</h2>
                }
            </div>

            {!gameOver ?
                <>
                    <div>
                        <h2>Current Page:</h2>
                        <h2>{decodeURIComponent(currentPage)}</h2>
                    </div>
                    {gameState.playerTurn == gameState.playersData[playerName].playerNumber ?
                        <>
                            <input onChange={handleChange} value={search} placeholder="search for page" />
                            {searchResults.length !== 0 ?
                                <div className="search-menu flex-fill">
                                    <ul role="listbox" className="search-result-container">
                                        {searchResults.filter((result) => result.title != decodeURIComponent(currentPage)).map(result =>
                                            <DurationSearchResultBoard makeGuess={makeGuess} result={result} key={result.key} />
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
                    <p>pages:</p>
                    <div className='flex-fill end-pages'>
                        <div className='board-pages'>
                            {gameState.pageData.map(page =>
                                <a href={`https://en.wikipedia.org/wiki/${page.title}`} target={"_blank"} className='end-tag' key={page.title}><DurationEndPage page={page} /></a>
                            )}
                        </div>
                    </div>
                </>}
        </>
    )
}

export default DurationBoard