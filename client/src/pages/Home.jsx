import { Link } from 'react-router-dom';

function Home() {
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