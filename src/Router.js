import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FavoriteList from '@components/FavoriteList';
import ShowDepartures from '@components/ShowDepartures';
import {colors} from '@style';
import {isAndroid} from '@helpers';

const Stack = createNativeStackNavigator();

const headerOptions = {
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
    fontFamily: isAndroid() ? 'sans-serif' : 'System',
  },
};

const Router = () => (
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
