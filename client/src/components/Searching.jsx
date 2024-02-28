
import { useEffect } from 'react';
import socket from '../socket';

function Searching({ setPageState }) {

    useEffect(() => {

        socket.on('challenge-waiting', (data) => {
            
        });

    }, []);


    return (
        <>
            <p>searching</p>
            <button onClick={() => setPageState('board')}>start</button>
            <button onClick={() => setPageState('home')}>back</button>
        </>
    )
}

export default Searching;