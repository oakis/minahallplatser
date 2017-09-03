import React, { Component } from 'react';
import { View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { emailChanged, passwordChanged, loginUser, resetRoute, autoLogin, clearErrors } from '../actions';
import { Button, Input, Message } from './common';

class LoginForm extends Component {

	componentWillUnmount() {
		this.props.resetRoute();
	}

	onEmailChange(text) {
		this.props.emailChanged(text);
	}

	onPasswordChange(text) {
		this.props.passwordChanged(text);
	}

	onButtonPress() {
		this.props.loading = true;
		const { email, password } = this.props;
		this.props.loginUser({ email, password });
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
					onChangeText={this.onEmailChange.bind(this)}
					value={this.props.email}
					icon="ios-mail"
				/>
				<Input
					secureTextEntry
					placeholder="ditt lösenord"
					onChangeText={this.onPasswordChange.bind(this)}
					value={this.props.password}
					icon="ios-key"
					iconSize={22}
				/>

				<Button
					loading={this.props.loading}
					uppercase
					color="primary"
					label="Logga in"
					onPress={this.onButtonPress.bind(this)}
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
	const { email, password, loading, token } = auth;
	const { error } = errors;
	return { email, password, error, loading, token };
};

export default connect(mapStateToProps, {
	emailChanged, passwordChanged, loginUser, resetRoute, autoLogin, clearErrors
})(LoginForm);
