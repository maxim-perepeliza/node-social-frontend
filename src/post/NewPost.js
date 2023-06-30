import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth"
import { create } from "./apiPost"

class NewPost extends Component {

    constructor() {
        super()
        this.state = {
            title: "",
            body: "",
            photo: "",
            error: "",
            user: {},
            fileSize: 0,
            saving: false,
            redirectToProfile: false
        }
    }

    componentDidMount() {
        this.postData = new FormData()
        this.setState({ user: isAuthenticated().user })
    }

    isValid = () => {
        const { title, body, fileSize } = this.state
        if (fileSize > 100000) {
            this.setState({ error: "File size should be less than 100kb" })
            return false
        }

        if (title.length === 0) {
            this.setState({ error: "Title is required" })
            return false
        }

        if (body.length === 0) {
            this.setState({ error: "Body is required" })
            return false
        }

        return true
    }

    handleChange = (name) => (event) => {
        const value = name === "photo" ? event.target.files[0] : event.target.value
        const fileSize = name === "photo" ? event.target.files[0].size : 0
        this.postData.set(name, value)
        this.setState({ [name]: value, fileSize: fileSize, error: "" })
    }

    clickSubmit = (event) => {
        event.preventDefault();
        if (this.isValid()) {

            this.setState({ saving: true });

            const userId = isAuthenticated().user._id
            const token = isAuthenticated().token

            create(userId, token, this.postData)
                .then(data => {
                    if (data.error) {
                        this.setState({ error: data.error })
                    } else {
                        this.setState({
                            error: "",
                            saving: false,
                            title: "",
                            body: "",
                            photo: "",
                            redirectToProfile: true
                        })
                    }
                })
        }
    }

    newPostForm = (title, body) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Profile Photo</label>
                <input onChange={this.handleChange("photo")} type="file" accept="image/*" className="form-control" />
            </div>
            <div className="form-group">
                <label className="text-muted">Title</label>
                <input onChange={this.handleChange("title")} type="text" className="form-control" value={title} />
            </div>
            <div className="form-group">
                <label className="text-muted">Body</label>
                <textarea onChange={this.handleChange("body")} className="form-control" value={body} />
            </div>

            <button onClick={this.clickSubmit} type="submit" className="mt-2 btn btn-primary">Create Post</button>
        </form>
    )

    render() {

        const {
            title,
            body,
            error,
            user,
            saving,
            redirectToProfile
        } = this.state

        if (redirectToProfile) {
            return <Redirect to={`/user/${user._id}`} />
        }

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Create a new post</h2>

                <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                    {error}
                </div>

                {saving ? (<div className="alert alert-warning">Saving...</div>) : ("")}

                {this.newPostForm(title, body)}
            </div>
        );
    }
}

export default NewPost;