import React, { Component } from 'react';
import { TouchableWithoutFeedback, View, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Scene, Router, Actions, Stack, Drawer } from 'react-native-router-flux';
import { connect } from 'react-redux';
import FavoriteList from './components/FavoriteList';
import ShowDepartures from './components/ShowDepartures';
import Menu from './components/Menu';
import { colors } from './components/style';
import { isAndroid, showMessage, globals } from './components/helpers';
import { store } from './App';
import { CLR_ERROR } from './actions/types';
import { autoLogin, loginAnonUser } from './actions';


const iconSize = 24;

export const onBackAndroid = () => {
	if (Actions.currentScene === 'login' || Actions.currentScene === '_favlist') {
		if (globals.shouldExitApp === false) {
			showMessage('short', 'Backa en gång till för att stänga appen');
			globals.shouldExitApp = true;
			return true;
		}
		globals.shouldExitApp = false;
		return false;
	}
	Actions.pop();
	return true;
};

export const BackButton = () => {
	return (
		<TouchableWithoutFeedback
			onPress={async () => {
				await store.dispatch({ type: CLR_ERROR });
				Actions.pop();
			}}
		>
			<View
				style={{
					width: 30,
					height: 30,
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<Icon
					name="keyboard-arrow-left"
					style={{ color: colors.alternative, fontSize: iconSize }}
				/>
			</View>
		</TouchableWithoutFeedback>
	);
};

export const HelpButton = (self) => {
	return (
		<TouchableWithoutFeedback
			onPress={self.openPopup}
		>
			<View
				style={{
					width: 30,
					height: 30,
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<Icon
					name="live-help"
					style={{ color: colors.alternative, fontSize: iconSize }}
				/>
			</View>
		</TouchableWithoutFeedback>
	);
};

class RouterComponent extends Component {

	render() {
		return (
			<View style={{ flex: 1 }}>
				<StatusBar
					backgroundColor={colors.primary}
					barStyle="light-content"
				/>
				<Router
					backAndroidHandler={onBackAndroid}
					headerTitleStyle={{
						color: colors.alternative,
						alignSelf: 'center',
						fontSize: 14,
						fontFamily: (isAndroid()) ? 'sans-serif' : 'System'
					}}
					navigationBarStyle={{ backgroundColor: colors.primary, paddingHorizontal: 10 }}
					rightButtonTextStyle={{ color: colors.alternative }}
					leftButtonTextStyle={{ color: colors.alternative }}
					renderBackButton={BackButton}
				>
					<Stack key="root" hideNavBar>
						<Drawer
							key="dashboard"
							contentComponent={Menu}
							drawerIcon={<Icon name="menu" size={iconSize} style={{ color: colors.alternative }} />}
							drawerWidth={225}
						>
							<Scene
								key="favlist"
								component={FavoriteList}
								title="Mina Hållplatser"
								right={HelpButton}
							/>
							<Scene
								key="departures"
								component={ShowDepartures}
								hideDrawerButton
								right={HelpButton}
								left={BackButton}
							/>
						</Drawer>
					</Stack>
				</Router>
			</View>
		);
	}
}

export default connect(null, { autoLogin, loginAnonUser })(RouterComponent);
