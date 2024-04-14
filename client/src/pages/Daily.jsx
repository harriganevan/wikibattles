import { Link } from "react-router-dom"
import socket from "../socket"
import { useEffect } from "react"
import { useState } from "react"
import { useRef } from "react"
import { Button } from '@mui/material';
import DailyWinBlock from "../components/DailyWinBlock";
import '../wiki.css';

function Daily() {

    const [pageTitle, setPageTitle] = useState('');
    const [pageContent, setPageContent] = useState('');

    const [startPage, setStartPage] = useState('');
    const [endPage, setEndPage] = useState('');

    const [timer, setTimer] = useState(0);
    const [timerId, setTimerId] = useState(null);

    const [route, setRoute] = useState([]);

    const [loading, setLoading] = useState(false); //used for placeholders

    const [gameOver, setGameOver] = useState(false);

    const modal = useRef(null);

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

    const getPages = async () => {
        const response = await fetch(`https://wikibattles-api.onrender.com/getDailyPages`);
        const json = await response.json();
        if (response.ok) {
            setStartPage(json.startPage);
            setEndPage(json.endPage);

            setPageTitle(json.startPage);

            setRoute([json.startPage]);

            getBackPage(json.startPage); //gets content for first page
        }
    }

    function startTimer(startTime) {
        if (!timerId) {
            setTimerId(
                setInterval(() => {
                    let tempTime = Math.floor((Date.now() - startTime) / 1000);
                    setTimer(tempTime);
                }, 200)
            );
        }
    }

    useEffect(() => {
        socket.disconnect();
        getPages();
        var myModal = new bootstrap.Modal(modal.current, {});
        myModal.show();
        modal.current.addEventListener('hidden.bs.modal', () => {
            startTimer(Date.now());
        })
    }, []);

    function handleBackClick() {
        if (route.length > 1) {
            route.pop();
            getBackPage(route[route.length - 1]);
        }
    }

    function handlePageClick(e) {
        e.preventDefault();

        if (e.target.parentElement.href && e.target.parentElement.href.startsWith('http://localhost:5173/daily#')) {
            const indexOfHash = e.target.parentElement.href.indexOf('#');
            const newHref = e.target.parentElement.href.substring(indexOfHash);
            const element = document.querySelector(newHref);
            element.scrollIntoView();
        }

        if (e.target.title) {
            if (e.target.title == endPage) {
                setRoute([...route, e.target.title]);
                setGameOver(true);
                clearInterval(timerId);
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
        <div className="page-daily">

            <h1 className="daily-title">Daily Puzzle</h1>
            <h2>{startPage} &rarr; {endPage}</h2>

            {!gameOver &&
                <>
                    <div className="daily-stats">
                        <h2>{timer} seconds</h2>
                    </div>
                    <p className="route-text">Route:&nbsp;</p>
                    <div className="route">
                        {route.map((page, i) =>
                            <p key={page + i}>{page} {i != route.length - 1 && <>&rarr;</>}</p>
                        )}
                    </div>
                </>
            }

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
                    <DailyWinBlock route={route} timer={timer} startPage={startPage} endPage={endPage} />
                </>}

            {/* <button type="button" className="btn btn-primary daily-help" data-bs-toggle="modal" data-bs-target="#exampleModal">
                How To Play
            </button> */}

            <div ref={modal} className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">How To Play</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Task: get from one wikipedia page to another.</p>
                            <p>You can travel between pages by clicking <span className="blue">blue links</span>. You can only click links that lead
                                to other wikipedia pages (you cannot click on links that lead to external sites)</p>
                            <p>You can click the 'go back a page' button to go back to your previous page.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary modal-footer-btn" data-bs-dismiss="modal">BEGIN</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Daily