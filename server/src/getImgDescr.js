const getImgDescr = async (title) => {

    const imgdescr = {};

    try {
        const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageprops|pageimages&titles=${title}&pithumbsize=60&format=json`);
        if (!response.ok) {
            throw new Error("Network response was not OK");
        }
        const result = await response.json();
        const pageId = Object.keys(result.query.pages)[0];
 
        let thumbnailResult;
        if(result.query.pages[pageId].thumbnail){
            thumbnailResult = result.query.pages[pageId].thumbnail.source;
        } else {
            thumbnailResult = null;
        }
        let descriptionResult = result.query.pages[pageId].pageprops['wikibase-shortdesc'];

        imgdescr['thumbnail'] = thumbnailResult;
        imgdescr['description'] = descriptionResult;
    } catch (error) {
        console.error(error);
    }

    return imgdescr;
}

exports.getImgDescr = getImgDescr;