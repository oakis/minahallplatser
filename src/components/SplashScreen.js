import React, { Component } from 'react';
import { View, ImageBackground } from 'react-native';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { autoLogin, loginAnonUser } from '../actions';
import { Spinner, Text } from './common';
import { colors } from './style';
import { globals, getStorage, track } from './helpers';

class SplashScreen extends Component {

	componentDidMount() {
		// Try to automaticly login
		globals.isLoggingIn = true;
		track('App Start');
		firebase.auth().onAuthStateChanged((fbUser) => {
			getStorage('minahallplatser-user')
			.then((user) => {
				window.log('Localstorage user:', user, 'Firebase user:', fbUser);
				if (fbUser && fbUser.uid && globals.isLoggingIn) {
					window.log('User already exists, continue to autologin.');
					globals.isLoggingIn = false;
					this.props.autoLogin(fbUser);
				} else if (globals.didLogout && !globals.isLoggingIn) {
					Actions.login();
					globals.didLogout = false;
					globals.isLoggingIn = true;
				} else if (globals.isLoggingIn) {
					window.log('New user, creating anonymous account.');
					this.props.loginAnonUser();
					globals.isLoggingIn = false;
				}
			})
			.catch((err) => {
				window.log('Something went wrong:', err);
				Actions.login();
			});
		}, (err) => {
			window.log('Something went wrong:', err);
			Actions.login();
		});
	}

	render() {
		return (
			<ImageBackground
				source={{ uri: 'https://www.w3schools.com/css/img_fjords.jpg' }}
				style={{
					flex: 1
				}}
			>
				<View
					style={{
						backgroundColor: 'rgba(255,255,255,0.7)',
						flex: 1,
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					{/* Mina hållplatser logo, custom 'spinner' under logo (brummande buss t.ex) */} 
					<Text style={{ marginBottom: 10, opacity: 1 }}>Mina Hållplatser</Text>
					<Spinner
						size="large"
						color={colors.primary}
						noFlex
					/>
				</View>
			</ImageBackground>
		);
	}

}

export default connect(null, { autoLogin, loginAnonUser })(SplashScreen);
