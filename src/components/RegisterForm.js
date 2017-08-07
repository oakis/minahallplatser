import React, { Component } from 'react';
import { Text, Dimensions } from 'react-native';
import { Container, Content, Button, Input, InputGroup, Spinner } from 'native-base';
import { connect } from 'react-redux';
import {
	emailChanged,
	passwordChanged,
	passwordSecondChanged,
	registerUser,
	resetRoute
} from '../actions';
import minahallplatser from '../themes/minahallplatser';

class RegisterForm extends Component {
	
	componentWillMount() {
		this.props.resetRoute();
	}

	componentWillUnmount() {
		this.props.resetRoute();
	}

	onEmailChange(text) {
		this.props.emailChanged(text);
	}

	onPasswordChange(text) {
		this.props.passwordChanged(text);
	}

	onPasswordSecondChange(text) {
		this.props.passwordSecondChanged(text);
	}

	onButtonPress() {
		this.props.loading = true;
		const { email, password, passwordSecond } = this.props;
		this.props.registerUser({ email, password, passwordSecond });
	}

	renderSpinner() {
		if (this.props.loading) {
			return <Spinner color="#fff" />;
		}

		return 'Registrera';
	}

	render() {
		const width = Dimensions.get('window').width * 0.8;
		const styles = {
			errorStyle: {
				fontSize: 20,
				textAlign: 'center',
				color: 'red',
				width
			}
		};
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

					<InputGroup borderType="underline" style={{ width }}>
						<Input
							secureTextEntry
							placeholder="lösenord igen"
							label="Lösenord"
							onChangeText={this.onPasswordSecondChange.bind(this)}
							value={this.props.passwordSecond}
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

				</Content>
			</Container>
		);
	}

}

const MapStateToProps = (state) => {
	const { error, loading, email, password, passwordSecond } = state.auth;
	return { error, loading, email, password, passwordSecond };
};

export default connect(MapStateToProps,
	{ emailChanged, passwordChanged, passwordSecondChanged, registerUser, resetRoute }
)(RegisterForm);
