import { Link } from "react-router-dom";

function Header() {

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
                <div className="container-fluid">
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <span className="navbar-brand" >WikiBattles</span>
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link to="/" style={{ textDecoration: "none" }}>
                                    <button className='btn navbar-text nav-link active'>Home</button>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/daily" style={{ textDecoration: "none" }}>
                                    <button className='btn navbar-text nav-link active'>Daily</button>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/battle" style={{ textDecoration: "none" }}>
                                    <button className='btn navbar-text nav-link active'>Battle</button>
                                </Link>
                            </li>
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
                            <h1 className="modal-title fs-5" id="headerModalLabel">WikiBattles</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>WikiBattles is a site.</p>
                            <p>more features coming.</p>
                            <p>questions, comments, bug reports?, email at email@email.com</p>
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