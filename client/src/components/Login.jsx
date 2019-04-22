import React, { Component, Fragment } from 'react';

class Login extends Component {

    render() {
        let stateData = this.props.stateData;
        return (
            <Fragment>
                <label>Email</label>
                <input value={stateData.email} onChange={this.props.handleChange} name="email" className="w-100 col-md-12" placeholder="youremail@example.com" type="text"/>
                <label>Password</label>
                <input value={stateData.password} onChange={this.props.handleChange} name="password" className="w-100 col-md-12" placeholder="password" type="password"/>
                <button className="btn btn-primary col-12 py-2 mt-4" onClick={event => this.props.attemptLogin(event)}>Login</button>
            </Fragment>
        );
    }
}

export default Login;
