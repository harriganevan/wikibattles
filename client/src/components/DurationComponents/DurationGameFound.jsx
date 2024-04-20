import { useEffect, useState } from 'react';
import socket from '../../socket';

function DurationGameFound({ gameId, username }) {

    const startTime = Date.now() + 30000;
    const [timer, setTimer] = useState(30);
    const [timerId, setTimerId] = useState(null);

    const [ready, setReady] = useState(false);

    function startTimer() {
        if (!timerId) {
            setTimerId(
                setInterval(() => {
                    let tempTime = Math.floor((startTime - Date.now()) / 1000);
                    if(tempTime >= 0) {
                        setTimer(tempTime);
                    }
                }, 200)
            );
        }
    }

    useEffect(() => {
        startTimer();

        return () => {
            clearInterval(timerId);
        };

    }, [])

    function handleReadyClick(e) {
        socket.emit('ready-up', { gameId, username });
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

export default DurationGameFound;