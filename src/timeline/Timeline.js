import React, { Component } from "react";
import PostsFeed from "../post/PostsFeed";

class Timeline extends Component {

    render() {
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Posts Feed</h2>
                <div className="row">
                    <PostsFeed />
                </div>
            </div>
        );
    }
}

export default Timeline;