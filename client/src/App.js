import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import logo from './logo.svg';

import Home from './pages/Home';

class App extends Component {
  render() {
    return (
        <Router>
          <div className="App">
            {/* <Navbar/> */}
            <div id='content'>
              <Switch>

                  {/* <Route exact path="/signup" render={() => <Signup />} /> */}
                  {/* <Route exact path="/login" render={() => <Login />} /> */}
                  {/* <Route exact path="/protected" component={Test} /> */}
                  <Route render={() => <Home/>} />

              </Switch>
            </div>
            {/* <Footer/> */}
          </div>
        </Router>
    );
  }
}

export default App;
