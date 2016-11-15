import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import AppBar from './appBar.js'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
//import whatwg-fetch;
import restful, { fetchBackend } from 'restful.js';
import { browserHistory } from 'react-router'
const api = restful('http://localhost:5000/api/', fetchBackend(fetch));
const loginUser = api.custom('accounts/login'); 
const style = {
    height: "100%",
    width: "auto",
    margin: "20%",
    textAlign: 'center',
    display: 'inline-block',
};
class Login extends Component {
    constructor(props) {
        super(props);
        this.state={username:'test',password:'test'};
        //This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
        this.handleUserNameChange = this.handleUserNameChange.bind(this);
        this.handlePwdChange = this.handlePwdChange.bind(this);
    }
     
     handleClick(e) {
      e.preventDefault();
      console.log('The link was clicked.');
      let userInfo  =  this.state; 
      loginUser.post(userInfo).then((response) => {
          let resEntyBody = response.body();

          let resEnty = resEntyBody.data();
          if(resEnty.id){
            //this.context.router.push("/home");
            browserHistory.push('/')
           
          }
          console.log(resEnty); //  
      })
      .catch((err) => {
        // deal with the error
        console.log(err);
      });
      
    }
    handleUserNameChange(event) {
      this.setState({username: event.target.value});
    }
    handlePwdChange(event) {
      this.setState({password: event.target.value});
    }
    render() {
      return( 
         <Paper style={style} zDepth={1}>
          <lable> Account Login </lable> <br/>
          <TextField hintText="User Name"  
          value={this.state.username} 
          onChange={this.handleUserNameChange}/>  
          <br/>

          <TextField hintText="Password" 
          value={this.state.password}  
          onChange={this.handlePwdChange} 
          floatingLabelText="Password" 
          type="password"/>

          <br/>
          <FlatButton label="Login" primary={true}  onClick={this.handleClick}/>  
          <FlatButton label="Reset" secondary={true}/>
         </Paper>
         
      );

  }
}
 

export default Login;
