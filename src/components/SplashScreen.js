import React, { Component } from 'react';
import { View, ImageBackground, Text, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { autoLogin } from '../actions';
import { Spinner } from './common';
import { colors } from './style';

class SplashScreen extends Component {

	componentDidMount() {
		// Try to automaticly login
		firebase.auth().onAuthStateChanged((fbUser) => {
			AsyncStorage.getItem('minahallplatser-user')
			.then((dataJson) => {
				const user = JSON.parse(dataJson);
				if (user.uid === fbUser.uid) {
					this.props.autoLogin(fbUser);
				} else {
					Actions.auth();
				}
			})
			.catch(() => {
				Actions.auth();
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

export default connect(null, { autoLogin })(SplashScreen);
