function BattleHome({ setPageState }) {
    
    return (
        <>
            <button onClick={() => setPageState('searching')}>FIND GAME</button>
            <button onClick={() => setPageState('settings')}>CHALLENGE A FRIEND</button>
        </>
    )
}

export default BattleHome