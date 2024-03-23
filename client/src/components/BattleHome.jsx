function BattleHome({ setPageState }) {
    
    return (
        <>
            <button onClick={() => setPageState('searching')} className="battle-button">FIND GAME</button>
            <button onClick={() => setPageState('settings')} className="battle-button">CHALLENGE A FRIEND</button>


            {/* help stuff */}
            <button type="button" className="btn btn-primary daily-help" data-bs-toggle="modal" data-bs-target="#exampleModal">
                How To Play
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">How To Play</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Battle an opponent
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