import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import FavoriteList from './components/FavoriteList';
import ShowDepartures from './components/ShowDepartures';
import {colors} from '@style';
import {isAndroid} from '@helpers';

type RootStackParamList = {
  Dashboard: undefined;
  Departures: {
    route: {
      params: {
        id: string;
        title: string;
        parent: string;
        busStop: string;
      };
    };
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const headerOptions: NativeStackNavigationOptions = {
  headerStyle: {
    backgroundColor: colors.primary,
  },
  headerTintColor: colors.alternative,
  headerTitleAlign: 'center',
  headerTitleStyle: {
    fontSize: 14,
    fontFamily: isAndroid() ? 'sans-serif' : 'System',
  },
};

const Router = (): JSX.Element => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={FavoriteList}
        options={headerOptions}
      />
      <Stack.Screen
        name="Departures"
        component={ShowDepartures}
        options={headerOptions}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default Router;
