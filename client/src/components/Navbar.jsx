import React, { Component, Fragment } from 'react';
import {Draggable} from 'react-beautiful-dnd';
import moment from 'moment';

class Navbar extends Component {

    logout = () => {
        localStorage.removeItem('jwtToken');
        window.location.reload();
    }

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="#">TooDa</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                    {/* <li className="nav-item active">
                        <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Features</a>
                    </li> */}
                    <li className="nav-item">
                        <span className="nav-link" href="#">{moment().format('MMM D, YYYY')}</span>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#" onClick={this.logout}>Logout</a>
                    </li>
                    {/* <li className="nav-item">
                        <a className="nav-link disabled" href="#">Disabled</a>
                    </li> */}
                    </ul>
                </div>
            </nav>
        );
    }
}

export default Navbar;
