import React, { Component } from 'react';
import API from '../utils/API';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';

import TextModal from './TextModal';
import ListItem from './ListItem';

class List extends Component {

    state = {
        listItems: [],
        itemInput: '',
        showTextModal: false,
        date: new Date(),
        modalData: {},
        itemOrder: null
    }

    sortListItems = (itemOrder, items) => {
        // console.log('sortListItems')

        let sortedItems = [];
        // let items = this.props.list.ListItems;
        let desiredOrder = itemOrder.split(',').filter(e => e);
        // console.log(items, desiredOrder,this.props.list);

        desiredOrder.forEach(id => {
            // console.log(id);
            items.forEach(item => {
                // console.log(item);
                if(item.id === parseInt(id)) sortedItems.push(item);
                // else if(item.id === parseInt(id) && item.completed) sortedCompletedItems.push(item);
            });
        });

        // console.log(sortedItems);

        this.setState({
            listItems: sortedItems,
            itemOrder: desiredOrder
        });

        // console.log(this.state);


    }

    updateAllListItems = () => {
        // console.log('updateAllListItems')

        let userId = this.props.user.id;
        let listId = this.props.list.id;
        API.getListItems(userId,listId)
        .then(res => {
            // console.log('updated whole list',res.data);
            // this.setState({
            //     listItems: res.data
            // });
            // this.sortListItems(this.state.itemOrder, res.data)
            return res.data;

        }).catch(err => {
            console.log(err);
        });
    }

    componentDidMount = () => {
        // console.log('componentDidMount')
        // this.updateAllListItems();
        this.sortListItems(this.props.list.itemOrder, this.props.list.ListItems);

    }

    shouldComponentUpdate = () => {
        if(this.state.listItems !== this.props.list.listItems) return true;
        if(this.state.itemOrder !== this.props.list.itemOrder) return true;
    }

