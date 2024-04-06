const getLinksFromPage = async (title) => {
    const links = [];
    const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=links&titles=${title}&pllimit=500&format=json`);
    const wikiLinks = await response.json();
    const pageId = Object.keys(wikiLinks.query.pages)[0];

    wikiLinks.query.pages[pageId].links.forEach((title) => {
        if (title.ns === 0) {
            links.push(encodeURI(title.title));
        }
    });

    //i dont like this code
    let continuedLinks = wikiLinks;

    while (continuedLinks.continue) {
        const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=links&titles=${title}&pllimit=500&format=json&plcontinue=${continuedLinks.continue.plcontinue}`);
        const wikiLinks = await response.json();
        wikiLinks.query.pages[pageId].links.forEach((title) => {
            if (title.ns === 0) {
                links.push(encodeURI(title.title));
            }
        });
        continuedLinks = wikiLinks;
    }

    return links;
}

exports.getLinksFromPage = getLinksFromPage;