import { Link } from "react-router-dom"
import socket from "../socket"
import { useEffect } from "react"
import { useState } from "react"
import { Button } from '@mui/material';
import DailyWinBlock from "../components/DailyWinBlock";
import '../wiki.css';

function Daily() {

    // ADD A TIMER

    const [pageTitle, setPageTitle] = useState('');
    const [pageContent, setPageContent] = useState('');
    const [count, setCount] = useState(0);

    const [startPage, setStartPage] = useState('');
    const [endPage, setEndPage] = useState('');

    const [timer, setTimer] = useState(0);
    const [timerStart, setTimerStart] = useState(Date.now());

    const [route, setRoute] = useState([]);

    const [loading, setLoading] = useState(false); //used for placeholders

    const [gameOver, setGameOver] = useState(false);

    const getPage = async (page) => {
        setLoading(true);
        const response = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&prop=text&page=${page}&format=json&disableeditsection=1&redirects=true&useskin=minerva&origin=*`);
        const searchResults = await response.json();
        if (searchResults.parse && searchResults.parse.text) {
            setPageContent(searchResults.parse.text['*']);
            setPageTitle(page);
            setCount(count + 1);
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
        const response = await fetch(`http://localhost:3000/getDailyPages`);
        const json = await response.json();
        if (response.ok) {
            setStartPage(json.startPage);
            setEndPage(json.endPage);

            setPageTitle(json.startPage);

            setRoute([json.startPage]);

            getBackPage(json.startPage); //gets content for first page
        }
    }

    useEffect(() => {
        socket.disconnect();
        getPages();
    }, []);

    //for countup timer
    useEffect(() => {

        if (!gameOver) {

            const interval = setInterval(() => {
                let tempTime = Math.floor((Date.now() - timerStart) / 1000);
                setTimer(tempTime);
            }, 500);

            return () => clearInterval(interval);
        }

    }, [timer]);

    //look into useLayourEffect
    useEffect(() => {
        const links = document.querySelectorAll(".mw-parser-output a");

        //this conditional is used to keep first load state true
        //otherwise loading would be set false before api call for first page finishes
        if (links.length > 0) {

            setLoading(true);

            links.forEach((link) => {
                link.addEventListener('click', (e) => {

                    e.preventDefault();

                    if (e.currentTarget.href.startsWith('http://localhost:5173/daily#')) {
                        const indexOfHash = e.currentTarget.href.indexOf('#');
                        const newHref = e.currentTarget.href.substring(indexOfHash);
                        const element = document.querySelector(newHref);
                        element.scrollIntoView()
                    }

                    if (e.currentTarget.title) {
                        if (e.currentTarget.title == endPage) {
                            setCount(count + 1);
                            setRoute([...route, e.currentTarget.title]);
                            setGameOver(true);
                        } else {
                            getPage(e.currentTarget.title);
                        }
                        window.scrollTo({
                            top: 0,
                            left: 0,
                            behavior: 'instant',
                        });
                    }

                });
            });
            setLoading(false);
        }

    }, [loading]);

    function handleBackClick() {
        if (route.length > 1) {
            const previous = route.pop();
            getBackPage(route[route.length - 1]);
        }
    }

    return (
        <div className="page-daily">
            <h1 className="daily-title">Daily Puzzle</h1>
            <h2>{startPage} &rarr; {endPage}</h2>
            <div className="daily-stats">
                {/* <h2>{count >= 0 && count} clicks</h2> display this at the end for count of pages - just use routes.length */}
                <h2>{timer} seconds</h2>
            </div>

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
                            <div dangerouslySetInnerHTML={{ __html: pageContent }} />
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
                    <p>you win</p>
                    {/* <DailyWinBlock route={route} timer={timer} /> */}
                </>}

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
                            <p>Task: get from one wikipedia page to another.</p>
                            <p>You can travel between pages by clicking <span className="blue">blue links</span>. You can only click links that lead
                                to other wikipedia pages (you cannot click on links that lead to external sites)</p>
                            <p>You can click the 'back' button to go back to your previous page. This does not count as a click,
                                but will not remove a click either.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default Daily