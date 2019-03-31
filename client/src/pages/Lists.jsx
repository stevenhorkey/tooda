import React, { Component, Fragment } from 'react';
import API from '../utils/API';
import moment from 'moment';

import List from '../components/List';
import ListModal from '../components/ListModal';

class Lists extends Component {

    state = {
        lists: [],
        showListModal: false,
        newListData: {}
    }

    getAllUserLists = () => {
        console.log('getAllUserLists')
        API.getAllUserLists(this.props.user.id)
        .then(res => {
            console.log(res);
            this.setState({
                lists: res.data
            });
        }).catch(err => {
            console.log(err);
        });
    }

    componentDidMount = () => {
        // console.log(this.props.user.id);
        this.getAllUserLists();
    }

    closeListModal = () => this.setState({showListModal: false,});

    triggerListModal = () => this.setState({showListModal: true});
    
    render() {
        return (
            <div className="lists-grid">
                <div className="lists">
                    <div onClick={this.triggerListModal} id="add-list-btn"><ion-icon name="add"></ion-icon></div>
                    {this.state.lists.map((list,key) => {
                        console.log('mapping list items')
                        return(
                            <List 
                                list={list}
                                key={key}
                                user={this.props.user}
                                getAllUserLists={this.getAllUserLists}
                            />
                            )
                        })}
                    {/* <List title={'Today'} id={1}/>
                    <List title={'This Week'} id={2}/>
                    <List title={'This Month'} id={3}/>
                    <List title={'End of Semester'} id={4}/> */}
                    {/* Modal */}
                    {this.state.showListModal ? <ListModal getAllUserLists={this.getAllUserLists} showListModal={this.state.showListModal} closeListModal={this.closeListModal} /> : null}
                </div>
            </div>
        );
    }
}

export default Lists;
