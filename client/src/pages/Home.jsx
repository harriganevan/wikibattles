import { Link } from 'react-router-dom';

function Home() {
    return (
        <>
            <h1>WikiBattles</h1>
            <Link to="/battle">
                Battle
            </Link>
            <br />
            <Link to="/daily">
                Daily Puzzle
            </Link>
        </>
    )

}

export default Home