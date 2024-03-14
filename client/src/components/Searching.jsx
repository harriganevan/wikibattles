import { useEffect, useState } from 'react';
import Board from './Board';
import socket from '../socket';

function Searching({ setPageState, gameIdFromLink, settings }) {

    const [gameId, setGameId] = useState(Math.floor(Math.random() * 999999).toString());
    const [username, setUsername] = useState('player' + Math.floor(Math.random() * 999999).toString());
    const [gameState, setGameState] = useState(null);

    useEffect(() => {


    }, []);


    return (
        <>
            <p>searching...</p>
        </>
    )
}

export default Searching