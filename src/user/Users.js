import React, { Component } from "react";
import { list } from "./apiUser"
import DefaultProfileImage from "../images/user-avatar.png"
import { Link } from "react-router-dom";

class Users extends Component {
    constructor() {
        super()
        this.state = {
            users: []
        }
    }

    componentDidMount() {
        list().then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                this.setState({ users: data })
            }
        })
    }

    renderUsers = users => {
        return <div className="row">
            {users.map((user, i) => {
                return <div className="col-md-4" key={i}>
                    <div className="card mb-3">
                        <img
                            className="card-img-top"
                            src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
                            alt={user.name}
                            style={{ width: "100%", height: "15vw", objectFit: "cover" }}
                            onError={i => (i.target.src = `${DefaultProfileImage}`)}
                        />
                        <div className="card-body">
                            <h5 className="card-title">{user.name}</h5>
                            <p className="card-text">{user.email}</p>

                            <Link className="btn btn-primary btn-small" to={`/user/${user._id}`}>
                                View Profile
                            </Link>
                        </div>
                    </div>
                </div>
            })
            }
        </div >
    }

    render() {

        const { users } = this.state

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Users</h2>

                {this.renderUsers(users)}
            </div>
        );
    }
}

export default Users;