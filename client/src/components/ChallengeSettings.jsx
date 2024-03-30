import { useState } from "react"
import SearchResultSettings from "./SearchResultSettings";
import defaultPhoto from '../assets/default.svg'

function ChallengeSettings({ setPageState, setSettings }) {

    const [search, setSearch] = useState('');
    const [timerId, setTimerId] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [timePerTurn, setTimePerTurn] = useState(20);
    const [startingPage, setStartingPage] = useState('77th British Academy Film Awards');

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
        setSettings({ timePerTurn: timePerTurn, startingPage: startingPage });
        setPageState('searchingWithLink');
    }

    return (
        <div className="settings-container">
            <h2>BATTLE SETTINGS</h2>

            <div className="time-per-turn">
                <p className="time-per-turn-text">Time per turn: {timePerTurn} seconds</p>
                <input type="range" min="5" max="90" value={timePerTurn} onChange={handleSliderChange} />
            </div>

            <p>Starting page: {startingPage}</p>

            <input onChange={handleSearchChange} value={search} placeholder="search for page" />

            {searchResults.length !== 0 ? (
                <div className="search-menu">
                    <ul role="listbox" className="search-result-container">
                        {searchResults.map(result =>
                            <SearchResultSettings setStartingPage={setStartingPage} result={result}  key={result.key}/>
                        )}
                    </ul>
                </div>
            )
                :
                null}
            <div className="button-group">
                <button onClick={() => setPageState('home')} type="button" className="btn btn-dark battle-button">BACK</button>
                <button onClick={onContinueClick} type="button" className="btn btn-dark battle-button">CONTINUE</button>
            </div>

            <button type="button" className="btn btn-primary daily-help" data-bs-toggle="modal" data-bs-target="#exampleModal">
                ?
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Battle Settings</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>change settings.</p>
                            <p>set time per turn</p>
                            <p>set starting page</p>
            
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChallengeSettings