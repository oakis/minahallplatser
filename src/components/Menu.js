import React, { Component } from 'react';
import { View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { Text, ListItem, ListHeading, ListItemSeparator } from './common';
import { logout } from '../actions'
import { colors } from './style';

class Menu extends Component {

	render() {
		return (
			<View style={{ flex: 1 }}>
                <ListHeading>Menu</ListHeading>
                <ListItem
                    text='Logga ut'
                    icon='ios-exit-outline'
                    iconVisible
                    pressItem={() => {
                        console.log('hej');
                        logout();
                    }}
                />
            </View>
		);
	}

}

export default connect(null, { logout })(Menu);
