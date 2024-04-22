function SearchResultBoard({makeGuess, result}) {

    return (
        <li role="option" className="search-result-item" onClick={() => makeGuess(result)}>
            <div className="search-result-content">
                {result.thumbnail !== null ?
                    <span className="search-result-img" style={{ backgroundImage: 'url(' + result.thumbnail.url + ')' }} />
                    :
                    <span className="search-result-img-placeholder">
                        <span className="search-result-img-default"/>
                    </span>
                }
                <span className="search-result-text">
                    <span className="search-result-title">{result.title}</span>
                    {result.description !== null ?
                        <span className="search-result-description">{result.description}</span>
                        : null}
                </span>
            </div>
        </li>
    )
}

export default SearchResultBoard