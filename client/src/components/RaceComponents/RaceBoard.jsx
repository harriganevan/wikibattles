import { useState } from 'react';
import { useEffect } from 'react';
import socket from '../../socket';
import SearchResultBoard from '../SearchResultBoard';
import RaceEndPage from './RaceEndPage';

function RaceBoard({ gameState, username }) {

    const startPage = gameState.startingPage;
    const endPage = gameState.endingPage;

    const [playerName, setPlayerName] = useState(username);

    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {

        function onGameOver() {
            setGameOver(true);
            console.log('game over');
        }

        function onPlayerLeft() {
            console.log('player left');
        }

        socket.on('game-over', onGameOver);
        socket.on('player-left', onPlayerLeft);

        return () => {
            socket.off('game-over', onGameOver);
            socket.off('player-left', onPlayerLeft);
        };

    }, []);

    return (
        <>
            <p>{startPage + endPage}</p>
        </>
    )
}

export default RaceBoard