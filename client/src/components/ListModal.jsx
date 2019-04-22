import React, { Component, Fragment } from 'react';
import API from '../utils/API';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

class ListModal extends Component {

    state = {
        title: ''
    }

    componentDidMount = () => {
        this.setState({
            title: ""
        });
    }

    handleChange = event => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]:value});
    };

    addList = e => {
        e.preventDefault();
        let {title} = this.state;

        let _this = this;

        API.addList({
            title
        })
        .then(res => {
            // console.log(res);
            _this.props.closeListModal();
            _this.props.getAllUserLists();
        }).catch(err => {
            console.log(err);
        });
    }
    

    render() {
        return (
            <Modal show={this.props.showListModal} onHide={this.props.closeListModal}>
                <Modal.Header>
                    <Modal.Title>Create a New List</Modal.Title>
                </Modal.Header>
                <form onSubmit={this.addList}>
                    <Modal.Body>
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <div className="form-group">
                                        <label htmlFor="title">Title</label>
                                        <input value={this.state.title} name="title" onChange={this.handleChange} type="text" className="form-control" placeholder="List Title"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.props.closeListModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            Create List
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
                
        );
    }
}

export default ListModal;
