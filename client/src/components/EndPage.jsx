import defaultPhoto from '../assets/default.svg'

function endPage({ page }) {

    return (
        <li role="option" className="search-result-item">
            <div className="search-result-content">
                {page.thumbnail !== null ?
                    <span className="search-result-img" style={{ backgroundImage: 'url(' + page.thumbnail + ')' }} />
                    :
                    <span className="search-result-img-placeholder">
                        <span className="search-result-img-default" style={{ backgroundImage: 'url(' + defaultPhoto + ')' }} />
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