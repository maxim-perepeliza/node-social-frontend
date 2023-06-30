import React from "react";
import Posts from '../post/Posts';
const Home = () => {
    return <div>

        <div className="jombotron">
            <h2 className="mt-5 mb-5">Home</h2>
            <p className="lead">
                Welcome to React Frontend
            </p>
        </div>

        <div className="container">
            <Posts />
        </div>

    </div>
}

export default Home;
