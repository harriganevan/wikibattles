import { useState } from "react"

function ChallengeSettings({ setPageState, setSettings }) {

    const [search, setSearch] = useState('');
    const [timerId, setTimerId] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [timePerTurn, setTimePerTurn] = useState(23);
    const [startingPage, setStartingPage] = useState('77th British Academy Film Awards');

    //function to check if starting page exists
    //or force user to click search result box  ! yes

    const delayedFunction = async (value) => {
        if (value) {
            console.log('delayed search:', value);
            const response = await fetch(`https://en.wikipedia.org/w/rest.php/v1/search/title?q=${value}&limit=10`);
            const searchResults = await response.json();
            setSearchResults(searchResults.pages);
        }
    }

    const handleSearchChange = (e) => {
        clearTimeout(timerId);
        setSearch(e.target.value);
        setTimerId(setTimeout(() => delayedFunction(e.target.value), 500));
    }

    const handleSliderChange = (e) => {
        setTimePerTurn(e.target.value);
    }

    function onContinueClick() {
        setSettings({ time: timePerTurn, startingPage: startingPage });
        setPageState('searching');
    }

    return (
        <>
            <h2>challenge settings</h2>
            <input type="range" min="5" max="90" value={timePerTurn} onChange={handleSliderChange} />
            <p>Time per turn: {timePerTurn}s</p>
            <p>Starting page: {startingPage}</p>

            <input onChange={handleSearchChange} value={search} />

            <br /><br />

            {searchResults.length !== 0 ? (
                <div className="search-menu">
                    <ul role="listbox" className="search-result-container">
                        {searchResults.map(result =>
                            <li role="option" className="search-result-item" onClick={() => setStartingPage(result.title)} key={result.key}>
                                <div className="search-result-content">
                                    {result.thumbnail !== null ?
                                        <span className="search-result-img" style={{ backgroundImage: 'url(' + result.thumbnail.url + ')' }} />
                                        :
                                        <span className="search-result-img" style={{ backgroundImage: 'url(' + './default.PNG' + ')' }} />
                                    }
                                    <span className="search-result-text">
                                        <span className="search-result-title">{result.title}</span>
                                        {result.description !== null ?
                                            <span className="search-result-description">{result.description}</span>
                                            : null}
                                    </span>
                                </div>
                            </li>
                        )}
                    </ul>
                </div>
            )
                :
                null}

            <br />
            <button onClick={onContinueClick}>CONTINUE</button>
            <button onClick={() => setPageState('home')}>back</button>
        </>
    )
}

export default ChallengeSettings