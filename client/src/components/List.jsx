import React, { Component, Fragment } from 'react';
import API from '../utils/API';
import moment from 'moment';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';

import TextModal from './TextModal';
import ListItem from './ListItem';

class List extends Component {

    state = {
        listItems: false,
        itemInput: '',
        showTextModal: false,
        date: new Date(),
        modalData: {}
    }

    updateAllListItems = () => {
        let userId = this.props.user.id;
        let listId = this.props.list.id;
        API.getListItems(userId,listId)
        .then(res => {
            console.log('updated whole list',res.data);
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
        
        API.postListItems({'value':item, 'ListId': this.props.list.id})
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
        console.log('deleteListItem',itemId)
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
        console.log('updateListItem',itemId)
        API.updateListItem(this.props.list.id, itemId, {'completed':status})
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

    closeTextModal = () => {
        this.setState({
            showTextModal: false,
            modalData: {}
        });
    }

    triggerTextModal = item => {
        this.setState({
            modalData: item,
            showTextModal: true
        })
    }

    onBlur = () => {
        console.log('test')
    }

    hoverListitem = () => {
        console.log('test')
    }


    onDragEnd = result => {

        const { destination, source, draggableId } = result;
        if (!destination) { return }
        
        const column = this.state.column;
        const numberIds = Array.from(column.numberIds);
        numberIds.splice(source.index, 1);
        numberIds.splice(destination.index, 0, draggableId);
        const numbers = numberIds.map((numberId) => 
            parseInt(this.state.numbers[numberId].content, 10));
        
        this.playSound(numbers);
        this.updateState(column, numberIds);

    }

    promptDeleteList = () => {
        let listId = this.props.list.id;

        let proceedDelete = window.confirm(`You are about to delete the list: '${this.props.list.listName}'. This cannot be undone.`);

        if(proceedDelete) {
            API.deleteList(this.props.list.id)
            .then(res => {
                console.log(res);
                this.props.getAllUserLists();
            }).catch(err => {
                console.log(err);
            });
        }
    }

    render() {
        if(!this.state.listItems) return null;

        let todoItems = this.state.listItems.todoItems;
        let completedItems = this.state.listItems.completedItems;
        return (
            <div class="list-container">
                        <div className=" mx-auto bg-light box-shadow list-card" id={'list-'+this.props.list.id}>
                            <div className="row px-4 pt-4">
                                <div class="position-relative w-100 text-center">
                                    <h3 className="mx-auto mb-4">{this.props.list.listName}</h3>
                                    <small onClick={this.promptDeleteList} className="delete-list text-muted"><ion-icon name="close"></ion-icon></small>
                                </div>
                                <form className="col-12 bg-primary p-3 round box-shadow">
                                    <input type="text" name="itemInput" onChange={this.handleChange} value={this.state.itemInput} placeholder="Is this effective?" id="addListItem"/>
                                    <button onClick={this.addListItem} id="add-item-btn"><ion-icon name="add"></ion-icon></button>
                                </form>
                            </div>
                            <DragDropContext
                                onDragEnd={this.onDragEnd}
                            >
                            <div className="row p-4">
                                <Droppable 
                                    droppableId='todo-list'
                                >
                                    {(provided) => (
                                        <ul 
                                            className="list"
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            {...provided.droppablePlaceholder}
                                        >
                                        {todoItems.map((item,key) => {
                                            return(
                                                <ListItem 
                                                    draggableId={item.id} 
                                                    index={key}
                                                    triggerTextModal={this.triggerTextModal}
                                                    deleteListItem={this.deleteListItem}
                                                    updateListItem={this.updateListItem}
                                                    item={item}
                                                />
                                                )
                                            })}
                                            {provided.placeholder}
                                        </ul>
                                    )}
                                </Droppable>
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
                            </DragDropContext>
                        </div>
                
                {/* Modal */}
                {this.state.showTextModal ? <TextModal data={this.state.modalData} showTextModal={this.state.showTextModal} closeTextModal={this.closeTextModal} /> : null}
                
            </div>
        );
    }
}

export default List;
