import { useState, useRef } from 'react';
import { useEffect } from 'react';
import socket from '../../socket';
import RaceEndPage from './RaceEndPage';

function RaceBoard({ gameState, username }) {

    const startPage = gameState.startingPage;
    const endPage = gameState.endingPage;

    const [gameOver, setGameOver] = useState(false);

    const [pageTitle, setPageTitle] = useState(gameState.startingPage);
    const [pageContent, setPageContent] = useState('');

    const [route, setRoute] = useState([gameState.startingPage]);
    const routeRef = useRef([gameState.startingPage]);

    const [loading, setLoading] = useState(false);

    const [time, setTime] = useState("00:00");

    const [winner, setWinner] = useState(null);

    const [opponentsRoute, setOpponentsRoute] = useState(null);
    const [opponentsRouteView, setOpponentsRouteView] = useState(false);

    const getPage = async (page) => {
        setLoading(true);
        const response = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&prop=text&page=${page}&format=json&disableeditsection=1&redirects=true&useskin=minerva&origin=*`);
        const searchResults = await response.json();
        if (searchResults.parse && searchResults.parse.text) {
            setPageContent(searchResults.parse.text['*']);
            setPageTitle(page);
            setRoute([...route, page]);
            routeRef.current.push(page);
        }
        setLoading(false);
    }

    const getBackPage = async (page) => {
        setLoading(true);
        const response = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&prop=text&page=${page}&format=json&disableeditsection=1&redirects=true&useskin=minerva&origin=*`);
        const searchResults = await response.json();
        if (searchResults.parse && searchResults.parse.text) {
            setPageContent(searchResults.parse.text['*']);
            setPageTitle(page);
        }
        setLoading(false);
    }

    useEffect(() => {

        getBackPage(startPage);

        let timerIdCreate;
        const startTime = Date.now();
        timerIdCreate = setInterval(() => {
            let currentTime = Math.floor((Date.now() - startTime));
            setTime(Math.floor((currentTime / 1000 / 60) % 60).toString().padStart(2, "0") + ":" + Math.floor((currentTime / 1000) % 60).toString().padStart(2, "0"));
        }, 200);

        function onGameOver(data) {
            setGameOver(true);
            setWinner(data.winner);
            clearInterval(timerIdCreate);
            console.log('game over');
            socket.emit('send-route', { gameId: gameState.gameId, route: routeRef.current });
        }

        function onPlayerLeft() {
            console.log('player left');
        }

        function onReceiveRoute(data) {
            setOpponentsRoute(data.route);
        }

        socket.on('game-over', onGameOver);
        socket.on('player-left', onPlayerLeft);
        socket.on('receive-route', onReceiveRoute);

        return () => {
            socket.off('game-over', onGameOver);
            socket.off('player-left', onPlayerLeft);
            socket.off('receive-route', onReceiveRoute);
            clearInterval(timerIdCreate);
        };

    }, []);

    function handleBackClick() {
        if (route.length > 1) {
            route.pop();
            getBackPage(route[route.length - 1]);
        }
    }

    function handlePageClick(e) {
        e.preventDefault();
        if (e.target.parentElement.href && e.target.parentElement.href.includes('#')) {
            const indexOfHash = e.target.parentElement.href.indexOf('#');
            const newHref = e.target.parentElement.href.substring(indexOfHash);
            const element = document.querySelector(newHref);
            element.scrollIntoView();
        }

        if (e.target.title) {
            if (e.target.title == endPage) {
                socket.emit('page-found', { gameId: gameState.gameId, username: username });
                setRoute([...route, e.target.title]); //whats the point
                routeRef.current.push(e.target.title);
            } else {
                getPage(e.target.title);
            }
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'instant',
            });
        }
    }

    function handleRouteToggle() {
        setOpponentsRouteView(!opponentsRouteView);
    }

    return (
        <>
            <div className='race-board-header'>
                <p className={'player-name-left' + (username == winner ? ' winner' : '')}>{username} (you)</p>
                <h2>{time}</h2>
                <p className={'player-name-right' + ((gameState.users[0] == username ? gameState.users[1] : gameState.users[0]) == winner ? ' winner' : '')}>{gameState.users[0] == username ? gameState.users[1] : gameState.users[0]}</p>
            </div>

            <h2>{startPage} &rarr; {endPage}</h2>

            {!gameOver ?
                <div className='race-route-wrapper'>
                    <p className="route-text">Route:&nbsp;</p>
                    <div className="race-route">
                        {route.map((page, i) =>
                            <p key={page + i}>{page} {i != route.length - 1 && <>&rarr;</>}</p>
                        )}
                    </div>
                </div>
                : null}

            {!gameOver ? <button onClick={handleBackClick} type="button" className="btn btn-dark">&larr; go back a page</button> : null}

            {!gameOver ?
                !loading ?
                    <div className="wiki-wrapper">
                        <div className="pre-content heading-holder">
                            <div className="page-heading"><h1>{pageContent != '' && pageTitle}</h1></div>
                        </div>
                        <div className="content">
                            <div dangerouslySetInnerHTML={{ __html: pageContent }} onClick={handlePageClick} />
                        </div>
                    </div>
                    :
                    <>
                        <div className="spinner-border text-info" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </>
                :
                <>
                    <div className='race-over'>
                        <h2>GAME OVER</h2>
                    </div>

                    {winner == username ?
                        <p className='race-win-stats'>You win! You got from {startPage} to {endPage} in <span className="daily-stat">{time}</span>, travelling through <span className="daily-stat">{route.length - 1}</span> pages.</p>
                        :
                        <p>You lost. Your oppenent got from {startPage} to {endPage} faster than you could.</p>
                    }

                    <div className="form-check form-switch toggle-container">
                        <p className="opponent-route-toggle">Your route</p>
                        <label className="switch">
                            <input defaultChecked={false} type="checkbox" onChange={handleRouteToggle} />
                            <span className="slider round"></span>
                        </label>
                        <p className="your-route-toggle">Opponent route</p>
                    </div>

                    <div className="race-end-route flex-fill">
                        {!opponentsRouteView ?
                            (route.map((page, i) =>
                                <div key={page + i}>
                                    <p >{page}</p>
                                    {i != route.length - 1 && <>&darr;</>}
                                </div >
                            )) :
                            (opponentsRoute !== null ? (opponentsRoute.map((page, i) =>
                                <div key={page + i}>
                                    <p >{page}</p>
                                    {i != opponentsRoute.length - 1 && <>&darr;</>}
                                </div >
                            )) : <p>opponent left before game over</p>)
                        }
                    </div>
                </>}
        </>
    )
}

export default RaceBoard