import React, { Component } from 'react';
//import logo from './logo.svg';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './App.css';
import { Router, Route, Link, browserHistory,IndexRoute } from 'react-router'

import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { Provider } from 'react-redux'
import { createStore,applyMiddleware } from 'redux'
import todoApp from './redux/reducers'

import LogIn from './components/login.js'
import Home from './components/appBar.js'
import TableSimple from './components/tablesimple.js'
import NoMatch from './components/nomatch.js'
import Frm from './components/frm'
import GMap from './components/googlemap'

const loggerMiddleware = createLogger()
let store = createStore(
  todoApp,
  applyMiddleware(
      thunkMiddleware, // lets us dispatch() functions
      loggerMiddleware // neat middleware that logs actions
    ))

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
      <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={Home}>
          <IndexRoute component={GMap} />
          <Route path="/login" component={LogIn}/>
          <Route path="/table" component={TableSimple}/>
          <Route path="/frm" component={Frm}/>
          <Route path="/gmap" component={GMap}/>
          <Route path="*" component={NoMatch}/>
        </Route>
      </Router>
      </Provider>
    );
  }
}


export default App;
