import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import {
	emailChanged,
	passwordChanged,
	passwordSecondChanged,
	registerUser,
	resetRoute,
	clearErrors
} from '../actions';
import { Input, Button, Message } from './common';

class RegisterForm extends Component {

	componentWillMount() {
		this.props.resetRoute();
	}

	componentWillUnmount() {
		this.props.resetRoute();
		this.props.clearErrors();
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
			</View>
		);
	}

}

const MapStateToProps = (state) => {
	const { loading, email, password, passwordSecond } = state.auth;
	const { error } = state.errors;
	return { error, loading, email, password, passwordSecond };
};

export default connect(MapStateToProps,
	{ emailChanged, passwordChanged, passwordSecondChanged, registerUser, resetRoute, clearErrors }
)(RegisterForm);
