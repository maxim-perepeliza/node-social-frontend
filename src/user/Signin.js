import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { signin, authenticate } from "../auth"
import SocialLogin from "./SocialLogin";

class Signin extends Component {

    constructor() {
        super()
        this.state = {
            email: "",
            password: "",
            error: "",
            redirectToRefer: false,
            loading: false,
            recaptcha: false
        }
    }

    handleChange = (name) => (event) => {
        this.setState({ [name]: event.target.value, error: "" });
    }



    clickSubmit = (event) => {
        event.preventDefault();
        this.setState({ loading: true })
        const { email, password } = this.state
        const user = {
            email,
            password
        }

        if (this.state.recaptcha) {
            signin(user)
                .then(data => {
                    if (data.error) {
                        this.setState({ error: data.error })
                        this.setState({ loading: false })
                    } else {
                        // authenticate
                        authenticate(data, () => {
                            this.setState({ redirectToRefer: true })
                        })
                    }
                })
        } else {
            this.setState({
                loading: false,
                error: "What day is today? Please write a correct answer!"
            });
        }
    }

    recaptchaHandler = e => {
        this.setState({ error: "" });
        let userDay = e.target.value.toLowerCase();
        let dayCount;

        if (userDay === "sunday") {
            dayCount = 0;
        } else if (userDay === "monday") {
            dayCount = 1;
        } else if (userDay === "tuesday") {
            dayCount = 2;
        } else if (userDay === "wednesday") {
            dayCount = 3;
        } else if (userDay === "thursday") {
            dayCount = 4;
        } else if (userDay === "friday") {
            dayCount = 5;
        } else if (userDay === "saturday") {
            dayCount = 6;
        }

        if (dayCount === new Date().getDay()) {
            this.setState({ recaptcha: true });
            return true;
        } else {
            this.setState({
                recaptcha: false
            });
            return false;
        }
    };

    signinForm = (email, password, recaptcha) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={this.handleChange("email")} type="email" className="form-control" value={email} />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input onChange={this.handleChange("password")} type="password" className="form-control" value={password} />
            </div>
            <div className="form-group">
                <label className="text-muted">
                    {recaptcha ? "Thanks. You got it!" : "What day is today?"}
                </label>
                <input
                    onChange={this.recaptchaHandler}
                    type="text"
                    className="form-control"
                />
            </div>
            <button onClick={this.clickSubmit} type="submit" className="mt-2 btn btn-primary">Submit</button>
        </form>
    )

    render() {
        const { email, password, error, redirectToRefer, loading, recaptcha } = this.state;

        if (redirectToRefer) {
            return <Redirect to={"/"}></Redirect>
        }

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Signin</h2>

                <hr />
                <SocialLogin />
                <hr />

                <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                    {error}
                </div>

                {loading ? (<div className="alert alert-warning">Loading...</div>) : ("")}

                {this.signinForm(email, password, recaptcha)}

                <p className="mt-2">
                    <Link to="/forgot-password" className="text-danger">
                        {" "}
                        Forgot Password
                    </Link>
                </p>
            </div>
        );
    }
}

export default Signin;