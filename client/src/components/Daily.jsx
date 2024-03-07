import { Link } from "react-router-dom"

function Daily() {
    return (
        <>
            <Link to="/">
                <h1>WikiBattles</h1>
            </Link>
            <h1>Daily puzzle</h1>
            <iframe src="https://en.wikipedia.org/wiki/Great_Britain" height="800" width="1200"/>
        </>
    )
}

export default Daily