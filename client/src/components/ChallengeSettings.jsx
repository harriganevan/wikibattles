function ChallengeSettings({ setPageState }) {
    return (
        <>
            <p>challenge settings</p>
            <p>Time per turn</p>
            <p>Starting page</p>
            <button onClick={() => setPageState('searching')}>CONTINUE</button>
            <button onClick={() => setPageState('home')}>back</button>
        </>
    )
}

export default ChallengeSettings