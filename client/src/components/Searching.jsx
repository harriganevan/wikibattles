import { useEffect, useState } from 'react';
import Board from './Board';
import socket from '../socket';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

function Searching({ setPageState }) {

    const [username, setUsername] = useState(uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        separator: '',
        style: 'capital',
    }));
    const [gameState, setGameState] = useState(null);

    useEffect(() => {

        socket.emit('find-game', { username });

        function onInitiateGame(data) {
            socket.emit('join-game-room', { gameId: data.gameId });
            console.log('game ready');
            setGameState(data);
        }

        socket.on('initiate-game', onInitiateGame);

        return () => {
            socket.off('initiate-game', onInitiateGame);
        };

    }, []);

    const handleClickBack = () => {
        socket.emit('stop-search', { socketId: socket.id });
        setPageState('home');
    }

    return (
        // render board if theres a gameState
        <>
            {gameState ? <Board gameStartState={gameState} username={username} /> : (
                <div className='searching-container'>
                    <div className='waiting'>
                        <p className='waiting-text'>searching...</p>
                        <div className="spinner-border text-info" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                    <button onClick={handleClickBack} type="button" className="btn btn-dark home-button">BACK</button>
                </div>
            )}
        </>
    )
}

export default Searching