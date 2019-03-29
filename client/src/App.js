import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import logo from './logo.svg';

import Lists from './pages/Lists';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import AuthRoute from './utils/AuthRoute';

class App extends Component {
  render() {
    return (
        <Router>
          <div className="App">
            <Navbar/>
            <div id='content'>
              <Switch>

                  {/* <Route exact path="/signup" render={() => <Signup />} /> */}
                  {/* <Route exact path="/login" render={() => <Login />} /> */}
                  <Route exact path="/login" component={AuthPage} />
                  
                  <AuthRoute path='/' component={Lists}/>                                                                

              </Switch>
            </div>
          </div>
        </Router>
    );
  }
}

export default App;
