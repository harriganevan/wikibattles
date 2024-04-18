import { useEffect, useRef, useState } from 'react';
import Board from './Board';
import socket from '../socket';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";
import GameFound from './GameFound';

function SearchingWithLink({ setPageState, gameIdFromLink, settings }) {

    const [loading, setLoading] = useState(false);

    const [gameId, setGameId] = useState(uuidv4());

    const [username, setUsername] = useState(uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        separator: '',
        style: 'capital',
    }));

    const [gameState, setGameState] = useState(null);

    const [ready, setReady] = useState(false);

    const [copied, setCopied] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {

        if (gameIdFromLink) {
            setLoading(true);
            setGameId(gameIdFromLink);
            socket.emit('accept-challenge-by-link', { username, gameId: gameIdFromLink });
        } else {
            socket.emit('challenge-friend-by-link', { username, gameId, settings });
        }

        function onInitiateGame(data) {
            setLoading(false);
            setGameState(data);
        }

        function onGameNotFound() {
            console.log('game not found');
            navigate("/");
        }

        function onReady(data) {
            socket.emit('join-game-room', { gameId: data.gameId });
            console.log('game ready');
            setReady(true);
        }

        socket.on('initiate-game', onInitiateGame);
        socket.on('game-not-found', onGameNotFound);
        socket.on('ready', onReady);

        return () => {
            socket.off('initiate-game', onInitiateGame);
            socket.off('game-not-found', onGameNotFound);
            socket.off('ready', onReady);
        };

    }, []);

    const handleClickBack = () => {
        socket.emit('leave-game-room', { gameId });
        setPageState('home');
    }

    const handleCopyClick = () => {
        navigator.clipboard.writeText(`${import.meta.env.VITE_ORIGIN}/battle/${gameId}`);
        setCopied(true);
    }

    return (
        <>
            {gameState ? ( ready ? <Board gameStartState={gameState} username={username} /> : <GameFound gameId={gameId} username={username} />) : (
                !loading ?
                    <div className='searching-container'>
                        <div className='waiting'>
                            <p className='waiting-text'>waiting...</p>
                            <div className="spinner-border text-info" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                        <div className='searching-w-link-buttons'>
                            {copied && <p className='copied'>copied to clipboard</p>}
                            <button onClick={handleCopyClick} type="button" className="btn btn-dark">COPY INVITE LINK</button>
                            <button onClick={handleClickBack} type="button" className="btn btn-dark">&larr; BACK</button>
                        </div>
                    </div> :
                    <div className="spinner-border text-info" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
            )}
        </>
    )
}

export default SearchingWithLink