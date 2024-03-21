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
    const [route, setRoute] = useState([]);

    const [gameOver, setGameOver] = useState(false);

    const getPage = async (page) => {
        const response = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&prop=text&page=${page}&format=json&disableeditsection=1&redirects=true&useskin=minerva&origin=*`);
        const searchResults = await response.json();
        if (searchResults.parse && searchResults.parse.text) {
            setPageContent(searchResults.parse.text['*']);
        }

    }

    useEffect(() => {
        socket.disconnect();
    }, []);

    useEffect(() => {
        getPage(pageTitle);
    }, [pageTitle]);

    useEffect(() => {
        const links = document.querySelectorAll(".mw-parser-output a");

        links.forEach((link) => {
            link.addEventListener('click', (e) => {

                if (e.target.href && !e.target.href.startsWith('#')) {
                    e.preventDefault();
                }

                if (e.target.title) {
                    setCount(count + 1);
                    setRoute([...route, e.target.title]);
                    if (e.target.title == endPage) {
                        setGameOver(true);
                    } else {
                        setPageTitle(e.target.title);

                    }
                }

            });
        });

    }, [pageContent]);

    return (
        <div className="page">
            <Link to="/">
                <h1>WikiBattles</h1>
            </Link>
            <h1>Daily puzzle</h1>
            <h2>{startPage} -&gt; {endPage}</h2>
            <h2>{count} clicks</h2>
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
                <p>you win</p>
                {route.map((route) => 
                    <p>{route}</p>
                )}
            </>}

        </div>
    )
}

export default Daily