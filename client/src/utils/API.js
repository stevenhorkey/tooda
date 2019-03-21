import axios from 'axios';
// var md5 = require('md5');

// All api routes are defined here centrally for ease of use.
const url = 'http://localhost:3001/api/';
// const authUrl = 'https://everythinginall.com/wp-json/jwt-auth/v1/token/';
// const mcListId = 'd25ec94b8f';


export default {

  getListItems: () => axios.get(url + 'getListItems'),
  postListItems: data => axios.post(url + 'postListItems', data),
  deleteListItem: id => axios.delete(url + 'deleteListItem/'+id),
//   getPosts: num => axios.get(url + 'posts?&per_page=' + num),
//   getQuotes: () => axios.get(url + 'posts?&per_page=100'),
//   getPages: () => axios.get(url + 'pages'),
//   getCourses: () => axios.get(url + 'courses'),
//   getPost: slug => axios.get(url + 'posts?slug=' + slug),
//   getPage: (pageSlug) => axios.get(url + 'pages?slug='+pageSlug),
//   getCourse: (courseSlug) => axios.get(url + 'course?slug=' + courseSlug),
//   sendFile: (slug, file) => axios.post(url + slug, file),
//   login: (data) => axios.post(authUrl, data),
//   validateJWT: () => axios.post(authUrl + 'validate')
  // mcAddSubscriber: (data) => axios.post('https://memeandmeaning.us16.list-manage.com/subscribe/post?u=4c73c4e387b1f2b219c1f2af6&amp;id=d25ec94b8f', data)
};