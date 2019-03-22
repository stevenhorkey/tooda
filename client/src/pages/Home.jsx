import React, { Component, Fragment } from 'react';
import API from '../utils/API';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import DateTimePicker from 'react-datetime-picker';

class Home extends Component {

    state = {
        listItems: false,
        itemInput: '',
        sms: {
            showModal: false
        },
        smsShowModal: false,
        date: new Date(),
    }

    updateAllListItems = () => {
        API.getListItems()
        .then(res => {
            console.log(res.data);
            this.setState({
                listItems: res.data
            })
        }).catch(err => {
            console.log(err);
        });
    }

    componentDidMount = () => {
        this.updateAllListItems();
    }

    handleChange = event => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]:value});
    };

    addListItem = e => {
        e.preventDefault();
        var item = this.state.itemInput;
        if(item === "") return;
        API.postListItems({'value':item})
        .then(res => {
            this.state.listItems.todoItems.push(res.data);
            this.setState({
                itemInput: ""
            })
        }).catch(err => {
            console.log(err);
        })
    }

    changeDateTimePicker = date => this.setState({ date })


    deleteListItem = itemId => {
        console.log(itemId)
        API.deleteListItem(itemId)
        .then(res => {
            console.log(res);
            this.setState({
                listItems: {
                    todoItems: this.state.listItems.todoItems.filter(item => item.id != itemId),
                    completedItems: this.state.listItems.completedItems.filter(item => item.id != itemId)
                }
            })
        }).catch(err => {
            console.log(err);
        });
    }

    updateListItem = (itemId, status) => {
        console.log(itemId)
        API.updateListItem(itemId, {'completed':status})
        .then(res => {
            console.log(res);
            // this.setState({
            //     listItems: {
            //         todoItems: this.state.listItems.todoItems.filter(item => item.id != itemId),
            //         completedItems: this.state.listItems.completedItems.filter(item => item.id != itemId)
            //     }
            // });
            this.updateAllListItems();
        }).catch(err => {
            console.log(err);
        });
    }

    renderModal = () => {
        let data = this.state.sms.data;
        return (
            <Modal show={this.state.sms.showModal} onHide={this.handleClose}>
                <Modal.Header>
                    <Modal.Title>Set A Text Reminder</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                        <form className="col-12">
                            <div class="form-group">
                                <label for="formGroupExampleInput">Message</label>
                                <input value={data.value} type="text" class="form-control" id="formGroupExampleInput" placeholder="Example input"/>
                            </div>
                            <div class="form-group">
                                <label for="formGroupExampleInput2">Date & Time</label>
                                <DateTimePicker
                                    onChange={this.changeDateTimePicker}
                                    value={this.state.date}
                                />
                            </div>
                        </form>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.closeModal}>
                    Cancel
                    </Button>
                    <Button variant="primary" onClick={this.closeModal}>
                    Set Reminder
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    closeModal = () => {
        this.setState({
            sms: {
                showModal: false
            }
        });
    }

    sendTextReminder = item => {
        this.setState({
            sms: {
                showModal: true,
                data: item
            }
        })
        // API.sendSMS(item);
    }

    onBlur = () => {
        console.log('test')
    }

    hoverListitem = () => {
        console.log('test')
    }
    

    render() {
        if(!this.state.listItems) return null;

        let todoItems = this.state.listItems.todoItems;
        let completedItems = this.state.listItems.completedItems;
        return (
            <Fragment>
                <div className="container">
                    <div className="row">
                        <div className="col-6 bg-light box-shadow">
                            <div className="row px-4 pt-4">
                                <h3 className="mx-auto mb-4">Today</h3>
                                <form className="col-12 bg-primary p-3 round">
                                    <input type="text" name="itemInput" onChange={this.handleChange} value={this.state.itemInput} placeholder="Enter an activity.." id="addListItem"/>
                                    <button onClick={this.addListItem} id="add-item-btn"><ion-icon name="add"></ion-icon></button>
                                </form>
                            </div>
                            {/* <h1 className="text-center mb-3">Todo</h1> */}
                            <div className="row p-4">
                                <ul className="list">
                                    {todoItems.map((item,key) => {
                                        return(
                                            <li contentEditable onMouseOver={this.hoverListitem} onBlur={this.onBlur} className="todo" id={`item-`+item.id}>
                                            {item.value}
                                                <span className="list-item-btns">
                                                <span onClick={() => this.sendTextReminder(item)} className="text-item">
                                                    <ion-icon name="text"></ion-icon>
                                                </span>
                                                <span onClick={() => this.deleteListItem(item.id)} className="delete-item">
                                                    <ion-icon name="trash"></ion-icon>
                                                </span>
                                                <span onClick={() => this.updateListItem(item.id, true)} className="complete-item">
                                                    <ion-icon name="checkmark-circle-outline"></ion-icon>
                                                </span>
                                                </span>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                            <hr/>
                            {/* <h1 className="text-center mb-3">Completed</h1> */}
                            <div className="row p-4">
                                <ul className="list">
                            
                                {completedItems.map((item,key) => {
                                    return(
                                        <li className="completed" id={`item-`+item.id}>
                                        {item.value}
                                            <span className="list-item-btns">
                                            <span onClick={() => this.deleteListItem(item.id)} className="delete-item">
                                                <ion-icon name="trash"></ion-icon>
                                            </span>
                                            <span onClick={() => this.updateListItem(item.id, false)} className="complete-item">
                                                <ion-icon name="arrow-up"></ion-icon>
                                            </span>
                                            </span>
                                        </li>
                                    )
                                })}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Modal */}
                {(this.state.sms.showModal) ? this.renderModal() : null}
                
            </Fragment>
        );
    }
}

export default Home;
