import { Link } from "react-router-dom"
import socket from "../socket"
import { useEffect } from "react"
import { useState } from "react"
import '../wiki.css';
// import '../testwiki.css';

function Daily() {

    const [pageTitle, setPageTitle] = useState('United Kingdom');
    const [pageContent, setPageContent] = useState('');
    const [count, setCount] = useState(0);

    const [route, setRoute] = useState([]);

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

                if(e.target.href && !e.target.href.startsWith('#')){
                    e.preventDefault();
                }
                
                if (e.target.title) {
                    console.log(e.target.title);
                    setPageTitle(e.target.title);
                    setCount(count + 1);
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
            <h1>{count} clicks</h1>
            <div className="wiki-wrapper">
                <div className="pre-content heading-holder">
                    <div className="page-heading"><h1>{pageTitle}</h1></div>
                </div>
                <div className="content">
                    <div dangerouslySetInnerHTML={{ __html: pageContent }} />
                </div>
            </div>
        </div>
    )
}

export default Daily