import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Scene, Router, Actions } from 'react-native-router-flux';
import LoginForm from './components/LoginForm';
import FavoriteList from './components/FavoriteList';
import AddFavorite from './components/AddFavorite';
import ShowDepartures from './components/ShowDepartures';
import RegisterForm from './components/RegisterForm';
import ShowNearbyStops from './components/ShowNearbyStops';
import ResetPassword from './components/ResetPassword';
import SplashScreen from './components/SplashScreen';
import colors from './components/style/color';

const iconSize = 24;

const RouterComponent = () => (
	<Router
		titleStyle={{ color: colors.alternative, alignSelf: 'center', fontSize: 14 }}
		navigationBarStyle={{ backgroundColor: colors.primary, paddingHorizontal: 10 }}
		rightButtonTextStyle={{ color: colors.alternative }}
		leftButtonTextStyle={{ color: colors.alternative }}
		renderBackButton={() => {
			return (
				<TouchableWithoutFeedback
					onPress={() => Actions.pop()}
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
		}}
	>
		<Scene key="root" hideNavBar='true'>
			<Scene key="splash" component={SplashScreen} hideNavBar='true' />
			<Scene key="auth">
				<Scene key="login" component={LoginForm} hideNavBar='true' />
				<Scene
					key="register"
					component={RegisterForm}
					title="Registrera"
					onBack={() => Actions.auth({ type: 'reset' })}
				/>
				<Scene key="resetpw" component={ResetPassword} title="Glömt lösenord" />
			</Scene>
			<Scene key="dashboard">
				<Scene
					renderRightButton={() => {
						return <Icon name="ios-navigate" style={{ color: colors.alternative, fontSize: iconSize }} onPress={() => Actions.listNearbyStops()} />;
					}}
					renderLeftButton={() => {
						return <Icon name="ios-add-circle" style={{ color: colors.alternative, fontSize: iconSize }} onPress={() => Actions.addfav()} />;
					}}
					key="favlist"
					component={FavoriteList}
					title="Mina Hållplatser"
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
