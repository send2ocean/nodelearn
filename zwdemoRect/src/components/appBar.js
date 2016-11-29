import React from 'react';


import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItems from './menuItem.js'
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/arrow-back';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Menu from 'material-ui/Menu';

import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import ContentLink from 'material-ui/svg-icons/content/link';
import Divider from 'material-ui/Divider';
import ContentCopy from 'material-ui/svg-icons/content/content-copy';
import Download from 'material-ui/svg-icons/file/file-download';
import Delete from 'material-ui/svg-icons/action/delete';
import FontIcon from 'material-ui/FontIcon';

import { Link,browserHistory } from 'react-router'

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
const styles = {
  title: {
    cursor: 'pointer',
  },
};
const Logged = (props) => (
  <IconMenu
    {...props}
    iconButtonElement={
      <IconButton><MoreVertIcon /></IconButton>
    }
    targetOrigin={{horizontal: 'right', vertical: 'top'}}
    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
  >
    <MenuItem primaryText="Refresh" />
    <MenuItem primaryText="Help" />
    <MenuItem primaryText="Sign out" />
  </IconMenu>
);

Logged.muiName = 'IconMenu';
class Home extends React.Component {
	constructor(props) {
    super(props);
    this.state = {open: false};
    this.handleToggled = this.handleToggled.bind(this);
  }

  handleToggled(e){


  	console.log('toggled')
  	this.setState({open: !this.state.open});
  }
  xyz(event){
    console.log('xyz')
  }


  render() {
    return (

	     <div>
	       <AppBar
				    title={<span style={styles.title}>IWork</span>}
				    onLeftIconButtonTouchTap={this.handleToggled}
				    iconElementLeft={<IconButton  ><NavigationMenu /></IconButton>}
				    iconElementRight={<Logged />}
  				/>

	        <Drawer width={200}   open={this.state.open} >
	          <AppBar title="Menus"
	          onLeftIconButtonTouchTap={this.handleToggled}
	          iconElementLeft={<IconButton ><NavigationClose /></IconButton>}

	          />
          	<Menu onItemTouchTap={this.handleToggled} >

              <MenuItem primaryText="Login" leftIcon={<RemoveRedEye />}  containerElement={<Link to="/login" />} />
              <MenuItem primaryText="FRM" leftIcon={<PersonAdd />} containerElement={<Link to="/frm" />}   />
              <MenuItem primaryText="Get Tables" leftIcon={<ContentLink />} containerElement={<Link to="/table" />}/>
              <Divider />
              <MenuItem primaryText="Google Map" leftIcon={<ContentCopy />} containerElement={<Link to="/gmap" />}/>
              <MenuItem primaryText="Download" leftIcon={<Download />} />
              <Divider />
              <MenuItem primaryText="Remove" leftIcon={<Delete />}  onTouchTap = { this.xyz}/>
            </Menu>
	        </Drawer>
          {this.props.children}
	      </div>

    );
  }

}
export default Home;
