import React, { Component } from "react";
import { singlePost, remove, unlike, like } from './apiPost';
import DefaultPostImage from "../images/placeholder-post.jpg"
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth"
import Comment from "./Comment"

class SinglePost extends Component {

    state = {
        post: '',
        redirectToHome: false,
        redirectToSignin: false,
        like: false,
        likes: 0,
        comments: []
    }

    checkLike = (likes) => {
        const userId = isAuthenticated() && isAuthenticated().user._id;
        let match = likes.indexOf(userId) !== -1;
        return match;
    }

    componentDidMount = () => {
        const postId = this.props.match.params.postId;
        singlePost(postId).then(data => {
            console.log(data);
            if (data.error) {
                console.log(data.error)
            } else {
                this.setState({
                    post: data,
                    like: this.checkLike(data.likes),
                    likes: data.likes.length,
                    comments: data.comments,
                })
            }
        })
    }

    deletePost = () => {
        const postId = this.props.match.params.postId;
        const token = isAuthenticated().token;
        remove(postId, token).then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                this.setState({ redirectToHome: true });
            }
        })
    }

    deleteConfirmed = () => {
        let answer = window.confirm("Are you sure you want to delete your account?")
        if (answer) {
            this.deletePost()
        }
    }

    likeToggle = () => {
        if (!isAuthenticated()) {
            this.setState({ redirectToSignin: true })
            return false
        }
        let callApi = this.state.like ? unlike : like;
        const userId = isAuthenticated().user._id;
        const postId = this.state.post._id;
        const token = isAuthenticated().token;

        callApi(userId, token, postId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    like: !this.state.like,
                    likes: data.likes.length
                })
            }
        });
    }

    updateComments = comments => {
        this.setState({ comments })
    }

    renderPost = (post) => {
        const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
        const posterName = post.postedBy ? post.postedBy.name : "Unknown";

        const { like, likes } = this.state;

        return (
            <div className="card mb-3">
                <img
                    className="card-img-top"
                    src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                    alt={post.name}
                    style={{ width: "100%", height: "300px", objectFit: "cover" }}
                    onError={i => (i.target.src = `${DefaultPostImage}`)}
                />

                <div className="card-body">

                    {like ? (
                        <h6 onClick={this.likeToggle}><i className="fa fa-thumbs-up text-success bg-dark" style={{ padding: '5px', borderRadius: "50%" }} /> {likes} Likes</h6>
                    ) : (
                        <h6 onClick={this.likeToggle}><i className="fa fa-thumbs-up text-warning bg-dark" style={{ padding: '5px', borderRadius: "50%" }} /> {likes} Likes</h6>
                    )}

                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text">{(post.body ? post.body.substring(0, 50) : '')}</p>
                    <p className="font-italic mark">
                        Posted by{" "}
                        <Link to={`${posterId}`}>{posterName}{" "}</Link>
                        on {new Date(post.created).toDateString()}
                    </p>
                    <div className="d-inline-block">
                        <Link className="btn btn-primary btn-small me-5" to={`/`}>
                            Back to posts
                        </Link>

                        {isAuthenticated().user &&
                            isAuthenticated().user._id === post.postedBy._id &&
                            <>
                                <Link className="btn btn-raised btn-warning me-5" to={`/post/edit/${post._id}`}>
                                    Update Post
                                </Link>
                                <button onClick={this.deleteConfirmed} className="btn btn-raised btn-danger">
                                    Delete Post
                                </button>
                            </>
                        }

                        {isAuthenticated().user &&
                            isAuthenticated().user.role === "admin" && (
                                <div class="card mt-5">
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            Admin
                                        </h5>
                                        <p className="mb-2 text-danger">
                                            Edit/Delete as an Admin
                                        </p>
                                        <Link
                                            to={`/post/edit/${post._id}`}
                                            className="btn btn-raised btn-warning me-5"
                                        >
                                            Update Post
                                        </Link>
                                        <button
                                            onClick={this.deleteConfirmed}
                                            className="btn btn-raised btn-danger"
                                        >
                                            Delete Post
                                        </button>
                                    </div>
                                </div>
                            )}
                    </div>

                </div>
            </div>
        )
    }

    render() {
        const { post, redirectToHome, redirectToSignin, comments } = this.state;

        if (redirectToHome) {
            return <Redirect to={`/`} />
        } else if (redirectToSignin) {
            return <Redirect to={`/signin`} />
        }

        return (
            <div className="container">
                <h2 className="display-2 mt-5 mb-5">{post.title}</h2>
                {!post ? (<div className="alert alert-warning">Loading...</div>) : (this.renderPost(post))}

                <Comment
                    postId={post._id}
                    comments={comments}
                    updateComments={this.updateComments}
                />
            </div>
        );
    }
}

export default SinglePost;