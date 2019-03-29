import axios from 'axios';

// All api routes are defined here centrally for ease of use.
const url = 'http://localhost:3001/api/';
const authURL = 'http://localhost:3001/api/auth/';

export default {

  getListItems: (userId,listId) => axios.get(url + `getListItems/${userId}/${listId}`),
  postListItems: data => axios.post(url + 'postListItems', data),
  sendSMS: data => axios.post(url + 'sendSMS', data),
  deleteListItem: id => axios.delete(url + 'deleteListItem/'+id),
  updateListItem: (listId, itemId, data) => axios.put(url + `updateListItem/${listId}/${itemId}`, data),
  loginUser: (data) => axios.post(authURL + 'login', data),
  registerUser: (data) => axios.post(authURL + 'register', data),
  validateUser: () => axios.post(authURL + 'validate'),
  getAllUserLists: (id) => axios.get(url + 'getAllUserLists/'+id),
  addNewList: data => axios.post(url + 'addNewList/',data),
  deleteList: id => axios.delete(url + 'deleteList/'+id),

};