import React, { Component } from "react";
import { listPostFeed } from "./apiPost"
import DefaultPostImage from "../images/placeholder-post.jpg"
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth"

class PostsFeed extends Component {
    constructor() {
        super()
        this.state = {
            posts: [],
            initiated: false,
            page: 1
        }
    }

    loadPosts = page => {
        const token = isAuthenticated().token
        const userId = isAuthenticated().user._id

        listPostFeed(page, userId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ posts: data, initiated: true })
            }
        });
    };

    componentDidMount() {
        this.loadPosts(this.state.page);
    }

    renderPosts = posts => {
        return (
            <div className="row">
                {posts.map((post, i) => {

                    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
                    const posterName = post.postedBy ? post.postedBy.name : "Unknown";

                    return (
                        <div className="col-md-4" key={i}>
                            <div className="card mb-3">
                                <img
                                    className="card-img-top"
                                    src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                                    alt={post.name}
                                    style={{ width: "auto", height: "15vw", objectFit: "cover" }}
                                    onError={i => (i.target.src = `${DefaultPostImage}`)}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{post.title}</h5>
                                    <p className="card-text">{post.body.substring(0, 50)}</p>
                                    <p className="font-italic mark">
                                        Posted by{" "}
                                        <Link to={`${posterId}`}>{posterName}{" "}</Link>
                                        on {new Date(post.created).toDateString()}
                                    </p>
                                    <Link className="btn btn-primary btn-small" to={`/post/${post._id}`}>
                                        Read More
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )
                })
                }
            </div>
        )
    }

    render() {

        const { posts, initiated } = this.state

        return (
            <div className="container">

                {!initiated && (<p>Loading...</p>)}

                {this.renderPosts(posts)}
            </div>
        );
    }
}

export default PostsFeed;