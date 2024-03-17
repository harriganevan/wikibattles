import { useEffect, useState } from 'react';
import Board from './Board';
import socket from '../socket';

function Searching({ setPageState }) {

    const [gameId, setGameId] = useState(Math.floor(Math.random() * 999999).toString());
    const [username, setUsername] = useState('player' + Math.floor(Math.random() * 999999).toString());
    const [gameState, setGameState] = useState(null);

    useEffect(() => {

        socket.emit('find-game', {username, gameId});

        function onGameFound() {
            //setGameState

        }

        socket.on('game-found', onGameFound);

        return () => {
            socket.off('game-found', onGameFound);
        };

    }, []);


    return (
        // render board if theres a gameState
        <>
            <p>searching...</p>
        </>
    )
}

export default Searching