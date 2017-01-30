import React from 'react';
import { Platform } from 'react-native';
import { Icon } from 'native-base';
import { Scene, Router, Actions } from 'react-native-router-flux';
import LoginForm from './components/LoginForm';
import FavoriteList from './components/FavoriteList';
import AddFavorite from './components/AddFavorite';
import ShowDepartures from './components/ShowDepartures';
import RegisterForm from './components/RegisterForm';
import ShowNearbyStops from './components/ShowNearbyStops';
import ResetPassword from './components/ResetPassword';
import SplashScreen from './components/SplashScreen';

const NavbarColor = () => {
	return (Platform.OS === 'ios') ? '#F8F8F8' : '#039BE5';
};

const NavbarTextColor = () => {
	return (Platform.OS === 'ios') ? '#000000' : '#ffffff';
};

const RouterComponent = () => {
	return (
		<Router
			sceneStyle={{ paddingTop: 60 }}
			titleStyle={{ color: NavbarTextColor() }}
			navigationBarStyle={{ backgroundColor: NavbarColor() }}
			rightButtonTextStyle={{ color: NavbarTextColor() }}
			barButtonIconStyle={{ tintColor: NavbarTextColor() }}
		>
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
					getLeftTitle={() => {
						return <Icon name="ios-navigate" style={{ color: '#fff' }} />;
					}}
					onLeft={() => Actions.listNearbyStops()}
					getRightTitle={() => <Icon name="ios-add-circle" style={{ color: '#fff' }} />}
					onRight={() => Actions.addfav()}
					key="favlist"
					component={FavoriteList}
					title="Mina Hållplatser"
					panHandlers={null}
					initial
				/>
				<Scene key="addfav" component={AddFavorite} title="Lägg till favorit" />
				<Scene key="departures" component={ShowDepartures} title="" />
				<Scene key="listNearbyStops" component={ShowNearbyStops} title="Hållplatser nära dig" />
			</Scene>
		</Router>
	);
};

export default RouterComponent;
