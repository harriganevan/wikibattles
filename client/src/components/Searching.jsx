import { useEffect, useState } from 'react';
import socket from '../socket';

function Searching({ setPageState }) {

    const [gameId, setGameId] = useState(123);
    const [username, setUsername] = useState('player');

    useEffect(() => {

        socket.emit('challenge-friend-by-link', { username, gameId });

        socket.on('challenge-waiting', (data) => {
            console.log(data.gameId);
        });

    }, []);


    return (
        <>
            <p>searching...</p>
            <p>copy invite link</p>
            <button onClick={() => setPageState('board')}>start</button>
            <button onClick={() => setPageState('home')}>back</button>
        </>
    )
}

export default Searching