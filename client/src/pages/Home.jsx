import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import socket from '../socket';
import battleSVG from '../assets/battle.svg';
import puzzleSVG from '../assets/puzzle.svg';

function Home() {

    useEffect(() => {
        socket.disconnect();
    }, []);

    return (
        <div className='page'>
            <h1 className='home-title'>WikiBattles</h1>
            <div className='home-buttons'>
                <Link to="/battle">
                    <div className='battle-button-container'>
                        <button type="button" className="btn btn-dark home-button">Battle</button>
                        <img src={battleSVG} className='battle-svg' />
                    </div>
                </Link>
                <Link to="/daily">
                    <div className='battle-button-container'>
                        <button type="button" className="btn btn-dark home-button">Daily Puzzle</button>
                        <img src={puzzleSVG} className='puzzle-svg' />
                    </div>
                </Link>
            </div>
        </div>
    )

}

export default Home