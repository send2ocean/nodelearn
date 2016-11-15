import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AppBar from './appBar.js';
import MenuItems from './menuItem.js'

export default class DrawerSimple extends React.Component {

  constructor(props) {
    super(props);
    this.state = {open: true};
  }
 
  render() {
    return (
      <div>
         
        <Drawer open={this.state.open} width={200} openSecondary={false}>
          <AppBar/>
          <MenuItems/> 
        </Drawer>
      </div>
    );
  }
}