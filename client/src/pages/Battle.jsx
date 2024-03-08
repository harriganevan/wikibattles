import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import BattleHome from '../components/BattleHome';
import ChallengeSettings from '../components/ChallengeSettings';
import Searching from '../components/Searching';
import Board from '../components/Board';
import socket from '../socket';

function Battle() {

    let { gameIdFromLink } = useParams();

    const [pageState, setPageState] = useState('home');
    const [settings, setSettings] = useState({});

    useEffect(() => {

        if(gameIdFromLink){
            setPageState('searching');
        }

        socket.connect();

    }, []);

    return (
        <>
            <div className='battle-container'>
                {pageState === 'home' && <BattleHome setPageState={setPageState} />}
                {pageState === 'settings' && <ChallengeSettings setPageState={setPageState} setSettings={setSettings} />}
                {pageState === 'searching' && <Searching setPageState={setPageState} gameIdFromLink={gameIdFromLink} settings={settings} />}
            </div>
        </>
    )
}

export default Battle
