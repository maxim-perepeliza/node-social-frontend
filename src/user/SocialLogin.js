import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { socialLogin, authenticate } from "../auth";
import jwt_decode from "jwt-decode";

class SocialLogin extends Component {

    constructor() {
        super();
        this.state = {
            redirectToReferrer: false
        };
    }

    responseGoogle = response => {
        console.log(response);
        const userObject = jwt_decode(response.credential);
        console.log(userObject);

        const { sub, name, email, picture } = userObject;
        const user = {
            password: sub,
            name: name,
            email: email,
            imageUrl: picture
        };

        // console.log("user obj to social login: ", user);
        socialLogin(user).then(data => {
            console.log("signin data: ", data);
            if (data.error) {
                console.log("Error Login. Please try again..");
            } else {
                console.log("signin success - setting jwt: ", data);
                authenticate(data, () => {
                    this.setState({ redirectToReferrer: true });
                });
            }
        });
    };

    render() {

        const { redirectToReferrer } = this.state;
        if (redirectToReferrer) {
            return <Redirect to="/" />;
        }

        return (
            <div className="container">
                <GoogleLogin onSuccess={this.responseGoogle} onError={error => {
                    console.log(error);
                }} />
            </div>
        );
    }
}

export default SocialLogin;