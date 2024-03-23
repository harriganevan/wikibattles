import { Link } from "react-router-dom"
import socket from "../socket"
import { useEffect } from "react"
import { useState } from "react"
import '../wiki.css';

function Daily() {


    const [pageTitle, setPageTitle] = useState('United Kingdom');
    const [pageContent, setPageContent] = useState('');
    const [count, setCount] = useState(0);

    const [startPage, setStartPage] = useState('United Kingdom');
    const [endPage, setEndPage] = useState('Paris');
    const [route, setRoute] = useState(['United Kingdom']);

    const [gameOver, setGameOver] = useState(false);

    const getPage = async (page) => {
        const response = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&prop=text&page=${page}&format=json&disableeditsection=1&redirects=true&useskin=minerva&origin=*`);
        const searchResults = await response.json();
        if (searchResults.parse && searchResults.parse.text) {
            setPageContent(searchResults.parse.text['*']);
            setPageTitle(page);
            setCount(count + 1);
            setRoute([...route, page]);
        }
    }

    const getBackPage = async (page) => {
        const response = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&prop=text&page=${page}&format=json&disableeditsection=1&redirects=true&useskin=minerva&origin=*`);
        const searchResults = await response.json();
        if (searchResults.parse && searchResults.parse.text) {
            setPageContent(searchResults.parse.text['*']);
            setPageTitle(page);
        }
    }

    useEffect(() => {
        socket.disconnect();
        getBackPage(pageTitle); //also gets first page
    }, []);

    useEffect(() => {
        const links = document.querySelectorAll(".mw-parser-output a");

        links.forEach((link) => {
            link.addEventListener('click', (e) => {

                e.preventDefault();

                if (e.currentTarget.href.startsWith('http://localhost:5173/daily#')) {
                    const indexOfHash = e.currentTarget.href.indexOf('#');
                    const newHref = e.currentTarget.href.substring(indexOfHash);
                    const element = document.querySelector(newHref);
                    element.scrollIntoView()
                }


                if (e.target.title) {
                    console.log(e.target.title);
                    if (e.target.title == endPage) {
                        setCount(count + 1);
                        setRoute([...route, e.target.title]);
                        setGameOver(true);
                    } else {
                        getPage(e.target.title);
                    }
                    window.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: 'instant',
                    });
                }

            });
        });

    }, [pageContent]);

    function handleBackClick() {
        if (route.length > 1) {
            const previous = route.pop();
            console.log(previous);
            getBackPage(route[route.length - 1]);
        }
    }

    return (
        <div className="page-daily">
            <h1>Daily Puzzle</h1>
            <h2>{startPage} &rarr; {endPage}</h2>
            <div className="route">
                <p>Route:&nbsp;</p>
                {route.map((page, i) =>
                    <p key={page + i}>{page} {i != route.length - 1 && <>&rarr;</>}</p>
                )}
            </div>
            {!gameOver ? <button onClick={handleBackClick}>go back a page</button> : null}
            <h2>{count >= 0 && count} clicks</h2>
            {!gameOver ?
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
                    <p>you win!</p>
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