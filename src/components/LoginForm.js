import React, { Component } from 'react';
import { View, AppState, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
import facebook from 'react-native-fbsdk';
import { emailChanged, passwordChanged, loginUser, resetRoute, autoLogin, clearErrors, loginAnonUser, loginFacebook } from '../actions';
import { Button, Input, Message } from './common';
import { track, globals } from './helpers';
import { metrics } from './style';

const { LoginManager, AccessToken } = facebook;

class LoginForm extends Component {

	constructor(props) {
		super(props);
		this.state = {
			fbPopupVisible: false,
			fbLoading: false
		};
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

	onButtonPress = () => {
		this.props.loading = true;
		const { email, password } = this.props;
		this.props.loginUser({ email, password });
	}

	loginFacebook = () => {
		track('Login Facebook Start');
		this.setState({ fbPopupVisible: true });
		LoginManager.logInWithReadPermissions(['email'])
		.then((result) => {
			if (result.isCancelled) {
				window.log('Login cancelled:', result);
				track('Login Facebook Cancel');
			} else {
				this.setState({ fbLoading: true });
				window.log('Login success:', result);
				track('Login Facebook Success');
				AccessToken.getCurrentAccessToken().then(
					(data) => {
						globals.isLoggingIn = true;
						const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
						firebase.auth().signInAndRetrieveDataWithCredential(credential)
						.then(user => window.log(`Facebook account ${user.email} was successfully logged in.`))
						.catch(error => window.log('Facebook account failed:', error));
					}
				);
				this.setState({ fbPopupVisible: false });
			}
		},
		(error) => {
			window.log(`Login fail with error: ${error}`);
		})
		.catch((e) => window.log(e));
	}

	handleAppStateChange = (nextAppState) => {
		if (nextAppState === 'active' && !this.state.fbPopupVisible) {
			track('Page View', { Page: 'Login', Type: 'Reopened app from background' });
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

				<Button
					loading={this.props.loading}
					uppercase
					color="primary"
					label="Logga in"
					onPress={this.onButtonPress}
				/>

				<Button
					loading={this.state.fbLoading}
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
				{currentUser && currentUser.isAnonymous ?
					<Text
						style={{ padding: metrics.padding.md }}
						onPress={() => {
							track('Cancel Login');
							Actions.dashboard();
						}}
					>
						Gå till startsidan
					</Text> : null
				}

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
