import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import socket from '../socket';

function Home() {

    useEffect(() => {
        socket.disconnect();
    }, []);

    return (
        <div className='page'>

            <h1 className='home-title'>WikiBattles</h1>
            <div className='home-buttons'>
                <Link to="/battle">
                    <button type="button" className="btn btn-dark home-button">Battle</button>
                </Link>
                <Link to="/daily">
                    <button type="button" className="btn btn-dark home-button">Daily Puzzle</button>
                </Link>
            </div>
        </div>
    )

}

export default Home