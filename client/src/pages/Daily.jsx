import { Link } from "react-router-dom"

function Daily() {
    return (
        <div className="page">
            <Link to="/">
                <h1>WikiBattles</h1>
            </Link>
            <h1>Daily puzzle</h1>
            <iframe src="https://en.wikipedia.org/wiki/Great_Britain" height="800" width="1200"/>
        </div>
    )
}

export default Daily