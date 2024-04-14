import { useEffect, useRef, useState } from 'react';
import Board from './Board';
import socket from '../socket';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";

function SearchingWithLink({ setPageState, gameIdFromLink, settings }) {

    const [gameId, setGameId] = useState(uuidv4());
    const [username, setUsername] = useState(uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        separator: '',
        style: 'capital',
    }));
    const [gameState, setGameState] = useState(null);

    const [copied, setCopied] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {

        console.log(settings);

        function onInitiateGame(data) {
            socket.emit('join-game-room', { gameId: data.gameId });
            console.log('game ready');
            console.log(data);
            setGameState(data);
        }

        function onGameNotFound() {
            console.log('game not found');
            navigate("/")
        }

        function onGameFull() {
            console.log('game full');
            setPageState('home');
        }

        if (gameIdFromLink) {
            setGameId(gameIdFromLink);
            socket.emit('accept-challenge-by-link', { username, gameId: gameIdFromLink });
        } else {
            socket.emit('challenge-friend-by-link', { username, gameId, settings });
        }

        socket.on('initiate-game', onInitiateGame);
        socket.on('game-not-found', onGameNotFound);
        socket.on('game-full', onGameFull);

        return () => {
            socket.off('initiate-game', onInitiateGame);
            socket.off('game-not-found', onGameNotFound);
            socket.off('game-full', onGameFull);
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
        //render challengesettings first then this stuff below
        <>
            {gameState ? <Board gameStartState={gameState} username={username} /> : (
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
                </div>
            )}
        </>
    )
}

export default SearchingWithLink