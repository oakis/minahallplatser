import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ImageBackground } from 'react-native';
import { Spinner, Text } from './common';
import { colors } from './style';
import { track } from './helpers';

class SplashScreen extends Component {

	componentDidMount() {
		track('App Start');
	}

	render() {
		return (
			<ImageBackground
				source={{ uri: 'https://www.w3schools.com/css/img_fjords.jpg' }}
				style={{
					flex: 1
				}}
			>
				<View
					style={{
						backgroundColor: 'rgba(255,255,255,0.7)',
						flex: 1,
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					{/* Mina hållplatser logo, custom 'spinner' under logo (brummande buss t.ex) */}
					<Text style={{ marginBottom: 10, opacity: 1 }}>Mina Hållplatser</Text>
					<Spinner
						size="large"
						color={colors.primary}
						noFlex
					/>
				</View>
			</ImageBackground>
		);
	}

}

const mapStateToProps = state => {
	window.log('SplashScreen', state);
	return {};
};

export default connect(mapStateToProps, null)(SplashScreen);
