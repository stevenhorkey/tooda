import React, { Component, Fragment } from 'react';

class Register extends Component {

    render() {
        let stateData = this.props.stateData;
        return (
            <Fragment>
                <label>First Name</label>
                <input value={stateData.firstname} onChange={this.props.handleChange} name="firstName" className="w-100 col-md-12" placeholder="First Name" type="text"/>
                <label>Last Name</label>
                <input value={stateData.lastname} onChange={this.props.handleChange} name="lastName" className="w-100 col-md-12" placeholder="Last Name" type="text"/>
                <label>Email</label>
                <input value={stateData.email} onChange={this.props.handleChange} name="email" className="w-100 col-md-12" placeholder="Email" type="text"/>
                <label>Password</label>
                <input value={stateData.password} onChange={this.props.handleChange} name="password" className="w-100 col-md-12" placeholder="Password" type="password"/>
                <label>Confirm Password</label>
                <input value={stateData.confirmpassword} onChange={this.props.handleChange} name="confirmpassword" className="w-100 col-md-12" placeholder="Confirm Password" type="password"/>
                <label>Phone Number to Recieve Texts</label>
                <input value={stateData.mobileNumber} onChange={this.props.handleChange} name="mobileNumber" className="w-100 col-md-12" placeholder="Phone Number" type="tel" pattern="[0-9]{3} [0-9]{3} [0-9]{4}"/>
                {/* <div className="form-group col-12"> */}
                    {/* <input value={stateData.optTerms} onChange={this.props.handleChange} name="optTerms" className="" placeholder="Mobile Phone Number" type="checkbox"/> */}
                    {/* <small className="d-inline">I agree to the <a href="/terms-and-conditions" target="_blank">terms and conditions</a></small> */}
                {/* </div> */}
                <button className="btn btn-primary col-12 py-2 mt-4" onClick={event => this.props.attemptRegister(event)}>Signup</button>
            </Fragment>
        );
    }
}

export default Register;
