import React, { Component } from 'react';
import { TouchableWithoutFeedback, View, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Scene, Router, Actions, Stack, Drawer } from 'react-native-router-flux';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import LoginForm from './components/LoginForm';
import FavoriteList from './components/FavoriteList';
import ShowDepartures from './components/ShowDepartures';
import RegisterForm from './components/RegisterForm';
import ResetPassword from './components/ResetPassword';
import SplashScreen from './components/SplashScreen';
import Menu from './components/Menu';
import Settings from './components/Settings';
import Profile from './components/Profile';
import { colors } from './components/style';
import { isAndroid, track, showMessage, globals, getStorage } from './components/helpers';
import store from './setupStore';
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
					name="ios-arrow-back"
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
				<MaterialIcons 
					name="live-help"
					style={{ color: colors.alternative, fontSize: iconSize }}
				/>
			</View>
		</TouchableWithoutFeedback>
	);
};

class RouterComponent extends Component {
	
	componentDidMount() {
		// Try to automaticly login
		track('App Start');
		firebase.auth().onAuthStateChanged((fbUser) => {
			const actualUser = fbUser === null
				? null
				: { email: fbUser.email,
					isAnonymous: fbUser.isAnonymous,
					metadata: fbUser.metadata,
					providerId: fbUser.providerId,
					uid: fbUser.uid,
				};
			getStorage('minahallplatser-user')
			.then((user) => {
				window.log('onAuthStateChanged(): Localstorage user:', user, 'Firebase user:', actualUser);
				if (actualUser && actualUser.uid && globals.isLoggingIn) {
					window.log('User already exists, continue to autologin.');
					track('Auth State Changed', { Message: 'AutoLogin' });
					globals.isLoggingIn = false;
					this.props.autoLogin(actualUser);
				} else if (globals.didLogout && !globals.isLoggingIn) {
					window.log('User logged out.');
					track('Auth State Changed', { Message: 'Logged out' });
					Actions.login();
					globals.didLogout = false;
					globals.isLoggingIn = true;
				} else if (globals.isLoggingIn) {
					window.log('New user, creating anonymous account.');
					track('Auth State Changed', { Message: 'Create anonymous account' });
					this.props.loginAnonUser();
					globals.isLoggingIn = false;
				}
			})
			.catch((err) => {
				window.log('Something went wrong:', err);
				Actions.login();
			});
		}, (err) => {
			window.log('Something went wrong:', err);
			Actions.login();
		});
	}

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
								right={HelpButton}
							/>
							<Scene
								key="departures"
								component={ShowDepartures}
								hideDrawerButton
								right={HelpButton}
								left={BackButton}
							/>
							<Scene
								key="settings"
								component={Settings}
								title="Inställningar"
								hideDrawerButton
								left={BackButton}
							/>
							<Scene
								key="profile"
								component={Profile}
								title="Profil"
								hideDrawerButton
								left={BackButton}
							/>
							<Scene key="auth">
								<Scene
									key="login"
									component={LoginForm}
									hideNavBar
									hideDrawerButton
									drawerLockMode="locked-closed"
									title="Logga in"
									left={BackButton}
									onEnter={() => {
										track('Page View', { Page: 'Login' });
										globals.shouldExitApp = false;
									}}
								/>
								<Scene
									key="register"
									component={RegisterForm}
									hideDrawerButton
									drawerLockMode="locked-closed"
									title="Registrera"
									left={BackButton}
									onEnter={() => track('Page View', { Page: 'Register' })}
								/>
								<Scene
									key="resetpw"
									component={ResetPassword}
									hideDrawerButton
									drawerLockMode="locked-closed"
									title="Glömt lösenord"
									left={BackButton}
									onEnter={() => track('Page View', { Page: 'Reset Password' })}
								/>
							</Scene>
						</Drawer>
					</Stack>
				</Router>
			</View>
		);
	}
}

export default connect(null, { autoLogin, loginAnonUser })(RouterComponent);
