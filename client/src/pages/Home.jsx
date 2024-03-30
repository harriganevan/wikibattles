import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import socket from '../socket';
import battleSVG from '../assets/battle.svg';
import puzzleSVG from '../assets/puzzle.svg';
import genesis from '../assets/genesis.jpg';

function Home() {

    useEffect(() => {
        socket.disconnect();
    }, []);

    return (
        <div className='page-home'>
            <h1 className='home-title'>WikiBattles</h1>
            <div className='home-buttons'>
                <Link to="/battle">
                    <div className='battle-button-container'>
                        <img src={battleSVG} className='home-svg' />
                        <button type="button" className="btn btn-dark home-button">Battle</button>
                    </div>
                </Link>
                <Link to="/daily">
                    <div className='battle-button-container'>
                        <img src={puzzleSVG} className='home-svg' />
                        <button type="button" className="btn btn-dark home-button">Daily Puzzle</button>
                    </div>
                </Link>
            </div>
        </div>
    )

}

export default Home