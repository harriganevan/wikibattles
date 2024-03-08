import { useState } from "react"

function ChallengeSettings({ setPageState, setSettings }) {

    const [timePerTurn, setTimePerTurn] = useState(23);
    const [startingPage, setStartingPage] = useState('77th British Academy Film Awards');

    function onContinueClick() {
        setSettings({ time: timePerTurn, startingPage: startingPage });
        setPageState('searching');
    }

    return (
        <>
            <p>challenge settings</p>
            <p>Time per turn</p>
            <p>Starting page</p>
            <button onClick={onContinueClick}>CONTINUE</button>
            <button onClick={() => setPageState('home')}>back</button>
        </>
    )
}

export default ChallengeSettings