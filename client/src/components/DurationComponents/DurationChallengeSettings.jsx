import { useEffect, useState } from "react"
import DurationSearchResultSettings from "./DurationSearchResultSettings";
import settingsGear from '../../assets/settings-gears.svg';

function DurationChallengeSettings({ setPageState, setSettings }) {

    const [search, setSearch] = useState('');
    const [timerId, setTimerId] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [timePerTurn, setTimePerTurn] = useState(20);
    const [startingPage, setStartingPage] = useState('');

    const getRandomPage = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/getRandomPage`);
        const json = await response.json();
        if (response.ok) {
            setStartingPage(json.page);
        }
    }

    useEffect(() => {
        getRandomPage();
    }, []);

    const delayedFunction = async (value) => {
        if (value) {
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
        setSettings({ timePerTurn: timePerTurn, startingPage: startingPage });
        setPageState('duration-searchingWithLink');
    }

    return (
        <>
            <h2 className="settings-title">BATTLE SETTINGS <img src={settingsGear} className="battle-settings-svg" /></h2>

            <div className="time-per-turn">
                <p className="time-per-turn-text">Time per turn: <span className="time-per-turn-number">{timePerTurn}</span> seconds</p>
                <input type="range" min="5" max="90" value={timePerTurn} onChange={handleSliderChange} />
            </div>

            <p className="starting-page-title">Starting page: <span className="blue">{startingPage}</span></p>

            <input onChange={handleSearchChange} value={search} placeholder="search for page" />

            <div className="search-menu flex-fill">
                {searchResults.length !== 0 ? (
                    <ul role="listbox" className="search-result-container">
                        {searchResults.map(result =>
                            <DurationSearchResultSettings setStartingPage={setStartingPage} result={result} key={result.key} />
                        )}
                    </ul>
                )
                    :
                    null}
                <div className="button-group">
                    <button onClick={() => setPageState('home')} type="button" className="btn btn-dark battle-button">&larr; BACK</button>
                    <button onClick={onContinueClick} type="button" className="btn btn-dark battle-button">CONTINUE &rarr;</button>
                </div>
            </div>
        </>
    )
}

export default DurationChallengeSettings