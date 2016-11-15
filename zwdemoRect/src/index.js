import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
 
 
ReactDOM.render(
	 <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
			<App />
	</MuiThemeProvider>
  ,
  document.getElementById('root')
);
