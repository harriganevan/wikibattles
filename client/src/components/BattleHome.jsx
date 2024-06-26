import checkeredFlag from '../assets/checkered-flag.svg';
import timer from '../assets/timer.svg';

function BattleHome({ setPageState }) {

    return (
        <>
            <h1 className='home-title'>Battle</h1>

            <div className="battle-home-buttons-container">
                <div className="battle-home-buttons">
                    <h4>Race <img src={checkeredFlag} className="checkered-flag-svg" /></h4>
                    <button onClick={() => setPageState('race-searching')} type="button" className="btn btn-dark home-button">FIND GAME</button>
                    <button onClick={() => setPageState('race-settings')} type="button" className="btn btn-dark home-button">CHALLENGE A FRIEND</button>
                    <button type="button" className="btn btn-primary game-mode-btn" data-bs-toggle="modal" data-bs-target="#RaceModal">
                        How To Play
                    </button>
                </div>
                <div className="battle-home-buttons">
                    <h4>Duration <img src={timer} className="timer-svg" /></h4>
                    <button onClick={() => setPageState('duration-searching')} type="button" className="btn btn-dark home-button">FIND GAME</button>
                    <button onClick={() => setPageState('duration-settings')} type="button" className="btn btn-dark home-button">CHALLENGE A FRIEND</button>
                    <button type="button" className="btn btn-primary game-mode-btn" data-bs-toggle="modal" data-bs-target="#DurationModal">
                        How To Play
                    </button>
                </div>
            </div>

            <div className="modal fade" id="DurationModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">How To Play</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Given a starting page, take turns attempting to name a <span className="blue">link</span> in a Wikipedia page.
                                A link is any Wikipedia page that can be travelled to from the current page. A link cannot be used twice.
                                If you click a page that is not a link, nothing will happen. If a link is found, that will become the new current page.</p>
                            <p>The game ends when one player cannot find a link within the time limit.</p>
                            <p>Find a random opponent by clicing "FIND GAME" or challenge a friend by clicking "CHALLENGE A FRIEND"</p>
                            <p>Playing against a random opponent will give you a random starting page and 20 seconds per turn.
                                If you challenge a friend you can customize the starting page and time per turn.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="RaceModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">How To Play</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Given a starting page, click through pages trying to get to the ending page.</p>
                            <p>The game ends when one player gets to the ending page.</p>
                            <p>Find a random opponent by clicing "FIND GAME" or challenge a friend by clicking "CHALLENGE A FRIEND"</p>
                            <p>Playing against a random opponent will give you a random starting and ending page.
                                If you challenge a friend you can customize the starting and ending pages.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BattleHome