import React from 'react';
import { Platform } from 'react-native';
import { Icon } from 'native-base';
import { Scene, Router, Actions, Schema } from 'react-native-router-flux';
import LoginForm from './components/LoginForm';
import FavoriteList from './components/FavoriteList';
import AddFavorite from './components/AddFavorite';
import ShowDepartures from './components/ShowDepartures';
import RegisterForm from './components/RegisterForm';
import ShowNearbyStops from './components/ShowNearbyStops';
import ResetPassword from './components/ResetPassword';
import SplashScreen from './components/SplashScreen';

const NavbarColor = () => {
	return (Platform.OS === 'ios') ? '#007AFF' : '#779ECB';
};

const NavbarTextColor = () => {
	return '#ffffff';
};

const RouterComponent = () => (
	<Router
		titleStyle={{ color: NavbarTextColor(), alignSelf: 'center' }}
		navigationBarStyle={{ backgroundColor: NavbarColor(), paddingHorizontal: 10 }}
		rightButtonTextStyle={{ color: NavbarTextColor() }}
		barButtonIconStyle={{ tintColor: NavbarTextColor() }}
		leftButtonTextStyle={{ color: NavbarTextColor() }}
	>
		<Scene key="root" hideNavBar='true'>
			<Scene key="splash" component={SplashScreen} hideNavBar='true' />
			<Scene key="auth">
				<Scene key="login" component={LoginForm} title="Inloggning" initial />
				<Scene
					key="register"
					component={RegisterForm}
					title="Registrera"
					onBack={() => Actions.login({ type: 'reset' })}
				/>
				<Scene key="resetpw" component={ResetPassword} title="Glömt lösenord" />
			</Scene>
			<Scene key="dashboard">
				<Scene
					renderRightButton={() => {
						return <Icon name="ios-navigate" style={{ color: '#fff' }} onPress={() => Actions.listNearbyStops()} />;
					}}
					renderLeftButton={() => {
						return <Icon name="ios-add-circle" style={{ color: '#fff' }} onPress={() => Actions.addfav()} />;
					}}
					key="favlist"
					component={FavoriteList}
					title="Mina Hållplatser"
					panHandlers={null}
					initial
				/>
				<Scene key="addfav" component={AddFavorite} title="Lägg till favorit" />
				<Scene key="departures" component={ShowDepartures} title="Avgångar" />
				<Scene key="listNearbyStops" component={ShowNearbyStops} title="Hållplatser nära dig" />
			</Scene>
		</Scene>
	</Router>
);

export default RouterComponent;
