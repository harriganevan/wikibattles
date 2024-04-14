function endPage({ page }) {

    return (
        <li role="option" className="search-result-item">
            <div className="search-result-content">
                {page.thumbnail !== null && page.thumbnail.url !== null ?
                    <span className="search-result-img" style={{ backgroundImage: 'url(' + page.thumbnail.url + ')' }} />
                    :
                    <span className="search-result-img-placeholder">
                        <span className="search-result-img-default"/>
                    </span>
                }
                <span className="search-result-text">
                    <span className="search-result-title">{decodeURI(page.title)}</span>
                    {page.description !== null ?
                        <span className="search-result-description">{page.description}</span>
                        : null}
                </span>
            </div>
        </li>
    )
}

export default endPage