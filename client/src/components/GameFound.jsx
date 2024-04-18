import socket from '../socket';

function GameFound({ gameId, username }) {

    function handleReadyClick() {
        socket.emit('ready-up', { gameId, username });
    }

    return (
        <>
            <p>game found</p>
            <button onClick={handleReadyClick}>ready up</button>
        </>
    )

}

export default GameFound;