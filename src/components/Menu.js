import React, { Component } from 'react';
import { View, AsyncStorage, ImageBackground } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { Text, ListItem, ListHeading, ListItemSeparator } from './common';
import { LOGOUT_USER_SUCCESS } from '../actions/types';
import { store } from '../App';
import { colors, metrics, component } from './style';

class Menu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: firebase.auth().currentUser
        };
    }

    logout() {
        firebase.auth().signOut().then(function() {
            AsyncStorage.clear();
            store.dispatch({ type: LOGOUT_USER_SUCCESS });
        }, function(error) {
            window.log('Sign Out Error', error);
        });
    }

	render() {
		return (
			<View style={{ flexDirection: 'column', backgroundColor: colors.background, flex: 1 }}>
                <View>
                    <ImageBackground source={{ uri: 'https://www.w3schools.com/css/img_fjords.jpg' }} style={{ width: 225, height: 150 }}>
                        <View
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.7)',
                                flex: 1
                            }}
                        />
                    </ImageBackground>

                    <ListHeading text="Ditt konto" />

                    <Text style={component.text.menu.label}>
                        {'e-mail'.toUpperCase()}
                    </Text>
                    <Text style={component.text.menu.value}>
                        {this.state.user.isAnonymous ? 'Anonym' : this.state.user.email}
                    </Text>

                    <ListHeading text="Dina inställningar" />

                    <Text style={component.text.menu.label} />
                    <Text style={component.text.menu.value}>
                        Kommer snart..
                    </Text>

                    <ListHeading/>

                    <ListItem
                        text='Logga ut'
                        icon='ios-exit-outline'
                        iconVisible
                        pressItem={() => {
                            this.logout();
                        }}
                    />
                </View>
            </View>
		);
	}

}

export default connect(null, null)(Menu);
