import React, { Component, Fragment } from 'react';

class Register extends Component {

    render() {
        let stateData = this.props.stateData;
        return (
            <Fragment>
                <input value={stateData.firstname} onChange={this.props.handleChange} name="firstName" className="w-100 col-md-12" placeholder="First Name" type="text"/>
                <input value={stateData.lastname} onChange={this.props.handleChange} name="lastName" className="w-100 col-md-12" placeholder="Last Name" type="text"/>
                <input value={stateData.email} onChange={this.props.handleChange} name="email" className="w-100 col-md-12" placeholder="Email" type="text"/>
                <input value={stateData.password} onChange={this.props.handleChange} name="password" className="w-100 col-md-12" placeholder="Password" type="password"/>
                <input value={stateData.confirmpassword} onChange={this.props.handleChange} name="confirmpassword" className="w-100 col-md-12" placeholder="Confirm Password" type="password"/>
                <input value={stateData.mobileNumber} onChange={this.props.handleChange} name="mobileNumber" className="w-100 col-md-12" placeholder="Phone Number" type="tel" pattern="[0-9]{3} [0-9]{3} [0-9]{4}"/>
                {/* <div className="form-group col-12"> */}
                    {/* <input value={stateData.optTerms} onChange={this.props.handleChange} name="optTerms" className="" placeholder="Mobile Phone Number" type="checkbox"/> */}
                    {/* <small className="d-inline">I agree to the <a href="/terms-and-conditions" target="_blank">terms and conditions</a></small> */}
                {/* </div> */}
                <button className="btn btn-primary col-12 py-2" onClick={event => this.props.attemptRegister(event)}>Signup</button>
            </Fragment>
        );
    }
}

export default Register;
