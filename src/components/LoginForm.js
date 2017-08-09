import React, { Component } from 'react';
import { Text, Dimensions } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Container, Content, Button, Input, InputGroup } from 'native-base';
import { connect } from 'react-redux';
import { emailChanged, passwordChanged, loginUser, resetRoute, autoLogin } from '../actions';
import { Spinner } from './common/Spinner';
import colors from './style/color';

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

	renderSpinner() {
		if (this.props.loading) {
			return (
				<Spinner
					size="small"
					color={colors.alternative}
				/>
			);
		}

		return <Text>Logga in</Text>;
	}

	render() {
		const width = Dimensions.get('window').width * 0.8;
		return (
			<Container>
				<Content
					contentContainerStyle={{
						flex: 1,
						flexDirection: 'column',
						justifyContent: 'flex-start',
						alignItems: 'center'
					}}
					keyboardShouldPersistTaps="always"
					keyboardDismissMode="on-drag"
				>
					<InputGroup borderType="underline" style={{ width }}>
						<Input
							placeholder="din@email.se"
							label="Email"
							keyboardType="email-address"
							autoFocus
							returnKeyType="next"
							onChangeText={this.onEmailChange.bind(this)}
							value={this.props.email}
						/>
					</InputGroup>

					<InputGroup borderType="underline" style={{ width }}>
						<Input
							secureTextEntry
							placeholder="ditt lösenord"
							label="Lösenord"
							onChangeText={this.onPasswordChange.bind(this)}
							value={this.props.password}
						/>
					</InputGroup>

					<Button
						primary
						block
						capitalize
						onPress={this.onButtonPress.bind(this)}
						style={{ width, marginTop: 10, alignSelf: 'center' }}
					>
						{this.renderSpinner()}
					</Button>

					<Text style={styles.errorStyle}>
						{this.props.error}
					</Text>

					<Text style={{ fontSize: 18, marginTop: 10 }} onPress={() => Actions.resetpw()}>
						Glömt lösenord?
					</Text>
					<Text style={{ fontSize: 18, marginTop: 10 }} onPress={() => Actions.register()}>
						Har du inget konto? Registrera HÄR.
					</Text>

				</Content>
			</Container>
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
