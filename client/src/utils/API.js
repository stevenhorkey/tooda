import axios from 'axios';

function loadBalance(){
  let rand = Math.round(Math.random());
  // if(rand === 1){
  //   let url = {
  //     api: 'http://3.211.47.9/api/',
  //     auth: 'http://3.211.47.9/api/auth/'
  //   };
  //   console.log('url',url);
  //   return url;
  // } else {
  let url = {
    api: '/api/',
    auth: '/api/auth/'
  };
  // console.log('url',url);
  // url = {
  //   api: 'http://127.0.0.1:3001/api/',
  //   auth: 'http://127.0.0.1:3001/api/auth/'
  // };
  return url;
  // }
  // for localhost
  
  // console.log(url)
  // return url;
}

// All api routes are defined here centrally for ease of use.

export default {

  getListItems: (userId,listId) => axios.get(loadBalance().api + `getListItems/${userId}/${listId}`),
  addListItem: data => axios.post(loadBalance().api + 'addListItem', data),
  sendSMS: data => axios.post(loadBalance().api + 'sendSMS', data),
  sendEmail: data => axios.post(loadBalance().api + 'sendEmail', data),
  deleteListItem: (listId, itemId) => axios.delete(loadBalance().api + `deleteListItem/${listId}/${itemId}`),
  updateListItem: (listId, itemId, data) => axios.put(loadBalance().api + `updateListItem/${listId}/${itemId}`, data),
  updateListItemOrder: (listId, newItemOrder) => axios.put(loadBalance().api + `updateListItemOrder/${listId}`, newItemOrder),
  updateListItemValue: (listId, itemId, newValue) => axios.put(loadBalance().api + `updateListItemValue/${listId}/${itemId}`, newValue),
  loginUser: (data) => axios.post(loadBalance().auth + 'login', data),
  registerUser: (data) => axios.post(loadBalance().auth + 'register', data),
  validateUser: () => axios.post(loadBalance().auth + 'validate'),
  getAllUserLists: (id) => axios.get(loadBalance().api + 'getAllUserLists/'+id),
  addList: data => axios.post(loadBalance().api + 'addList/',data),
  deleteList: id => axios.delete(loadBalance().api + 'deleteList/'+id),

};
