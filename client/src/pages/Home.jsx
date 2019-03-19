import React, { Component } from 'react';
import API from '../utils/API';

class Home extends Component {

    state = {
        listItems: false
    }

    componentDidMount = () => {
        API.getListItems()
        .then(res => {
            console.log(res);

            this.setState({
                listItems: res.data
            })
        })
    }
    

    render() {
        if(!this.state.listItems) return null;

        let todoItems = this.state.listItems.todoItems;
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        {/* <h1 className="text-center mb-3">Todo</h1> */}
                        <div className="row bg-primary p-5 round">
                            {todoItems.map((item,key) => {
                                return(
                                    <div className="card" id={`item-`+key}>{item.value}</div>
                                )
                            })}
                        </div>
                        <hr/>
                        {/* <h1 className="text-center mb-3">Completed</h1> */}
                        <div className="row bg-primary p-5 round">
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
