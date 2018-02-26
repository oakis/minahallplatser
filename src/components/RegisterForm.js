import React, { Component } from 'react';
import { View, AppState } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import facebook from 'react-native-fbsdk';
import {
	emailChanged,
	passwordChanged,
	passwordSecondChanged,
	registerUser,
	resetRoute,
	clearErrors,
	registerFacebook
} from '../actions';
import { Input, Button, Message } from './common';
import { track } from './helpers';

const { LoginManager, AccessToken } = facebook;

class RegisterForm extends Component {

	componentWillMount() {
		this.props.resetRoute();
	}

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

	onPasswordSecondChange = (text) => {
		this.props.passwordSecondChanged(text);
	}

	onButtonPress = () => {
		this.props.loading = true;
		const { email, password, passwordSecond } = this.props;
		this.props.registerUser({ email, password, passwordSecond });
	}

	registerFacebook = () => {
		track('Register Facebook Start');
		this.setState({ fbPopupVisible: true });
		LoginManager.logInWithReadPermissions(['email'])
		.then((result) => {
			if (result.isCancelled) {
				window.log('Login cancelled:', result);
				track('Register Facebook Cancel');
			} else {
				window.log('Login success:', result);
				track('Register Facebook Success');
				AccessToken.getCurrentAccessToken().then(
					(data) => {
						const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
						this.props.registerFacebook(credential);
					}
				);
				// this.setState({ fbPopupVisible: false });
			}
		},
		(error) => {
			window.log(`Register fail with error: ${error}`);
		})
		// .then(() => setTimeout(() => this.setState({ fbPopupVisible: false }), 1500))
		.catch((e) => window.log(e));
	}

	handleAppStateChange = (nextAppState) => {
		if (nextAppState === 'active') {
			track('Page View', { Page: 'Register', Type: 'Reopened app from background' });
		}
	}

	render() {
		const { currentUser } = firebase.auth();
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
				<Input
					secureTextEntry
					placeholder="lösenord igen"
					onChangeText={this.onPasswordSecondChange}
					value={this.props.passwordSecond}
					icon="ios-key"
					iconSize={22}
				/>
				<Button
					loading={this.props.loading}
					uppercase
					color="primary"
					label="Registrera"
					onPress={this.onButtonPress}
				/>
				<Button
					loading={this.props.loadingFacebook}
					uppercase
					color="facebook"
					label="Registrera med facebook"
					onPress={this.registerFacebook}
				/>
				{currentUser && currentUser.isAnonymous ?
					<Button
						uppercase
						color="danger"
						label="Avbryt registering"
						onPress={() => {
							track('Cancel Register');
							Actions.dashboard();
						}}
					/> : null
				}
			</View>
		);
	}

}

const MapStateToProps = (state) => {
	const { loading, email, password, passwordSecond, loadingFacebook } = state.auth;
	const { error } = state.errors;
	return { error, loading, email, password, passwordSecond, loadingFacebook };
};

export default connect(MapStateToProps,
	{ emailChanged, passwordChanged, passwordSecondChanged, registerUser, resetRoute, clearErrors, registerFacebook }
)(RegisterForm);
