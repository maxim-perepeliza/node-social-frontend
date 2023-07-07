import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth"
import { singlePost, update } from "./apiPost"
import DefaultPostImage from "../images/placeholder-post.jpg"

class EditPost extends Component {

    constructor() {
        super()
        this.state = {
            id: "",
            authorId: "",
            title: "",
            body: "",
            redirectToPost: false,
            error: "",
            saving: false,
            fileSize: 0
        }
    }

    init = (postId) => {
        singlePost(postId)
            .then((data) => {
                if (data.error) {
                    this.setState({ redirectToPost: true })

                } else {
                    this.setState({
                        id: data._id,
                        authorId: data.postedBy._id,
                        title: data.title,
                        body: data.body,
                        error: ""
                    })
                }
            });

    }

    componentDidMount() {
        this.postData = new FormData()
        const postId = this.props.match.params.postId
        this.init(postId)
    }

    isValid = () => {
        const { title, body, fileSize } = this.state
        if (fileSize > 100000) {
            this.setState({ error: "File size should be less than 100kb", saving: false })
            return false
        }

        if (title.length === 0 || body.length === 0) {
            this.setState({ error: "All fields are required", saving: false })
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

            const postId = this.state.id
            const token = isAuthenticated().token

            update(postId, token, this.postData)
                .then(data => {
                    if (data.error) {
                        this.setState({ error: data.error })
                    } else {
                        this.setState({
                            saving: false,
                            redirectToPost: true
                        })
                    }
                })
        }
    }

    editForm = (title, body) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Post Image</label>
                <input onChange={this.handleChange("photo")} type="file" accept="image/*" className="form-control" />
            </div>
            <div className="form-group">
                <label className="text-muted">Title</label>
                <input onChange={this.handleChange("title")} type="text" className="form-control" value={title} />
            </div>
            <div className="form-group">
                <label className="text-muted">Body</label>
                <textarea onChange={this.handleChange("body")} type="about" className="form-control" value={body} />
            </div>
            <button onClick={this.clickSubmit} type="submit" className="mt-2 btn btn-primary">Update</button>
        </form>
    )

    render() {

        const {
            id,
            authorId,
            title,
            body,
            redirectToPost,
            error,
            saving
        } = this.state

        if (redirectToPost) {
            return <Redirect to={`/post/${id}`} />
        }

        const photoUrl = id ? `${process.env.REACT_APP_API_URL}/post/photo/${id}?${new Date().getTime()}` : DefaultPostImage

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Edit Post</h2>

                <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                    {error}
                </div>

                {saving ? (<div className="alert alert-warning">Saving...</div>) : ("")}

                <img
                    src={photoUrl}
                    alt={title}
                    className="img-thumbnail"
                    style={{ height: "200px", width: "auto" }}
                    onError={i => (i.target.src = `${DefaultPostImage}`)}
                />

                {(isAuthenticated().user.role === "admin" || isAuthenticated().user._id === authorId) &&
                    this.editForm(title, body)}
            </div>
        );
    }
}

export default EditPost;