import { useState } from 'react';
import { useEffect } from 'react';
import socket from '../../socket';
import SearchResultBoard from '../SearchResultBoard';
import RaceEndPage from './RaceEndPage';

function RaceBoard({ gameState, username }) {

    const startPage = gameState.startingPage;
    const endPage = gameState.endingPage;

    const [gameOver, setGameOver] = useState(false);

    const [pageTitle, setPageTitle] = useState(gameState.startingPage);
    const [pageContent, setPageContent] = useState('');

    const [route, setRoute] = useState([gameState.startingPage]);

    const [loading, setLoading] = useState(false); //used for placeholders

    const [timer, setTimer] = useState(0);
    const [timerId, setTimerId] = useState(null);

    const startTime = Date.now();

    const getPage = async (page) => {
        setLoading(true);
        const response = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&prop=text&page=${page}&format=json&disableeditsection=1&redirects=true&useskin=minerva&origin=*`);
        const searchResults = await response.json();
        if (searchResults.parse && searchResults.parse.text) {
            setPageContent(searchResults.parse.text['*']);
            setPageTitle(page);
            setRoute([...route, page]);
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
            setTimer(Math.floor((Date.now() - startTime) / 1000));
        }, 200);
        setTimerId(timerIdCreate);

        function onGameOver(data) {
            setGameOver(true);
            clearInterval(timerIdCreate);
            console.log('game over');
        }

        function onPlayerLeft() {
            console.log('player left');
        }

        socket.on('game-over', onGameOver);
        socket.on('player-left', onPlayerLeft);

        return () => {
            socket.off('game-over', onGameOver);
            socket.off('player-left', onPlayerLeft);
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

        if (e.target.parentElement.href && e.target.parentElement.href.startsWith(`${import.meta.env.VITE_ORIGIN}/battle#`)) {
            const indexOfHash = e.target.parentElement.href.indexOf('#');
            const newHref = e.target.parentElement.href.substring(indexOfHash);
            const element = document.querySelector(newHref);
            element.scrollIntoView();
        }

        if (e.target.title) {
            if (e.target.title == endPage) {
                socket.emit('page-found', { gameId: gameState.gameId, username: username });
                setRoute([...route, e.target.title]);
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

    return (
        <>
            <div className='race-board-header'>
                <p className='player-name-left bold'>{username} (you)</p>
                <h2>{timer}</h2>
                <p className='player-name-right'>{gameState.users[0] == username ? gameState.users[1] : gameState.users[0]}</p>
            </div>

            <h2>{startPage} &rarr; {endPage}</h2>

            <p className="route-text">Route:&nbsp;</p>
            <div className="route">
                {route.map((page, i) =>
                    <p key={page + i}>{page} {i != route.length - 1 && <>&rarr;</>}</p>
                )}
            </div>

            {!gameOver ? <button onClick={handleBackClick} type="button" className="btn btn-dark daily-back-btn">&larr; go back a page</button> : null}

            {!gameOver ? (
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
            )
                :
                <>
                    <p>done</p>
                </>}
        </>
    )
}

export default RaceBoard