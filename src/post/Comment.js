import React, { Component } from "react";
import { comment, uncomment } from "./apiPost";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import DefaultProfileImage from "../images/user-avatar.png"

class Comment extends Component {

    state = {
        text: "",
        error: ""
    }

    handleChange = event => {
        this.setState({
            error: false,
            text: event.target.value
        })
    };

    isValid = () => {
        const { text } = this.state
        this.setState({ error: false })
        if (!text.length > 0 || text.length > 150) {
            this.setState({ error: "Comment should not be empty and less than 150 characters long" })
            return false
        }
        return true
    }

    addComment = e => {
        e.preventDefault();

        if (!isAuthenticated()) {
            this.setState({ error: "Plase singin to leave a comment" })
            return false
        }

        if (this.isValid()) {
            const userId = isAuthenticated().user._id
            const postId = this.props.postId
            const token = isAuthenticated().token

            comment(userId, token, postId, { text: this.state.text }).then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    this.setState({ text: '' })
                    // dispatch fresh list of comments to parent component (singlePost)
                    this.props.updateComments(data.comments)
                }
            })
        }
    }

    deleteComment = (comment) => {
        const userId = isAuthenticated().user._id
        const postId = this.props.postId;
        const token = isAuthenticated().token;

        uncomment(userId, token, postId, comment).then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                this.props.updateComments(data.comments)
            }
        })
    }

    deleteConfirmed = (comment) => {
        let answer = window.confirm("Are you sure you want to remove your comment?")
        if (answer) {
            this.deleteComment(comment)
        }
    }

    render() {

        const { comments } = this.props
        const { error } = this.state

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">
                    Leave a comment
                </h2>

                <form onSubmit={this.addComment}>
                    <div className="form-group">
                        <input type="text" onChange={this.handleChange} className="form-control" value={this.state.text} placeholder="Leave a comment..." />
                        <button className="btn btn-raised btn-success mt-2 mb-2">Post</button>
                    </div>
                </form>

                <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                    {error}
                </div>

                <div className="col-md-12">
                    <h3 className="text-primary">{comments.length} Comments</h3>
                    <hr />
                    {comments.reverse().map((comment, i) => (
                        <div key={i}>
                            <div>
                                <Link to={`/user/${comment.postedBy._id}`}>
                                    <img
                                        style={{ borderRadius: "50%", border: "1px solid black" }}
                                        className="float-start me-2"
                                        height="30px"
                                        width="30px"
                                        src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
                                        alt={comment.postedBy.name}
                                        onError={i => (i.target.src = `${DefaultProfileImage}`)}
                                    />
                                </Link>
                                <div>
                                    <p className="lead">
                                        {comment.text}
                                    </p>
                                    <p className="font-italic mark">
                                        Posted by{" "}
                                        <Link to={`/user/${comment.postedBy._id}`}>{comment.postedBy.name}{" "}</Link>
                                        on {new Date(comment.created).toDateString()}

                                        <span>

                                            {isAuthenticated().user &&
                                                isAuthenticated().user._id === comment.postedBy._id &&
                                                <>
                                                    <span onClick={() => this.deleteConfirmed(comment)} className="text-danger float-end me-1">
                                                        Remove
                                                    </span>
                                                </>
                                            }

                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


            </div>
        );
    }
}

export default Comment;