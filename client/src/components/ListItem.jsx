import React, { Component, Fragment } from 'react';
import {Draggable} from 'react-beautiful-dnd';

class ListItem extends Component {

    render() {
        let item = this.props.item;
        console.log(item);
        return (
            <Draggable 
                draggableId={item.id} 
                index={this.props.index}
            >
                {(provided) => (
                    <li  
                    onMouseOver={this.hoverListitem} 
                    onBlur={this.onBlur} 
                    className="todo" 
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    id={`item-`+item.id}>
                    {item.value}
                        <span className="list-item-btns">
                        <span onClick={() => this.props.triggerTextModal(item)} className="text-item">
                            <ion-icon name="text"></ion-icon>
                        </span>
                        <span onClick={() => this.props.deleteListItem(item.id)} className="delete-item">
                            <ion-icon name="trash"></ion-icon>
                        </span>
                        <span onClick={() => this.props.updateListItem(item.id, true)} className="complete-item">
                            <ion-icon name="checkmark-circle-outline"></ion-icon>
                        </span>
                        </span>
                    </li>   
                )}
            </Draggable>
        );
    }
}

export default ListItem;
