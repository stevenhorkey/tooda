import React, { Component } from 'react';
import API from '../utils/API';

class Home extends Component {

    state = {
        listItems: false,
        itemInput: ''
    }

    componentDidMount = () => {
        API.getListItems()
        .then(res => {
            console.log(res);

            this.setState({
                listItems: res.data
            })
        }).catch(err => {
            console.log(err);
        })
    }

    handleChange = event => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]:value});
    };

    addItem = e => {
        e.preventDefault();
        var item = this.state.itemInput;
        if(item === "") return;
        console.log(item);
        API.postListItems({'value':item})
        .then(res => {
            console.log(res);
            this.state.listItems.todoItems.push(res.data);
            this.setState({
                itemInput: ""
            })
        }).catch(err => {
            console.log(err);
        })
    }
    

    render() {
        if(!this.state.listItems) return null;

        let todoItems = this.state.listItems.todoItems;
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="row px-5 pt-5">
                            <form className="col-12 bg-primary p-3 round">
                                <input type="text" name="itemInput" onChange={this.handleChange} value={this.state.itemInput} placeholder="Enter an activity.." id="addItem"/>
                                <button onClick={this.addItem} id="add-item-btn"><ion-icon name="add"></ion-icon></button>
                            </form>
                        </div>
                        {/* <h1 className="text-center mb-3">Todo</h1> */}
                        <div className="row p-5">
                            <ul className="list">
                                {todoItems.map((item,key) => {
                                    return(
                                        <li className="todo" id={`item-`+key}>
                                        {item.value}
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                        <hr/>
                        {/* <h1 className="text-center mb-3">Completed</h1> */}
                        <div className="row p-5">
                            {/* {todoItems.map((item,key) => {
                                return(
                                    <div className="card" key="key">{item}</div>
                                )
                            })} */}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
