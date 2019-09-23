import { createStackNavigator, createAppContainer } from 'react-navigation';
import FavoriteList from './components/FavoriteList';
import ShowDepartures from './components/ShowDepartures';
import { colors } from './components/style';
import { isAndroid } from './components/helpers';

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
