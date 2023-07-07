import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth"
import { read, update, updateLocalUser } from "./apiUser"
import DefaultProfileImage from "../images/user-avatar.png"

class EditUser extends Component {

    constructor() {
        super()
        this.state = {
            id: "",
            name: "",
            email: "",
            password: "",
            redirectToProfile: false,
            error: "",
            saving: false,
            fileSize: 0,
            about: ""
        }
    }

    init = (userId) => {
        const token = isAuthenticated().token
        read(userId, token)
            .then((data) => {
                if (data.error) {
                    this.setState({ redirectToProfile: true })

                } else {
                    this.setState({
                        id: data._id,
                        name: data.name,
                        email: data.email,
                        about: data.about,
                        error: ""
                    })
                }
            });

    }

    componentDidMount() {
        this.userData = new FormData()
        const userId = this.props.match.params.userId
        this.init(userId)
    }

    isValid = () => {
        const { name, email, password, fileSize } = this.state
        if (fileSize > 100000) {
            this.setState({ error: "File size should be less than 100kb" })
            return false
        }

        if (name.length === 0) {
            this.setState({ error: "Name is required" })
            return false
        }

        if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            this.setState({ error: "Email is not valid" })
            return false
        }
        if (password.length >= 1 && password.length <= 5) {
            this.setState({ error: "Password must be at least 6 characters long" })
            return false
        }
        return true
    }

    handleChange = (name) => (event) => {
        const value = name === "photo" ? event.target.files[0] : event.target.value
        const fileSize = name === "photo" ? event.target.files[0].size : 0
        this.userData.set(name, value)
        this.setState({ [name]: value, fileSize: fileSize, error: "" })
    }

    clickSubmit = (event) => {
        event.preventDefault();
        if (this.isValid()) {

            this.setState({ saving: true });

            const userId = this.props.match.params.userId
            const token = isAuthenticated().token

            update(userId, token, this.userData)
                .then(data => {
                    if (data.error) {
                        this.setState({ error: data.error })
                    } else if (isAuthenticated().user.role === "admin") {
                        this.setState({
                            redirectToProfile: true
                        });
                    } else {
                        updateLocalUser(data, () => {
                            this.setState({
                                redirectToProfile: true
                            })
                        })
                    }
                })
        }
    }

    editForm = (name, email, about, password) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Profile Photo</label>
                <input onChange={this.handleChange("photo")} type="file" accept="image/*" className="form-control" />
            </div>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={this.handleChange("name")} type="text" className="form-control" value={name} />
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={this.handleChange("email")} type="email" className="form-control" value={email} />
            </div>
            <div className="form-group">
                <label className="text-muted">About</label>
                <textarea onChange={this.handleChange("about")} type="about" className="form-control" value={about} />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input onChange={this.handleChange("password")} type="password" className="form-control" value={password} />
            </div>
            <button onClick={this.clickSubmit} type="submit" className="mt-2 btn btn-primary">Update</button>
        </form>
    )

    render() {

        const {
            id,
            name,
            email,
            about,
            password,
            redirectToProfile,
            error,
            saving
        } = this.state

        if (redirectToProfile) {
            return <Redirect to={`/user/${id}`} />
        }

        const photoUrl = id ? `${process.env.REACT_APP_API_URL}/user/photo/${id}?${new Date().getTime()}` : DefaultProfileImage

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Edit Profile</h2>

                <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                    {error}
                </div>

                {saving ? (<div className="alert alert-warning">Saving...</div>) : ("")}

                <img
                    src={photoUrl}
                    alt={name}
                    className="img-thumbnail"
                    style={{ height: "200px", width: "auto" }}
                    onError={i => (i.target.src = `${DefaultProfileImage}`)}
                />

                {this.editForm(name, email, about, password)}
            </div>
        );
    }
}

export default EditUser;