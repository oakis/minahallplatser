import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, Text, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { emailChanged, resetUserPassword, resetRoute } from '../actions';
import { Input, Button } from './common';

class ResetPassword extends Component {

	componentWillMount() {
		this.props.resetRoute();
	}

	onEmailChange(text) {
		this.props.emailChanged(text);
	}

	onButtonPress() {
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
					<Input
						placeholder="din@email.se"
						keyboardType="email-address"
						returnKeyType="next"
						onChangeText={this.onEmailChange.bind(this)}
						value={this.props.email}
						icon="ios-mail"
					/>

					<Button
						loading={this.props.loading}
						uppercase
						color="primary"
						label="Återställ lösenord"
						onPress={this.onButtonPress.bind(this)}
						fontColor="alternative"
					/>

					<Text style={styles.errorStyle}>
						{this.props.error}
					</Text>
				</View>
			</TouchableWithoutFeedback>
		);
	}

}

const mapStateToProps = ({ auth }) => {
	const { email, error, loading } = auth;
	return { email, error, loading };
};

const styles = {
	errorStyle: {
		fontSize: 12,
		alignSelf: 'center',
		color: 'red'
	}
};

export default connect(mapStateToProps,
	{ emailChanged, resetUserPassword, resetRoute }
)(ResetPassword);
