import axios from 'axios';

// All api routes are defined here centrally for ease of use.
const url = 'http://localhost:3001/api/';
const authURL = 'http://localhost:3001/api/auth/';

export default {

  getListItems: (userId,listId) => axios.get(url + `getListItems/${userId}/${listId}`),
  addListItem: data => axios.post(url + 'addListItem', data),
  sendSMS: data => axios.post(url + 'sendSMS', data),
  deleteListItem: (listId, itemId) => axios.delete(url + `deleteListItem/${listId}/${itemId}`),
  updateListItem: (listId, itemId, data) => axios.put(url + `updateListItem/${listId}/${itemId}`, data),
  updateListItemOrder: (listId, newItemOrder) => axios.put(url + `updateListItemOrder/${listId}`, newItemOrder),
  updateListItemValue: (listId, itemId, newValue) => axios.put(url + `updateListItemValue/${listId}/${itemId}`, newValue),
  loginUser: (data) => axios.post(authURL + 'login', data),
  registerUser: (data) => axios.post(authURL + 'register', data),
  validateUser: () => axios.post(authURL + 'validate'),
  getAllUserLists: (id) => axios.get(url + 'getAllUserLists/'+id),
  addList: data => axios.post(url + 'addList/',data),
  deleteList: id => axios.delete(url + 'deleteList/'+id),

};