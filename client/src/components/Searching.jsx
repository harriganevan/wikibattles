import { useEffect, useState } from 'react';
import socket from '../socket';

function Searching({ setPageState, gameIdFromLink }) {

    const [gameId, setGameId] = useState(Math.floor(Math.random() * 999999).toString()); //need to check if gameId is in use?
    const [username, setUsername] = useState('player'+Math.floor(Math.random() * 999999).toString());
    const [gameState, setGameState] = useState(null);

    useEffect(() => {

        if (gameIdFromLink) {
            setGameId(gameIdFromLink);
            socket.emit('join-game-room-from-link', { username, gameId: gameIdFromLink });
        } else {
            socket.emit('join-game-room', { username, gameId });
        }

        socket.on('initiate-game', (data) => {
            console.log('game ready');
            console.log(data);
            setPageState('board');
        });

    }, []);

    const handleClickBack = () => {
        socket.emit('leave-game-room', { gameId });
        setPageState('home');
    }

    return (
        <>
            <p>searching...</p>
            <p>copy invite link http://localhost:5173/battle/{gameId}</p>
            <button onClick={handleClickBack}>back</button>
            {/* when initiate game is received render Board here instead */}
        </>
    )
}

export default Searching