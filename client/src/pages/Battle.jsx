import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import BattleHome from '../components/BattleHome';
import ChallengeSettings from '../components/ChallengeSettings';
import SearchingWithLink from '../components/SearchingWithLink';
import Board from '../components/Board';
import socket from '../socket';
import Searching from '../components/Searching';

function Battle() {

    let { gameIdFromLink } = useParams();

    const [pageState, setPageState] = useState('home');
    const [settings, setSettings] = useState({}); //used for challenge by link

    useEffect(() => {

        socket.disconnect();

        if(gameIdFromLink){
            setPageState('searchingWithLink');
        }

        socket.connect();

    }, []);

    return (
        <div className='page'>
            <div className='battle-container'>
                {pageState === 'home' && <BattleHome setPageState={setPageState} />}
                {pageState === 'searching' && <Searching setPageState={setPageState} gameIdFromLink={gameIdFromLink} />}
                {/* i want to get rid of having challengeSettings and searcingWithLink both here - one or the other - remove settings from this file */}
                {pageState === 'settings' && <ChallengeSettings setPageState={setPageState} setSettings={setSettings} />}
                {pageState === 'searchingWithLink' && <SearchingWithLink setPageState={setPageState} gameIdFromLink={gameIdFromLink} settings={settings} />}
            </div>
        </div>
    )
}

export default Battle
