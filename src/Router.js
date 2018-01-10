import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Scene, Router, Actions, Stack, Drawer } from 'react-native-router-flux';
import LoginForm from './components/LoginForm';
import FavoriteList from './components/FavoriteList';
import ShowDepartures from './components/ShowDepartures';
import RegisterForm from './components/RegisterForm';
import ResetPassword from './components/ResetPassword';
import SplashScreen from './components/SplashScreen';
import Menu from './components/Menu';
import { colors } from './components/style';
import { isAndroid, track, showMessage, globals } from './components/helpers';
import { store } from './App';
import { CLR_ERROR } from './actions/types';

const iconSize = 24;

const onBackAndroid = () => {
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

const renderBackButton = () => {
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
					name="ios-arrow-back"
					style={{ color: colors.alternative, fontSize: iconSize }}
				/>
			</View>
		</TouchableWithoutFeedback>
	);
};

export const renderHelpButton = (self) => {
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
				<MaterialIcons 
					name="live-help"
					style={{ color: colors.alternative, fontSize: iconSize }}
				/>
			</View>
		</TouchableWithoutFeedback>
	);
};

const RouterComponent = () => (
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
		renderBackButton={renderBackButton}
	>
		<Stack key="root" hideNavBar>
			<Scene key="splash" component={SplashScreen} hideNavBar />
			<Drawer
				key="dashboard"
				contentComponent={Menu}
				drawerIcon={<Icon name="ios-menu" size={iconSize} style={{ color: colors.alternative }} />}
				drawerWidth={225}
			>
				<Scene
					key="favlist"
					component={FavoriteList}
					title="Mina Hållplatser"
					right={renderHelpButton}
				/>
				<Scene
					key="departures"
					component={ShowDepartures}
					hideDrawerButton
					right={renderHelpButton}
					left={renderBackButton}
				/>
				<Scene key="auth">
					<Scene
						key="login"
						component={LoginForm}
						hideNavBar
						hideDrawerButton
						drawerLockMode={'locked-closed'}
						title="Logga in"
						left={renderBackButton}
						onEnter={() => {
							track('Page View', { Page: 'Login' });
							globals.shouldExitApp = false;
						}}
					/>
					<Scene
						key="register"
						component={RegisterForm}
						hideDrawerButton
						drawerLockMode={'locked-closed'}
						title="Registrera"
						left={renderBackButton}
						onEnter={() => track('Page View', { Page: 'Register' })}
					/>
					<Scene
						key="resetpw"
						component={ResetPassword}
						hideDrawerButton
						drawerLockMode={'locked-closed'}
						title="Glömt lösenord"
						left={renderBackButton}
						onEnter={() => track('Page View', { Page: 'Reset Password' })}
					/>
				</Scene>
			</Drawer>
		</Stack>
	</Router>
);

export default RouterComponent;
