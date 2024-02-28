function BattleHome({ setPageState }) {
    return (
        <>
            <button>FIND GAME</button>
            <button onClick={() => setPageState('settings')}>CHALLENGE A FRIEND</button>
        </>
    )
}

export default BattleHome