    handleChange = event => {
        // console.log('handleChange')
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]:value});
    };

    handleItemChange = (event,itemId) => {
        // console.log('handleItemChange')

        this.setState({
            listItems: this.state.listItems.map(item =>
                item.id === itemId
                  ? { ...item, value: event.target.value }
                  : item
            )
        });
    };

    updateListItemValue = (itemId, newValue) => {
        // console.log('updateListItemValue');
        API.updateListItemValue(this.props.list.id, itemId, {newValue}).then(res => {
            // console.log(res);
            this.props.getAllUserLists();
            // this.updateAllListItems();
            this.sortListItems(this.props.list.itemOrder,this.updateAllListItems());
        }).catch(err => {
            console.log(err);
        });
        // console.log(this.state.listItems,revisedItems);
    }

    addListItem = e => {
        e.preventDefault();
        // console.log('addListItem')
        // console.log(this.state.itemOrder);


        var item = this.state.itemInput;
        if(item === "") return;
        
        API.addListItem({'value':item, 'ListId': this.props.list.id})
        .then(res => {
            this.state.listItems.push(res.data);
            this.props.getAllUserLists();
            this.state.itemOrder.push(`${res.data.id}`);
            this.setState({
                itemInput: "",
            })
            // console.log(res);
            // console.log(this.state);
        }).catch(err => {
            console.log(err);
        });
    }

    changeDateTimePicker = date => this.setState({ date })

    deleteListItem = itemId => {
        // console.log('deleteListItem',itemId)
        API.deleteListItem(this.props.list.id,itemId)
        .then(res => {
            // console.log(res);
            // console.log(this.state.itemOrder.filter(id => {
            //     console.log(id, itemId.toString());
            //     return id !== itemId.toString();
            // }))
            this.setState({
                listItems: this.state.listItems.filter(item => item.id !== itemId),
                itemOrder: this.state.itemOrder.filter(id => id !== itemId.toString())
            });
            this.props.getAllUserLists();
        }).catch(err => {
            console.log(err);
        });
    }

    updateListItem = (itemId, status) => {
        // console.log('updateListItem',itemId)
        API.updateListItem(this.props.list.id, itemId, {'completed':status})
        .then(res => {
            // console.log(res);
            let revisedItems = this.state.listItems.map(item =>
                item.id === itemId
                  ? { ...item, completed: status }
                  : item
            );
            this.setState({
                
            });
            // console.log(revisedItems);
            this.setState({
                listItems: revisedItems
            });
            this.props.getAllUserLists();
        }).catch(err => {
            console.log(err);
        });
    }

    arraymove = (arr, fromIndex, toIndex) => {
        // console.log('arraymove')
        var element = arr[fromIndex];
        arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, element);
        return arr;
    }

    closeTextModal = () => {
        // console.log('closeTextModal')
        this.setState({
            showTextModal: false,
            modalData: {}
        });
    }

    triggerTextModal = item => {
        // console.log('triggerTextModal')
        this.setState({
            modalData: item,
            showTextModal: true
        });
    }

    onDragEnd = result => {
        // console.log('onDragEnd')

        const { destination, source, draggableId } = result;
        if (!destination) { return }
        // console.log(destination, source, draggableId, this.state.itemOrder);

        let newItemOrderArr = this.arraymove(this.state.itemOrder, source.index, destination.index);
        let newItemOrder = newItemOrderArr.join(',') + ',';
        // console.log(newItemOrderArr);
        // console.log(newItemOrder);

        API.updateListItemOrder(this.props.list.id,{newItemOrder})
        .then(res => {
            // console.log(res);
            // this.sortListItems(newItemOrder);
            // this.props.getAllUserLists();
            // this.setState({
            //     itemOrder: newItemOrderArr
            // });
            this.sortListItems(newItemOrder, this.state.listItems);
            // console.log(this.state);
        }).catch(err => {
            console.log(err);
        });
        
    }

    promptDeleteList = () => {
        // console.log('promptDeleteList')

        let proceedDelete = window.confirm(`You are about to delete the list: '${this.props.list.title}'. This cannot be undone.`);

        if(proceedDelete) {
            API.deleteList(this.props.list.id)
            .then(res => {
                // console.log(res);
                this.props.getAllUserLists();
            }).catch(err => {
                console.log(err);
            });
        }
        
    }

    render() {
        if(!this.state.listItems) return null;

        // let listItems = this.props.list.ListItems;
        let listItems = this.state.listItems;
        // console.log('rendering items', this.state)

        return (
            <div className="list-container">
                        <div className=" mx-auto bg-light box-shadow list-card" id={'list-'+this.props.list.id}>
                            <div className="row px-4 pt-4">
                                <div className="position-relative w-100 text-center">
                                    <h3 className="mx-auto mb-4">{this.props.list.title}</h3>
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
                                        {listItems.map((item,key) => {
                                            // if(!item.completed){
                                            return(
                                                <ListItem 
                                                    draggableId={item.id} 
                                                    index={key}
                                                    triggerTextModal={this.triggerTextModal}
                                                    deleteListItem={this.deleteListItem}
                                                    updateListItem={this.updateListItem}
                                                    item={item}
                                                    updateListItemValue={this.updateListItemValue}
                                                    handleItemChange={this.handleItemChange}
                                                />
                                                )
                                            // }
                                            })}
                                            {provided.placeholder}
                                        </ul>
                                    )}
                                </Droppable>
                            </div>
                            {/* {this.state.listItems.length !== 0 ? 
                                <Fragment>
                                    <hr/>
                                    <div className="row p-4">
                                        <ul className="list">
                                        {listItems.map((item,key) => {
                                            if(item.completed){
                                            return(
                                                <ListItem 
                                                    draggableId={item.id} 
                                                    index={key}
                                                    triggerTextModal={this.triggerTextModal}
                                                    deleteListItem={this.deleteListItem}
                                                    updateListItem={this.updateListItem}
                                                    item={item}
                                                />
                                            )}
                                        })}
                                        </ul>
                                    </div>
                                </Fragment>
                            : null} */}
                            </DragDropContext>
                        </div>
                
                {/* Modal */}
                {this.state.showTextModal ? <TextModal user={this.props.user} data={this.state.modalData} showTextModal={this.state.showTextModal} closeTextModal={this.closeTextModal} /> : null}
                
            </div>
        );
    }
}

export default List;
