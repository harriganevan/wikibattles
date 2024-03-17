import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import socket from '../socket';

function Home() {

    useEffect(() => {
        socket.disconnect();
    }, []);

    return (
        <div className='page'>
            <h1>WikiBattles</h1>
            <Link to="/battle">
                Battle
            </Link>
            <Link to="/daily">
                Daily Puzzle
            </Link>
        </div>
    )

}

export default Home