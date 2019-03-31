import React, { Component, Fragment } from 'react';
import {Draggable} from 'react-beautiful-dnd';
import Textarea from 'react-textarea-autosize';


class ListItem extends Component {

    // state = {
    //     color: 'white'
    // }


    onBlur = () => {
        this.props.updateListItemValue(this.props.item.id, this.props.item.value);
        // this.setState({
        //     color: 'white'
        // });
    }

    // onClick = () => {
    //     this.setState({
    //         color: '#ffff724d'
    //     });
    // }
    
    handleChange = event => {
        console.log('handleChange')
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]:value});
    };

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
                    className={item.completed ? 'completed' : 'todo'} 
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    id={`item-`+item.id}
                    // style={{
                    //     'background': this.state.color
                    // }}
                    >
                        <Textarea 
                        value={item.value}
                        onChange={(e) => this.props.handleItemChange(e, item.id)}
                        name='value'
                        onBlur={this.onBlur}
                        // onClick={this.onClick}
                        />
                        <span className="list-item-btns">

                            {!item.completed ? 
                                <span onClick={() => this.props.triggerTextModal(item)} className="text-item">
                                <ion-icon name="paper-plane"></ion-icon>
                                </span>
                            : null}
                            
                            <span onClick={() => this.props.deleteListItem(item.id)} className="delete-item">
                                <ion-icon name="trash"></ion-icon>
                            </span>
                            {!item.completed ? 
                                <span onClick={() => this.props.updateListItem(item.id, true)} className="complete-item">
                                <ion-icon name="checkmark-circle-outline"></ion-icon>
                                {/* <ion-icon name="radio-button-off"></ion-icon> */}
                                </span>
                            : 
                                <span onClick={() => this.props.updateListItem(item.id, false)} className="return-item">
                                <ion-icon name="radio-button-off"></ion-icon>
                                </span>
                            }
                        
                        </span>
                    </li>   

                )}
            </Draggable>
        );
    }
}

export default ListItem;
