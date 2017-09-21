import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { emailChanged, resetUserPassword, resetRoute, clearErrors } from '../actions';
import { Input, Button, Message } from './common';

class ResetPassword extends Component {

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

	onButtonPress = () => {
		this.props.loading = true;
		const { email } = this.props;
		this.props.resetUserPassword(email);
	}

	render() {
		return (
			<TouchableWithoutFeedback
				onPress={() => Keyboard.dismiss()}
			>
				<View
					style={{
						flex: 1,
						marginLeft: 10,
						marginRight: 10,
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center'
					}}
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
					<Button
						loading={this.props.loading}
						uppercase
						color="primary"
						label="Återställ lösenord"
						onPress={this.onButtonPress}
					/>
				</View>
			</TouchableWithoutFeedback>
		);
	}

}

const mapStateToProps = ({ auth, errors }) => {
	const { email, loading } = auth;
	const { error } = errors;
	return { email, error, loading };
};

export default connect(mapStateToProps,
	{ emailChanged, resetUserPassword, resetRoute, clearErrors }
)(ResetPassword);
