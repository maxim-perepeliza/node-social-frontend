import React, { Component } from "react";
import { list } from "./apiPost"
import DefaultPostImage from "../images/placeholder-post.jpg"
import { Link } from "react-router-dom";

class Posts extends Component {
    constructor() {
        super()
        this.state = {
            posts: [],
            initiated: false,
            page: 1
        }
    }

    loadPosts = page => {
        list(page).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ posts: data, initiated: true })
            }
        });
    };

    loadMore = number => {
        this.setState({ page: this.state.page + number });
        this.loadPosts(this.state.page + number);
    };

    loadLess = number => {
        this.setState({ page: this.state.page - number });
        this.loadPosts(this.state.page - number);
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

        const { posts, initiated, page } = this.state

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">
                    {!initiated && "Loading..."}
                    {!Boolean(posts.length) && initiated && "No more posts!"}
                    {Boolean(posts.length) && initiated && "Recent Posts"}
                </h2>

                {this.renderPosts(posts)}

                {page > 1 ? (
                    <button
                        className="btn btn-raised btn-warning mr-5 mt-5 mb-5"
                        onClick={() => this.loadLess(1)}
                    >
                        Previous ({page - 1})
                    </button>
                ) : (
                    ""
                )}

                {posts.length ? (
                    <button
                        className="btn btn-raised btn-success mt-5 mb-5"
                        onClick={() => this.loadMore(1)}
                    >
                        Next ({page + 1})
                    </button>
                ) : (
                    ""
                )}
            </div>
        );
    }
}

export default Posts;