import { useState } from 'react';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from '../socket';
import BattleHome from '../components/BattleHome';
import DurationChallengeSettings from '../components/DurationComponents/DurationChallengeSettings';
import DurationSearchingWithLink from '../components/DurationComponents/DurationSearchingWithLink';
import DurationSearching from '../components/DurationComponents/DurationSearching';
import RaceSearching from '../components/RaceComponents/RaceSearching';
import RaceSearchingWithLink from '../components/RaceComponents/RaceSearchingWithLink';
import RaceChallengeSettings from '../components/RaceComponents/RaceChallengeSettings';

function Battle() {

    const navigate = useNavigate();

    let { gameMode, gameIdFromLink } = useParams();

    const [pageState, setPageState] = useState('home');
    const [durationSettings, setDurationSettings] = useState({});
    const [raceSettings, setRaceSettings] = useState({});

    useEffect(() => {

        socket.disconnect();

        if (gameMode == 'duration' && gameIdFromLink) {
            setPageState('duration-searchingWithLink');
        }
        if (gameMode == 'race' && gameIdFromLink) {
            setPageState('race-searchingWithLink');
        }
        if ((gameMode != 'duration' && gameMode != 'race') || gameIdFromLink === undefined) { //bad urls
            navigate("/battle");
        }

        socket.connect();

    }, []);

    return (
        <div className='page'>
            <div className='battle-container flex-fill'>
                {pageState === 'home' && <BattleHome setPageState={setPageState} />}

                {pageState === 'duration-searching' && <DurationSearching setPageState={setPageState} />}
                {pageState === 'duration-settings' && <DurationChallengeSettings setPageState={setPageState} setSettings={setDurationSettings} />}
                {pageState === 'duration-searchingWithLink' && <DurationSearchingWithLink setPageState={setPageState} gameIdFromLink={gameIdFromLink} settings={durationSettings} />}

                {pageState === 'race-searching' && <RaceSearching setPageState={setPageState} />}
                {pageState === 'race-settings' && <RaceChallengeSettings setPageState={setPageState} setSettings={setRaceSettings} />}
                {pageState === 'race-searchingWithLink' && <RaceSearchingWithLink setPageState={setPageState} gameIdFromLink={gameIdFromLink} settings={raceSettings} />}
            </div>
        </div>
    )
}

export default Battle
