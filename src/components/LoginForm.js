import React, { Component } from 'react';
import { View, AppState } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import firebase from 'firebase';
import facebook from 'react-native-fbsdk';
import { emailChanged, passwordChanged, loginUser, resetRoute, autoLogin, clearErrors, loginAnonUser, loginFacebook } from '../actions';
import { Button, Input, Message } from './common';
import { track, globals } from './helpers';

const { LoginManager, AccessToken } = facebook;

class LoginForm extends Component {

	componentDidMount() {
		AppState.addEventListener('change', this.handleAppStateChange);
	}

	componentWillUnmount() {
		this.props.resetRoute();
		this.props.clearErrors();
		AppState.removeEventListener('change', this.handleAppStateChange);
	}

	onEmailChange = (text) => {
		this.props.emailChanged(text);
	}

	onPasswordChange = (text) => {
		this.props.passwordChanged(text);
	}

	onButtonPress = () => {
		this.props.loading = true;
		const { email, password } = this.props;
		this.props.loginUser({ email, password });
	}

	loginFacebook = () => {
		LoginManager.logInWithReadPermissions(['email'])
		.then((result) => {
			if (result.isCancelled) {
				window.log('Login cancelled:', result);
			} else {
				window.log('Login success:', result);
				AccessToken.getCurrentAccessToken().then(
					(data) => {
						globals.isLoggingIn = true;
						const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
						firebase.auth().signInWithCredential(credential)
						.then(user => window.log(`Facebook account ${user.email} was successfully logged in.`))
						.catch(error => window.log('Facebook account failed:', error));
					}
				);
			}
		},
		(error) => {
			window.log(`Login fail with error: ${error}`);
		})
		.catch((e) => window.log(e));
	}

	handleAppStateChange = (nextAppState) => {
		if (nextAppState === 'active') {
			track('Page View', { Page: 'Login', Type: 'Reopened app from background' });
		}
	}

	render() {
		return (
			<View
				style={{
					flex: 1,
					marginLeft: 10,
					marginRight: 10,
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center'
				}}
				keyboardShouldPersistTaps="always"
				keyboardDismissMode="on-drag"
			>

				<Message
					type="danger"
					message={this.props.error}
				/>

				<Input
					placeholder="din@email.se"
					keyboardType="email-address"
					returnKeyType="next"
					onChangeText={this.onEmailChange}
					value={this.props.email}
					icon="ios-mail"
				/>
				<Input
					secureTextEntry
					placeholder="ditt lösenord"
					onChangeText={this.onPasswordChange}
					value={this.props.password}
					icon="ios-key"
					iconSize={22}
				/>

				<Button
					loading={this.props.loading}
					uppercase
					color="primary"
					label="Logga in"
					onPress={this.onButtonPress}
				/>

				<Button
					color="facebook"
					uppercase
					label="Logga in med Facebook"
					onPress={this.loginFacebook}
				/>

				<Button
					fontColor="primary"
					label="Registrera"
					onPress={async () => {
						await this.props.clearErrors();
						Actions.register();
					}}
				/>
				<Button
					fontColor="primary"
					label="Glömt lösenord"
					onPress={async () => {
						await this.props.clearErrors();
						Actions.resetpw();
					}}
				/>

			</View>
		);
	}

}

const mapStateToProps = ({ auth, errors }) => {
	const { email, password, loading, token, loadingAnon } = auth;
	const { error } = errors;
	return { email, password, error, loading, token, loadingAnon };
};

export default connect(mapStateToProps, {
	emailChanged, passwordChanged, loginUser, resetRoute, autoLogin, clearErrors, loginAnonUser, loginFacebook
})(LoginForm);
