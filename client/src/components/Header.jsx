import { Link } from "react-router-dom";
import { useMediaQuery } from 'react-responsive'

function Header() {

    const isDesktop = useMediaQuery({ query: '(min-width: 768px)' });

    return (
        <>
            <nav className="navbar navbar-expand-md bg-body-tertiary" data-bs-theme="dark">
                <div className="container-fluid">
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <span className="navbar-brand">WikiBattles</span>
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle={!isDesktop ? "collapse" : false} data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto mb-2 mb-md-0">
                            <Link to="/" style={{ textDecoration: "none" }}>
                                <li className="nav-item" data-bs-toggle={!isDesktop ? "collapse" : null} data-bs-target="#navbarNav">
                                    <button className='btn navbar-text nav-link active'>Home</button>
                                </li>
                            </Link>
                            <Link to="/daily" style={{ textDecoration: "none" }}>
                                <li className="nav-item" data-bs-toggle={!isDesktop ? "collapse" : null} data-bs-target="#navbarNav">
                                    <button className='btn navbar-text nav-link active'>Daily</button>
                                </li>
                            </Link>
                            <Link to="/battle" style={{ textDecoration: "none" }}>
                                <li className="nav-item" data-bs-toggle={!isDesktop ? "collapse" : null} data-bs-target="#navbarNav">
                                    <button className='btn navbar-text nav-link active'>Battle</button>
                                </li>
                            </Link>
                        </ul>
                        <span>
                            <button className="header-help" type="button" data-bs-toggle="modal" data-bs-target="#headerModal">
                                ?
                            </button>
                        </span>
                    </div>
                </div>
            </nav>

            <div className="modal fade" id="headerModal" tabIndex="-1" aria-labelledby="headerModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="headerModalLabel">What is This Site?</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>WikiBattles is a site to test your general knowledge.</p>
                            <p>Complete the Daily Puzzle or Battle an opponent.</p>
                            <p>More features will be coming soon including a new Battle mode and user accounts to track your stats!</p>
                            <div className="header-email-info">
                                <p>Questions, comments, bug reports? </p>
                                <p>Email: wikibattlesapp@gmail.com</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default Header