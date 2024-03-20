function BattleHome({ setPageState }) {
    
    return (
        <>
            <button onClick={() => setPageState('searching')} className="battle-button">FIND GAME</button>
            <button onClick={() => setPageState('settings')} className="battle-button">CHALLENGE A FRIEND</button>
        </>
    )
}

export default BattleHome