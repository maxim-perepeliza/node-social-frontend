import React from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";

const isActive = (history, path) => {
    return history.location.pathname === path
}

const Menu = ({ history }) => {
    return <div >
        <nav className="navbar navbar-expand-lg sticky-top navbar-light" style={{ backgroundColor: "#e3f2fd" }}>
            <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                    <Link className={"nav-link " + (isActive(history, "/") ? "active" : "")} to="/">Home</Link>
                </li>

                <li className="nav-item">
                    <Link className={"nav-link " + (isActive(history, "/activity") ? "active" : "")} to="/activity">Timeline</Link>
                </li>

                <li className="nav-item">
                    <Link className={"nav-link " + (isActive(history, "/users") ? "active" : "")} to="/users">Users</Link>
                </li>

                <li className="nav-item">
                    <Link className={"nav-link " + (isActive(history, `post/create`) ? "active" : "")} to={`/post/create`}>
                        Create Post
                    </Link>
                </li>

                {!isAuthenticated() ? (
                    <>
                        <li className="nav-item">
                            <Link className={"nav-link " + (isActive(history, "/signin") ? "active" : "")} to="/signin">Signin</Link>
                        </li>

                        <li className="nav-item">
                            <Link className={"nav-link " + (isActive(history, "/signup") ? "active" : "")} to="/signup">Signup</Link>
                        </li>
                    </>
                ) : ("")}

                {isAuthenticated() ? (
                    <>
                        <li className="nav-item">
                            <Link className={"nav-link " + (isActive(history, `findpeople`) ? "active" : "")} to={`/findpeople`}>
                                Find People
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className={"nav-link " + (isActive(history, `/user/${isAuthenticated().user._id}`) ? "active" : "")} to={`/user/${isAuthenticated().user._id}`}>
                                {`${isAuthenticated().user.name}'s profile`}
                            </Link>
                        </li>

                        <li className="nav-item">
                            <span style={{ cursor: "pointer", color: "#000" }} className="nav-link" onClick={() => signout(() => history.push("/"))}>
                                Sign Out
                            </span>
                        </li>
                    </>
                ) : ("")}

                {isAuthenticated() && isAuthenticated().user.role === "admin" && (
                    <li className="nav-item">
                        <Link
                            to={`/admin`}
                            className={"nav-link " + (isActive(history, `/admin`) ? "active" : "")}
                        >
                            Admin
                        </Link>
                    </li>
                )}

            </ul>
        </nav>
    </div >
}

export default withRouter(Menu);
