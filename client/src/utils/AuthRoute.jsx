import React, {Component} from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import API from './API';
import axios from 'axios';

class AuthRoute extends Component{

    state = {
        success: false,
        login: false,
        user: {}
    }

    componentDidMount = () => {

        // console.log(this.state)
        // console.log(localStorage.getItem('jwtToken'));
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
        

        API.validateUser()
        .then(res => {
            // console.log(res);
            this.setState({
                user: res.data.user,
                success: res.data.success
            })
            // console.log(res.data.user);
            axios.defaults.headers.common['User'] = JSON.stringify(res.data.user);
            // console.log(axios.defaults.headers.common);
        }).catch(err => {
            console.log(err);
            this.setState({
                login: true
            });
        });
    }

    render(){
        if (this.state.login) {
            return <Redirect to='/login'/>;
        }
        if(!this.state.success){
            return (null);
        } else {
            let WrappedComponent = this.props.component;
            return (
                <BrowserRouter>
                    <Route 
                        to={this.props.path}
                        render={(props) => <WrappedComponent {...props} user={this.state.user} />}
                    />
                </BrowserRouter>
            )
        }
    }
}

export default AuthRoute;