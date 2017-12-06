import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Scene, Router, Actions } from 'react-native-router-flux';
import LoginForm from './components/LoginForm';
import FavoriteList from './components/FavoriteList';
import ShowDepartures from './components/ShowDepartures';
import RegisterForm from './components/RegisterForm';
import ResetPassword from './components/ResetPassword';
import SplashScreen from './components/SplashScreen';
import { Spinner } from './components/common';
import { colors } from './components/style';
import { isAndroid } from './components/helpers';
import { store } from './App';
import { CLR_ERROR } from './actions/types';

const iconSize = 24;

const onBackAndroid = () => {
	Actions.pop();
	return true;
};

const RouterComponent = () => (
	<Router
		backAndroidHandler={onBackAndroid}
		titleStyle={{
			color: colors.alternative,
			alignSelf: 'center',
			fontSize: 14,
			fontFamily: (isAndroid()) ? 'sans-serif' : 'System'
		}}
		navigationBarStyle={{ backgroundColor: colors.primary, paddingHorizontal: 10 }}
		rightButtonTextStyle={{ color: colors.alternative }}
		leftButtonTextStyle={{ color: colors.alternative }}
		renderBackButton={() => {
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
					onBack={async () => {
						await store.dispatch({ type: CLR_ERROR });
						Actions.auth({ type: 'reset' });
					}}
				/>
				<Scene key="resetpw" component={ResetPassword} title="Glömt lösenord" />
			</Scene>
			<Scene key="dashboard">
				<Scene
					left={() => {
						return (
							<Icon
								name="ios-create"
								style={{ color: colors.alternative, fontSize: iconSize }}
								onPress={async () => {
									await store.dispatch({ type: CLR_ERROR });
									Actions.refresh({ editing: this.editing = !this.editing });
								}}
							/>
						);
					}}
					key="favlist"
					component={FavoriteList}
					title="Mina Hållplatser"
					initial
				/>
				<Scene key="departures" component={ShowDepartures} title="Avgångar" />
			</Scene>
		</Scene>
	</Router>
);

export default RouterComponent;
