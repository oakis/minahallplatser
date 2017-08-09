import React, { Component } from 'react';
import { Text, Dimensions } from 'react-native';
import { Container, Content, Button, Input, InputGroup } from 'native-base';
import { connect } from 'react-redux';
import { emailChanged, resetUserPassword, resetRoute } from '../actions';
import { Spinner } from './common/Spinner';
import colors from './style/color';

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

	renderSpinner() {
		if (this.props.loading) {
			return <Spinner color="#fff" />;
		}

		return <Text>Återställ lösenord</Text>;
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

const mapStateToProps = ({ auth }) => {
	const { email, error, loading } = auth;
	return { email, error, loading };
};

const styles = {
	errorStyle: {
		fontSize: 20,
		alignSelf: 'center',
		color: 'red'
	}
};

export default connect(mapStateToProps,
	{ emailChanged, resetUserPassword, resetRoute }
)(ResetPassword);
