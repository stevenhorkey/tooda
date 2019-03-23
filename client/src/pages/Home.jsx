import React, { Component, Fragment } from 'react';
import API from '../utils/API';
import Modal from '../components/Modal';
import moment from 'moment';
class Home extends Component {

    state = {
        listItems: false,
        itemInput: '',
        // sms: {
        //     showModal: false
        // },
        showModal: false,
        date: new Date(),
        modalData: {}
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
        console.log(this.state.listItems);
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

    closeModal = () => {
        this.setState({
            showModal: false,
            modalData: {}
        });
    }

    triggerTextModal = item => {
        this.setState({
            modalData: item,
            showModal: true
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
                        <div className="col-12 col-md-6 mx-auto bg-light box-shadow">
                            <div className="row px-4 pt-4">
                                <h3 className="mx-auto mb-4">Today</h3>
                                <br/>
                                <small className="list-curr-date text-muted">{moment().format('MMM D, YYYY')}</small>
                                <form className="col-12 bg-primary p-3 round box-shadow">
                                    <input type="text" name="itemInput" onChange={this.handleChange} value={this.state.itemInput} placeholder="Make sure what you put here is actually important..." id="addListItem"/>
                                    <button onClick={this.addListItem} id="add-item-btn"><ion-icon name="add"></ion-icon></button>
                                </form>
                            </div>
                            <div className="row p-4">
                                <ul className="list">
                                    {todoItems.map((item,key) => {
                                        return(
                                            <li contentEditable onMouseOver={this.hoverListitem} onBlur={this.onBlur} className="todo" id={`item-`+item.id}>
                                            {item.value}
                                                <span className="list-item-btns">
                                                <span onClick={() => this.triggerTextModal(item)} className="text-item">
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
                            {this.state.listItems.completedItems.length !== 0 ? 
                                <Fragment>
                                    <hr/>
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
                                </Fragment>
                            : null}
                        </div>
                    </div>
                </div>
                
                {/* Modal */}
                {this.state.showModal ? <Modal data={this.state.modalData} showModal={this.state.showModal} closeModal={this.closeModal} /> : null}
                
            </Fragment>
        );
    }
}

export default Home;
