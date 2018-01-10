import React, { Component } from 'react';
import { View, ImageBackground, AsyncStorage } from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { autoLogin, loginAnonUser } from '../actions';
import { Spinner, Text } from './common';
import { colors } from './style';
import { globals } from './helpers';

class SplashScreen extends Component {

	componentDidMount() {
		// Try to automaticly login
		firebase.auth().onAuthStateChanged((fbUser) => {
			AsyncStorage.getItem('minahallplatser-user')
			.then((dataJson) => {
				const user = JSON.parse(dataJson);
				if (fbUser && user && user.uid === fbUser.uid) {
					window.log('User already exists, continue to autologin.');
					this.props.autoLogin(fbUser);
				} else if (globals.didLogout) {
					Actions.login();
					globals.didLogout = false;
				} else if (!globals.isCreatingAnonUser) {
					window.log('New user, creating anonymous account.');
					this.props.loginAnonUser();
					globals.isCreatingAnonUser = true;
				}
			})
			.catch((err) => {
				window.log('New user, creating anonymous account.', fbUser, err);
				this.props.loginAnonUser();
			});
		}, (err) => window.log(err));
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
