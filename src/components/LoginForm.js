import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { emailChanged, passwordChanged, loginUser, resetRoute, autoLogin } from '../actions';
import { Input } from './common/Input';
import { Button } from './common/Button';

class LoginForm extends Component {

	componentWillMount() {
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

				<Text style={styles.errorStyle}>
					{this.props.error}
				</Text>

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
					onPress={() => Actions.register()}
				/>
				<Button
					fontColor="primary"
					label="Glömt lösenord"
					onPress={() => Actions.resetpw()}
				/>

			</View>
		);
	}

}

const mapStateToProps = ({ auth }) => {
	const { email, password, error, loading, token } = auth;
	return { email, password, error, loading, token };
};

const styles = {
	errorStyle: {
		fontSize: 20,
		alignSelf: 'center',
		color: 'red'
	}
};

export default connect(mapStateToProps, {
	emailChanged, passwordChanged, loginUser, resetRoute, autoLogin
})(LoginForm);
