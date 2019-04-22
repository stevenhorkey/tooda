import React, { Component, Fragment } from 'react';
import API from '../utils/API';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import DateTimePicker from 'react-datetime-picker';

class TextModal extends Component {

    state = {
        date: new Date(),
        message: ''
    }

    componentDidMount = () => {
        this.setState({
            message: this.props.data.value
        });
        // console.log(this.props.data)
        console.log('launched text modal')
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
            // console.log(res);
            _this.props.closeTextModal();
        }).catch(err => {
            console.log(err);
        });
    }

    sendEmailReminder = e => {
        e.preventDefault();
        let {message, date} = this.state;
        let sendTime = date.toString().slice(16,21);
        let sendDate = date.toISOString().slice(0, 10);
        let subject = 'reList Reminder Notification'
        let sendTo = this.props.user.email;
        let _this = this;

        let data = {
            message,
            subject,
            sendTo,
            date,
            sendTime,
            sendDate
        };

        // console.log('should send email',data)
        API.sendEmail(data)
        .then(res => {
            // console.log(res);
            _this.props.closeTextModal();
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        let data = this.props.data;
        return (
            <Modal show={this.props.showTextModal} onHide={this.props.closeTextModal}>
                <Modal.Header>
                    <Modal.Title>Set A Text Reminder</Modal.Title>
                </Modal.Header>
                <form onSubmit={this.sendEmailReminder}>
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
                        <Button variant="secondary" onClick={this.props.closeTextModal}>
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

export default TextModal;
