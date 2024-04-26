import { useEffect, useState } from 'react';
import socket from '../../socket';

function RaceGameFound({ gameId, username }) {

    const [timer, setTimer] = useState(30);
    const [ready, setReady] = useState(false);

    useEffect(() => {

        const startedTime = Date.now() + 30000;
        const interval = setInterval(() => {
            let tempTime = Math.floor((startedTime - Date.now()) / 1000);
            if (tempTime < 0) {
                tempTime = 0;
            }
            setTimer(tempTime);
        }, 200)

        return () => {
            clearInterval(interval);
        };

    }, [])

    function handleReadyClick(e) {
        socket.emit('race-ready-up', { gameId, username });
        e.target.disabled = true;
        setReady(true);
    }

    return (
        <div className='game-found-container'>
            <p>Game found</p>
            <button onClick={handleReadyClick} type="button" className="btn btn-dark home-button">ready up ({timer})</button>
            {ready ? <p className='ready-message'>Ready. Waiting for opponent</p> : null}
        </div>
    )

}

export default RaceGameFound;