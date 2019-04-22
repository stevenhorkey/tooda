import React, { Component, Fragment } from 'react';
import API from '../utils/API';

import { Redirect } from 'react-router';
import Login from '../components/Login';
import Register from '../components/Register';

class AuthPage extends Component {

  state = {
    loading: false,
    email: null,
    password: null,
    firstName: null,
    lastName: null,
    confirmpassword: null,
    mobileNumber: null,
    whichForm: 'login',
    reponse: null,
    async: false
  };

  componentDidMount = () => {};

  changeForm = (form, event) => {
    // console.log(form, event.currentTarget)
    this.setState({
      whichForm: form
    })
  }

  handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({[name]:value});
  };


  attemptRegister = (event) => {
    event.preventDefault();

    // TODO: need to validate phone number and confirm password

    this.setState({
      async: true
    })

    let {email, password, firstName, lastName, mobileNumber} = this.state;
    
    API.registerUser({
      email,
      password,
      firstName,
      lastName,
      mobileNumber
    })
      .then(res => {
        this.setState({
          async: false,
          response: res.data.message,
          success: res.data.success
        })
        window.location.reload(); 
        // console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  }

  attemptLogin = (event) => {
    event.preventDefault();

    this.setState({
      async: true
    })

    let { email, password } = this.state;
    
    API.loginUser({
      email,
      password
    })
      .then(res => {
        localStorage.setItem('jwtToken', res.data.token);
        this.setState({
          async: false,
          response: res.data.message,
          success: res.data.success
        });

        // console.log(res,this.state);
        
      })
      .catch(err => {
        console.log(err);
      })
  }

  render() {
    if (this.state.success) return <Redirect to="/" />;
    if (this.state.loading) return null;
      return( 
      <Fragment>
          <div className="container">
              <div className="row align-items-center justify-content-center">
                  <div className="bg-light col-md-4 col-sm-6 col-12 bg-trans-dark py-4 text-left px-5 box-shadow" id="login-container">
                    <div>
                    <div className="row">
                      <h3 className="auth-form-titles" onClick={(event) => this.changeForm('login', event)}>Login</h3> 
                      <h3 className="ml-auto auth-form-titles" onClick={(event) => this.changeForm('signup', event)}>Signup</h3>
                    </div>
                      <form className="row mt-3">
                        {(this.state.whichForm === 'login') ? 
                          <Login 
                            stateData={this.state}
                            handleChange={this.handleChange}
                            attemptLogin={this.attemptLogin}
                          />
                        :
                        <Fragment>
                          <Register 
                            stateData={this.state}
                            handleChange={this.handleChange}
                            attemptRegister={this.attemptRegister}
                          />
                        </Fragment>
                        }
                        {(!this.state.async) ? null : 
                        <div className="sk-folding-cube" style={{
                          position: "absolute",
                          bottom: 14,
                          right: 45
                        }}>
                          <div className="sk-cube1 sk-cube"></div>
                          <div className="sk-cube2 sk-cube"></div>
                          <div className="sk-cube4 sk-cube"></div>
                          <div className="sk-cube3 sk-cube"></div>
                        </div>
                        }
                        {this.state.response ? 
                          <div className="alert-danger mt-3 w-100 text-center p-2 round">{this.state.response}</div>
                          :
                          null
                        }
                        
                      </form>
                    </div>
                  </div>
              </div>
          </div>


      </Fragment>
      );
  }
}

export default AuthPage;
