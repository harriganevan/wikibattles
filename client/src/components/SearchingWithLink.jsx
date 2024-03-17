import { useEffect, useState } from 'react';
import Board from './Board';
import socket from '../socket';

function SearchingWithLink({ setPageState, gameIdFromLink, settings }) {

    const [gameId, setGameId] = useState(Math.floor(Math.random() * 999999).toString());
    const [username, setUsername] = useState('player' + Math.floor(Math.random() * 999999).toString());
    const [gameState, setGameState] = useState(null);

    useEffect(() => {

        console.log(settings);

        function onInitiateGame(data) {
            socket.emit('join-game-room', { gameId: data.gameId })
            console.log('game ready');
            console.log(data);
            setGameState(data);
        }

        function onGameNotFound() {
            console.log('game not found');
            setPageState('home');
        }

        function onGameFull() {
            console.log('game full');
            setPageState('home');
        }

        if (gameIdFromLink) {
            setGameId(gameIdFromLink);
            socket.emit('accept-challenge-by-link', { username, gameId: gameIdFromLink });
        } else {
            socket.emit('challenge-friend-by-link', { username, gameId, settings });
        }

        socket.on('initiate-game', onInitiateGame);
        socket.on('game-not-found', onGameNotFound);
        socket.on('game-full', onGameFull);

        return () => {
            socket.off('initiate-game', onInitiateGame);
            socket.off('game-not-found', onGameNotFound);
            socket.off('game-full', onGameFull);
        };

    }, []);

    const handleClickBack = () => {
        socket.emit('leave-game-room', { gameId });
        setPageState('home');
    }

    return (
        //render challengesettings first then this stuff below
        <>
            {gameState ? <Board gameStartState={gameState} username={username} /> : (
                <>
                    <div className='waiting'>
                        <p className='waiting-text'>waiting...</p>
                        <div className="spinner-border text-info" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                    <p>copy invite link http://localhost:5173/battle/{gameId}</p>
                    <button onClick={handleClickBack}>back</button>
                </>
            )}
        </>
    )
}

export default SearchingWithLink