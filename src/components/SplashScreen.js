import React, { Component } from 'react';
import { Text, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import firebase from 'firebase';
import { Container, Content, Spinner } from 'native-base';
import { connect } from 'react-redux';
import { autoLogin } from '../actions';
import minahallplatser from '../themes/minahallplatser';


class SplashScreen extends Component {

	componentDidMount() {
		// Try to automaticly login
		firebase.auth().onAuthStateChanged((fbUser) => {
			AsyncStorage.getItem('minahallplatser-user').then((dataJson) => {
				const user = JSON.parse(dataJson);
				if (user.uid === fbUser.uid) {
					this.props.autoLogin(fbUser);
				}
			}).catch((err) => {
				console.log('SplashScreen auto login error: ', err);
				Actions.auth();
			});
		});
	}

	render() {
		return (
			<Container theme={minahallplatser}>
				<Content
					contentContainerStyle={{
						flex: 1,
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center'
					}}
					keyboardShouldPersistTaps="always"
					keyboardDismissMode="on-drag"
				>
					{/* Mina hållplatser logo, custom 'spinner' under logo (brummande buss t.ex) */} 
					<Text>Mina Hållplatser</Text>
					<Spinner />
				</Content>
			</Container>
		);
	}

}

export default connect(null, { autoLogin })(SplashScreen);
