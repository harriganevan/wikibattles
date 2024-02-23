//not used rn

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const getPage = async (title) => {
    const links = [];
    const wikiPage = await fetch('https://en.wikipedia.org' + title);
    const body = await wikiPage.text();
    const dom = new JSDOM(body);
    const tags = dom.window.document.getElementById('mw-content-text').getElementsByTagName('a');

    for(let i = 0; i < tags.length; i++){
        if(!tags[i].innerHTML.includes('<') && !tags[i].innerHTML.includes('[') && !tags[i].innerHTML.includes('^') && !tags[i].href.includes('BookSources:') && !tags[i].href.includes('Help:') && !tags[i].href.includes('Wikipedia:') && !tags[i].href.includes('File:') && tags[i].href.startsWith('/wiki')){
            links.push([tags[i].href, tags[i].innerHTML]);
        }
    }

    return links;
}

exports.getPage = getPage;