const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const getPage = async (title) => {
    const firstFive = [];
    const wikiPage = await fetch('https://en.wikipedia.org' + title);
    const body = await wikiPage.text()
    const dom = new JSDOM(body);
    const tags = dom.window.document.getElementById('bodyContent').getElementsByTagName('a');

    let i = 0
    while(firstFive.length < 10){ //or there are no tags left
        if(!tags[i].innerHTML[0].includes('<')){
            firstFive.push([tags[i].href, tags[i].innerHTML])
        }
        i++;
    }
    return firstFive;
}

exports.getPage = getPage;