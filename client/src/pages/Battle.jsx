import { useState } from 'react';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from '../socket';
import BattleHome from '../components/BattleHome';
import DurationChallengeSettings from '../components/DurationComponents/DurationChallengeSettings';
import DurationSearchingWithLink from '../components/DurationComponents/DurationSearchingWithLink';
import DurationSearching from '../components/DurationComponents/DurationSearching';

function Battle() {

    const navigate = useNavigate();

    let { gameMode, gameIdFromLink } = useParams();
    console.log(gameMode, gameIdFromLink)

    const [pageState, setPageState] = useState('home');
    const [settings, setSettings] = useState({}); //used for challenge by link

    useEffect(() => {

        socket.disconnect();

        if(gameMode == 'duration' && gameIdFromLink){
            setPageState('duration-searchingWithLink');
        }
        if((gameMode != 'duration' && gameMode != 'race') || gameIdFromLink === undefined){
            navigate("/battle");
        }

        socket.connect();

    }, []);

    return (
        <div className='page'>
            <div className='battle-container flex-fill'>
                {pageState === 'home' && <BattleHome setPageState={setPageState} />}
                {pageState === 'duration-searching' && <DurationSearching setPageState={setPageState} gameIdFromLink={gameIdFromLink} />}
                {pageState === 'duration-settings' && <DurationChallengeSettings setPageState={setPageState} setSettings={setSettings} />}
                {pageState === 'duration-searchingWithLink' && <DurationSearchingWithLink setPageState={setPageState} gameIdFromLink={gameIdFromLink} settings={settings} />}
            </div>
        </div>
    )
}

export default Battle
