import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Scene, Router, Actions, ActionConst, Drawer } from 'react-native-router-flux';
import LoginForm from './components/LoginForm';
import FavoriteList from './components/FavoriteList';
import ShowDepartures from './components/ShowDepartures';
import RegisterForm from './components/RegisterForm';
import ResetPassword from './components/ResetPassword';
import SplashScreen from './components/SplashScreen';
import Menu from './components/Menu';
import { Spinner } from './components/common';
import { colors } from './components/style';
import { isAndroid, track, showMessage, globals } from './components/helpers';
import { store } from './App';
import { CLR_ERROR } from './actions/types';

const iconSize = 24;

const onBackAndroid = () => {
	if (Actions.currentScene == 'login' || Actions.currentScene == '_favlist') {
		if (globals.shouldExitApp === false) {
			showMessage('short', 'Backa en gång till för att stänga appen');
			globals.shouldExitApp = true;
			return true;
		} else {
			globals.shouldExitApp = false;
			return false;
		}

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
}

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
		<Scene key="root" hideNavBar='true'>
			<Scene key="splash" component={SplashScreen} hideNavBar='true' />
			<Scene key="auth">
				<Scene key="login" component={LoginForm} hideNavBar='true' onEnter={() => {
					track('Page View', { Page: 'Login' });
					globals.shouldExitApp = false;
				}} />
				<Scene
					key="register"
					component={RegisterForm}
					title="Registrera"
					onBack={async () => {
						await store.dispatch({ type: CLR_ERROR });
						Actions.auth({ type: 'reset' });
					}}
					onEnter={() => track('Page View', { Page: 'Register' })}
				/>
				<Scene key="resetpw" component={ResetPassword} title="Glömt lösenord" onEnter={() => track('Page View', { Page: 'Reset Password' })} />
			</Scene>
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
					initial
				/>
				<Scene key="departures" component={ShowDepartures} hideDrawerButton left={renderBackButton} />
			</Drawer>
		</Scene>
	</Router>
);

export default RouterComponent;
