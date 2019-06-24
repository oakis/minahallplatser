import { Navigation } from 'react-native-navigation';
import './src/setupLogging';
import './src/setupCrashlytics';
import FavoriteList from './src/components/FavoriteList';
import Menu from './src/components/Menu';
import factory from './src/setupStore';
import { colors } from './src/components/style';
import { isAndroid } from './src/components/helpers';

export const { store, persistor } = factory();

Navigation.registerComponent('minahallplatser.FavoriteList', () => FavoriteList);
Navigation.registerComponent('minahallplatser.Menu', () => Menu);

Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
        root: {
            sideMenu: {
                id: 'sideMenu',
                left: {
                    component: {
                        name: 'minahallplatser.Menu',
                        passProps: { store }
                    }
                },
                center: {
                    stack: {
                        children: [{
                            component: {
                                name: 'minahallplatser.FavoriteList',
                                passProps: { store, persistore: persistor }
                            },
                        }],
                        options: {
                            topBar: {
                                title: {
                                    text: 'Mina Hållplatser',
                                    color: colors.alternative,
                                    alignment: 'center',
                                    fontSize: 14,
                                    fontFamily: (isAndroid()) ? 'sans-serif' : 'System'
                                },
                                background: {
                                    color: colors.primary
                                },
                            }
                        }
                    }
                },
            },
        }
    });
});
