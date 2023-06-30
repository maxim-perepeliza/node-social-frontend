import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated, signout } from "../auth"
import { remove } from "./apiUser"

class DeleteUser extends Component {

    state = {
        redirect: false
    }

    deleteConfirmed = () => {
        let answer = window.confirm("Are you sure you want to delete your account?")
        if (answer) {
            this.deleteAccount()
        }
    }

    deleteAccount = () => {
        const token = isAuthenticated().token;
        const userId = this.props.userId;
        remove(userId, token)
            .then(data => {
                if (data.error) {
                    console.log(data.erro)
                } else {
                    signout(() => {
                        console.log('User is deleted')
                    })
                    this.setState({ redirect: true })
                }
            })
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/" />
        }
        return (
            <button onClick={this.deleteConfirmed} className="btn btn-danger">
                Delete
            </button>
        );
    }
}

export default DeleteUser;