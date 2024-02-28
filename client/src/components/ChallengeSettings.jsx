function ChallengeSettings({ setPageState }) {
    return (
        <>
            <p>challenge settings</p>
            <button onClick={() => setPageState('searching')}>CONTINUE</button>
            <button onClick={() => setPageState('home')}>back</button>
        </>
    )
}

export default ChallengeSettings;