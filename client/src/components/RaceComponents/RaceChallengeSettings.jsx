import { useEffect, useState } from "react"
import settingsGear from '../../assets/settings-gears.svg';
import RaceSearchResultSettings from "./RaceSearchResultSettings";

function RaceChallengeSettings({ setPageState, setSettings }) {

    //on input box click clear search results?

    const [searchStart, setSearchStart] = useState('');
    const [searchEnd, setSearchEnd] = useState('');

    const [timerId, setTimerId] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [startingPage, setStartingPage] = useState('');
    const [endingPage, setEndingPage] = useState('');

    const [pageStatus, setPageStatus] = useState(null); //used to check if user is searching page for start or end

    //i need to get two of them
    const getRandomPage = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/getRandomPages`);
        const json = await response.json();
        if (response.ok) {
            setStartingPage(json.startingPage);
            setEndingPage(json.endingPage);
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

    const handleStartSearchChange = (e) => {
        clearTimeout(timerId);
        setSearchStart(e.target.value);
        setTimerId(setTimeout(() => delayedFunction(e.target.value), 500));
    }

    const handleEndSearchChange = (e) => {
        clearTimeout(timerId);
        setSearchEnd(e.target.value);
        setTimerId(setTimeout(() => delayedFunction(e.target.value), 500));
    }

    function onContinueClick() {
        setSettings({ startingPage: startingPage, endingPage: endingPage });
        setPageState('race-searchingWithLink');
    }

    function onSearchResultClick(title) {
        if (pageStatus == 'start') {
            setStartingPage(title);
        }
        else if (pageStatus == 'end') {
            setEndingPage(title);
        }
    }

    return (
        <>
            <h2 className="settings-title">BATTLE SETTINGS <img src={settingsGear} className="battle-settings-svg" /></h2>

            <div>
                <p className="page-title">Starting page: <span className="blue">{startingPage}</span></p>
                <input onChange={handleStartSearchChange} onFocus={() => setPageStatus('start')} value={searchStart} placeholder="search for page" />
            </div>

            <div>
                <p className="page-title">Ending page: <span className="blue">{endingPage}</span></p>
                <input onChange={handleEndSearchChange} onFocus={() => setPageStatus('end')} value={searchEnd} placeholder="search for page" />
            </div>

            <div className="search-menu flex-fill">
                {searchResults.length !== 0 ? (
                    <ul role="listbox" className="search-result-container">
                        {searchResults.map(result =>
                            <RaceSearchResultSettings onSearchResultClick={onSearchResultClick} result={result} key={result.key} />
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

export default RaceChallengeSettings