import { useEffect, useState } from 'react';
import socket from '../../socket';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';
import RaceBoard from './RaceBoard';
import RaceGameFound from './RaceGameFound';

function RaceSearching({ setPageState }) {

    const [username, setUsername] = useState(uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        separator: '',
        style: 'capital',
    }));

    const [ready, setReady] = useState(false);

    const [gameState, setGameState] = useState(null);

    const [gameId, setGameId] = useState(null);

    useEffect(() => {

        socket.emit('race-find-game', { username });

        function onInitiateGame(data) {
            setGameState(data);
            setGameId(data.gameId);
            console.log(data)
            socket.emit('join-game-room', { gameId: data.gameId });
        }

        function onReady(data) {
            console.log('game ready');
            setReady(true);
        }

        socket.on('initiate-game', onInitiateGame);
        socket.on('ready', onReady);

        return () => {
            socket.off('initiate-game', onInitiateGame);
            socket.off('ready', onReady);
        };

    }, []);

    const handleClickBack = () => {
        socket.emit('race-stop-search', { socketId: socket.id });
        setPageState('home');
    }

    return (
        <>
            {gameState ? ( ready ? <RaceBoard gameState={gameState} username={username} /> : <RaceGameFound gameId={gameId} username={username} />) : (
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

export default RaceSearching