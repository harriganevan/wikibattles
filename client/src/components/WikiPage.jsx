import { useEffect } from 'react';

function WikiPage({ page }) {

    const getDiv = async () => {
        const response = await fetch(`https://en.wikipedia.org/wiki/${page}`);
        const searchResults = await response.json();
        console.log(searchResults)
    }

    useEffect(() => {

        getDiv();

    })

    return (
        <>
            <iframe src={`https://en.wikipedia.org/wiki/${page}`} id="myIframe" title="triple" style={{ width: '100%', height: '500px' }}></iframe>
        </>
    )
}

export default WikiPage;