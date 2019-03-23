import React, { Component, Fragment } from 'react';
import API from '../utils/API';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import DateTimePicker from 'react-datetime-picker';

class Home extends Component {

    state = {
        date: new Date(),
        message: ''
    }

    componentDidMount = () => {
        this.setState({
            message: this.props.data.value
        });
        console.log(this.props.data)
    }

    handleChange = event => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]:value});
    };

    changeDateTimePicker = date => this.setState({ date })

    sendTextReminder = e => {
        e.preventDefault();
        let {message, date} = this.state;
        let sendTime = date.toString().slice(16,21);
        let sendDate = date.toISOString().slice(0, 10);
        
        let _this = this;

        API.sendSMS({
            message,
            date,
            sendTime,
            sendDate
        })
        .then(res => {
            console.log(res);
            _this.props.closeModal();
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        let data = this.props.data;
        return (
            <Modal show={this.props.showModal} onHide={this.props.closeModal}>
                <Modal.Header>
                    <Modal.Title>Set A Text Reminder</Modal.Title>
                </Modal.Header>
                <form onSubmit={this.sendTextReminder}>
                    <Modal.Body>
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <div className="form-group">
                                        <label htmlFor="message">Message</label>
                                        <input value={this.state.message} name="message" onChange={this.handleChange} type="text" className="form-control" placeholder="Text Message Body"/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="datepicker">Date & Time</label>
                                        <DateTimePicker
                                            onChange={this.changeDateTimePicker}
                                            value={this.state.date}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.props.closeModal}>
                        Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                        Set Reminder
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
                
        );
    }
}

export default Home;
