import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import FavoriteList from './components/FavoriteList';
import ShowDepartures from './components/ShowDepartures';
import { colors } from './components/style';
import { isAndroid } from './components/helpers';

const iconSize = 24;

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
					justifyContent: 'center',
					right: 5,
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

const StackNavigator = createStackNavigator(
	{
		Dashboard: FavoriteList,
		Departures: ShowDepartures,
	},{
		initialRouteName: 'Dashboard',
		defaultNavigationOptions: {
			headerStyle: {
				backgroundColor: colors.primary,
			},
			headerTintColor: colors.alternative,
			headerTitleStyle: {
				width: '100%',
				marginHorizontal: 'auto',
				alignSelf: 'center',
				textAlign: 'center',
				fontSize: 14,
				fontFamily: (isAndroid()) ? 'sans-serif' : 'System'
			},
		},
	},
);

export default createAppContainer(StackNavigator);
