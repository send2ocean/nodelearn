import React, { Component } from 'react';
//import logo from './logo.svg';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './App.css';
import { Router, Route, Link, browserHistory,IndexRoute } from 'react-router'

import LogIn from './components/login.js'
import Home from './components/appBar.js'
import TableSimple from './components/tablesimple.js'
import NoMatch from './components/nomatch.js'
class App extends Component {
   constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }
   
  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  render() {
    return(
      <Router history={browserHistory}>
        <Route path="/" component={Home}>
          <IndexRoute component={TableSimple} />
          <Route path="/login" component={LogIn}/>
          <Route path="/table" component={TableSimple}/>  
          <Route path="*" component={NoMatch}/>  
        </Route>
      </Router>
           
    );
  }
}
 

export default App;
