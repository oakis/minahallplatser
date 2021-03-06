import React from 'react';
import { configure } from 'enzyme';
import { stub } from 'sinon';
import Adapter from 'enzyme-adapter-react-16';

jest.mock('react-native', () => {
    const createMockComponent = (name) => {
        const mockedComponent = ({ children }) => (
            <div>{children}</div>
        );
        mockedComponent.displayName = name;
        return mockedComponent;
    };

    return {
        ActivityIndicator: createMockComponent('ActivityIndicator'),
        ART: createMockComponent('ART'),
        Button: createMockComponent('Button'),
        CheckBox: createMockComponent('CheckBox'),
        DatePickerIOS: createMockComponent('DatePickerIOS'),
        DrawerLayoutAndroid: createMockComponent('DrawerLayoutAndroid'),
        FlatList: createMockComponent('FlatList'),
        Image: createMockComponent('Image'),
        ImageBackground: createMockComponent('ImageBackground'),
        ImageEditor: createMockComponent('ImageEditor'),
        ImageStore: createMockComponent('ImageStore'),
        KeyboardAvoidingView: createMockComponent('KeyboardAvoidingView'),
        ListView: createMockComponent('ListView'),
        MaskedViewIOS: createMockComponent('MaskedViewIOS'),
        Modal: createMockComponent('Modal'),
        NavigatorIOS: createMockComponent('NavigatorIOS'),
        Picker: createMockComponent('Picker'),
        PickerIOS: createMockComponent('PickerIOS'),
        ProgressBarAndroid: createMockComponent('ProgressBarAndroid'),
        ProgressViewIOS: createMockComponent('ProgressViewIOS'),
        SafeAreaView: createMockComponent('SafeAreaView'),
        ScrollView: createMockComponent('ScrollView'),
        SectionList: createMockComponent('SectionList'),
        SegmentedControlIOS: createMockComponent('SegmentedControlIOS'),
        Slider: createMockComponent('Slider'),
        SnapshotViewIOS: createMockComponent('SnapshotViewIOS'),
        Switch: createMockComponent('Switch'),
        RefreshControl: createMockComponent('RefreshControl'),
        StatusBar: createMockComponent('StatusBar'),
        SwipeableFlatList: createMockComponent('SwipeableFlatList'),
        SwipeableListView: createMockComponent('SwipeableListView'),
        TabBarIOS: createMockComponent('TabBarIOS'),
        Text: createMockComponent('Text'),
        TextInput: createMockComponent('TextInput'),
        ToastAndroid: createMockComponent('ToastAndroid'),
        ToolbarAndroid: createMockComponent('ToolbarAndroid'),
        Touchable: createMockComponent('Touchable'),
        TouchableHighlight: createMockComponent('TouchableHighlight'),
        TouchableNativeFeedback: createMockComponent('TouchableNativeFeedback'),
        TouchableOpacity: createMockComponent('TouchableOpacity'),
        TouchableWithoutFeedback: createMockComponent('TouchableWithoutFeedback'),
        View: createMockComponent('View'),
        ViewPagerAndroid: createMockComponent('ViewPagerAndroid'),
        VirtualizedList: createMockComponent('VirtualizedList'),
        WebView: createMockComponent('WebView'),

        AccessibilityInfo: ({
            fetch: jest.fn(),
            addEventListener: jest.fn(),
            setAccessibilityFocus: jest.fn(),
            announceForAccessibility: jest.fn(),
            removeEventListener: jest.fn(),
        }),
        ActionSheetIOS: ({
            showActionSheetWithOptions: jest.fn(),
            showShareActionSheetWithOptions: jest.fn(),
        }),
        Alert: ({
            alert: jest.fn(),
        }),
        AlertIOS: ({
            alert: jest.fn(),
            prompt: jest.fn(),
        }),
        Animated: ({
            decay: jest.fn(),
            timing: () => ({ start: jest.fn(), }),
            spring: jest.fn(),
            add: jest.fn(),
            divide: jest.fn(),
            multiply: jest.fn(),
            modulo: jest.fn(),
            diffClamp: jest.fn(),
            delay: jest.fn(),
            sequence: jest.fn(),
            parallel: jest.fn(),
            stagger: jest.fn(),
            loop: jest.fn(),
            event: jest.fn(),
            forkEvent: jest.fn(),
            unforkEvent: jest.fn(),
            View: 'Animated.View'
        }),
        AppRegistry: ({
            setWrapperComponentProvider: jest.fn(),
            registerConfig: jest.fn(),
            registerComponent: jest.fn(),
            registerRunnable: jest.fn(),
            registerSection: jest.fn(),
            getAppKeys: jest.fn(),
            getSectionKeys: jest.fn(),
            getSections: jest.fn(),
            getRunnable: jest.fn(),
            getRegistry: jest.fn(),
            setComponentProviderInstrumentationHook: jest.fn(),
            runApplication: jest.fn(),
            unmountApplicationComponentAtRootTag: jest.fn(),
            registerHeadlessTask: jest.fn(),
            startHeadlessTask: jest.fn(),
        }),
        AppState: ({
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        }),
        AsyncStorage: ({
            getItem: jest.fn(),
            setItem: jest.fn(),
            removeItem: jest.fn(),
            mergeItem: jest.fn(),
            clear: jest.fn(() => Promise.resolve()),
            getAllKeys: jest.fn(),
            flushGetRequests: jest.fn(),
            multiGet: jest.fn(),
            multiSet: jest.fn(),
            multiRemove: jest.fn(),
            multiMerge: jest.fn(),
        }),
        BackAndroid: ({
            exitApp: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        }),
        BackHandler: ({
            exitApp: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        }),
        CameraRoll: ({
            saveToCameraRoll: jest.fn(),
            getPhotos: jest.fn(),
        }),
        Clipboard: ({
            getString: jest.fn(),
            setString: jest.fn(),
        }),
        DatePickerAndroid: ({
            open: jest.fn(),
            dateSetAction: jest.fn(),
            dismissedAction: jest.fn(),
        }),
        DeviceInfo: undefined,
        Dimensions: ({
            set: jest.fn(),
            get: () => ({ height: 1920 }),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        }),
        Easing: ({
            step0: jest.fn(),
            step1: jest.fn(),
            linear: jest.fn(),
            ease: jest.fn(),
            quad: jest.fn(),
            cubic: jest.fn(),
            poly: jest.fn(),
            sin: jest.fn(),
            circle: jest.fn(),
            exp: jest.fn(),
            elastic: jest.fn(),
            back: jest.fn(),
            bounce: jest.fn(),
            bezier: jest.fn(),
            in: jest.fn(),
            out: jest.fn(),
            inOut: jest.fn(),
        }),
        findNodeHandle: undefined,
        I18nManager: undefined,
        ImagePickerIOS: ({
            canRecordVideos: jest.fn(),
            canUseCamera: jest.fn(),
            openCameraDialog: jest.fn(),
            openSelectDialog: jest.fn(),
        }),
        InteractionManager: ({
            runAfterInteractions: jest.fn(),
            createInteractionHandle: jest.fn(),
            clearInteractionHandle: jest.fn(),
            setDeadline: jest.fn(),
        }),
        Keyboard: ({
            addListener: jest.fn(),
            removeListener: jest.fn(),
            removeAllListeners: jest.fn(),
            dismiss: jest.fn(),
        }),
        LayoutAnimation: ({
            configureNext: jest.fn(),
            create: jest.fn(),
            checkConfig: jest.fn(),
        }),
        Linking: ({
            constructor: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            openURL: jest.fn(),
            canOpenURL: jest.fn(),
            getInitialURL: jest.fn(),
        }),
        NativeEventEmitter: undefined,
        NetInfo: ({
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            fetch: jest.fn(),
            getConnectionInfo: jest.fn(),
            isConnectionExpensive: jest.fn(),
        }),
        PanResponder: ({
            create: jest.fn(),
        }),
        PermissionsAndroid: ({
            constructor: jest.fn(),
            checkPermission: jest.fn(),
            check: jest.fn(),
            requestPermission: jest.fn(),
            request: jest.fn(),
            requestMultiple: jest.fn(),
        }),
        PixelRatio: ({
            get: jest.fn(),
            getFontScale: jest.fn(),
            getPixelSizeForLayoutSize: jest.fn(),
            roundToNearestPixel: jest.fn(),
            startDetecting: jest.fn(),
        }),
        PushNotificationIOS: ({
            scheduleLocalNotification: jest.fn(),
            cancelAllLocalNotifications: jest.fn(),
            removeAllDeliveredNotifications: jest.fn(),
            getDeliveredNotifications: jest.fn(),
            removeDeliveredNotifications: jest.fn(),
            setApplicationIconBadgeNumber: jest.fn(),
            getApplicationIconBadgeNumber: jest.fn(),
            cancelLocalNotifications: jest.fn(),
            getScheduledLocalNotifications: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            requestPermissions: jest.fn(),
            abandonPermissions: jest.fn(),
            checkPermissions: jest.fn(),
            getInitialNotification: jest.fn(),
            constructor: jest.fn(),
            finish: jest.fn(),
            getMessage: jest.fn(),
            getSound: jest.fn(),
            getCategory: jest.fn(),
            getAlert: jest.fn(),
            getContentAvailable: jest.fn(),
            getBadgeCount: jest.fn(),
            getData: jest.fn(),
        }),
        Settings: ({
            get: jest.fn(),
            set: jest.fn(),
            watchKeys: jest.fn(),
            clearWatch: jest.fn(),
        }),
        Share: ({
            share: jest.fn(),
            sharedAction: jest.fn(),
            dismissedAction: jest.fn(),
        }),
        StatusBarIOS: undefined,
        StyleSheet: {
            setStyleAttributePreprocessor: jest.fn(),
            create: jest.fn((styles) => {
                return Object.keys(styles).reduce((acc, styleKey) => {
                    return Object.assign(acc, { [styleKey]: styleKey });
                }, {});
            }),
        },
        Systrace: ({
            installReactHook: jest.fn(),
            setEnabled: jest.fn(),
            isEnabled: jest.fn(),
            beginEvent: jest.fn(),
            endEvent: jest.fn(),
            beginAsyncEvent: jest.fn(),
            endAsyncEvent: jest.fn(),
            counterEvent: jest.fn(),
            attachToRelayProfiler: jest.fn(),
            swizzleJSON: jest.fn(),
            measureMethods: jest.fn(),
            measure: jest.fn(),
        }),
        TimePickerAndroid: ({
            open: jest.fn(),
            timeSetAction: jest.fn(),
            dismissedAction: jest.fn(),
        }),
        TVEventHandler: undefined,
        UIManager: undefined,
        unstable_batchedUpdates: undefined,
        Vibration: ({
            vibrate: jest.fn(),
            cancel: jest.fn(),
        }),
        VibrationIOS: ({
            vibrate: jest.fn(() => {
                console.warn('VibrationIOS is deprecated, use Vibration instead');
            }),
        }),
        YellowBox: ({
            ignoreWarnings: jest.fn(),
        }),
    };
});

jest.mock('react-native-gesture-handler', () => {
    const View = require('react-native/Libraries/Components/View/View');
    return {
        Swipeable: View,
        DrawerLayout: View,
        State: {},
        ScrollView: View,
        Slider: View,
        Switch: View,
        TextInput: View,
        ToolbarAndroid: View,
        ViewPagerAndroid: View,
        DrawerLayoutAndroid: View,
        WebView: View,
        NativeViewGestureHandler: View,
        TapGestureHandler: View,
        FlingGestureHandler: View,
        ForceTouchGestureHandler: View,
        LongPressGestureHandler: View,
        PanGestureHandler: View,
        PinchGestureHandler: View,
        RotationGestureHandler: View,
        /* Buttons */
        RawButton: View,
        BaseButton: View,
        RectButton: View,
        BorderlessButton: View,
        /* Other */
        FlatList: View,
        gestureHandlerRootHOC: jest.fn(),
        Directions: {},
    };
});

jest.mock('@react-native-community/async-storage', () => (
    {
        config: {
            storage: {
                getItem: jest.fn(),
                setItem: jest.fn(),
                removeItem: jest.fn(),
                mergeItem: jest.fn(),
                clear: jest.fn(() => Promise.resolve()),
                getAllKeys: jest.fn(),
                flushGetRequests: jest.fn(),
                multiGet: jest.fn(),
                multiSet: jest.fn(),
                multiRemove: jest.fn(),
                multiMerge: jest.fn(),
            }
        }
    }
));
jest.mock('redux-persist', () => ({
    persistReducer: () => jest.fn(),
    persistStore: () => jest.fn(),
}));
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcon');
jest.mock('react-native-device-info', () => {});
jest.mock('react-native-reanimated', () => ({
    decay: jest.fn(),
    timing: () => ({ start: jest.fn(), }),
    spring: jest.fn(),
    add: jest.fn(),
    divide: jest.fn(),
    multiply: jest.fn(),
    modulo: jest.fn(),
    diffClamp: jest.fn(),
    delay: jest.fn(),
    sequence: jest.fn(),
    parallel: jest.fn(),
    stagger: jest.fn(),
    loop: jest.fn(),
    event: jest.fn(),
    forkEvent: jest.fn(),
    unforkEvent: jest.fn(),
    Value: jest.fn(),
    View: 'Animated.View',
    Easing: ({
        step0: jest.fn(),
        step1: jest.fn(),
        linear: jest.fn(),
        ease: jest.fn(),
        quad: jest.fn(),
        cubic: jest.fn(),
        poly: jest.fn(),
        sin: jest.fn(),
        circle: jest.fn(),
        exp: jest.fn(),
        elastic: jest.fn(),
        back: jest.fn(),
        bounce: jest.fn(),
        bezier: jest.fn(),
        in: jest.fn(),
        out: jest.fn(),
        inOut: jest.fn(),
    })
}));
jest.mock('react-native-geolocation-service', () => {});
jest.mock('react-native-firebase', () => ({
    crashlytics: jest.fn().mockReturnThis(),
    log: jest.fn().mockReturnThis(),
    crash: jest.fn().mockReturnThis(),
    analytics: () => ({
        setCurrentScreen: jest.fn()
    }),
}));
jest.mock('react-navigation', () => ({
    createAppContainer: jest.fn(),
    createDrawerNavigator: jest.fn(),
    createStackNavigator: jest.fn(),
    navigate: jest.fn(),
}));

jest.mock('./components/helpers', () => ({
    globals: {},
    track: jest.fn(),
    isAndroid: jest.fn(),
    showMessage: jest.fn(),
    updateStopsCount: jest.fn(),
    getDeviceModel: jest.fn(),
    getOsVersion: jest.fn(),
    getAppVersion: jest.fn(),
    getToken: jest.fn().mockImplementation(() => ({
        finally: (fn) => {
            fn({ access_token: 123 });
        },
    })),
}));

jest.mock('./actions', () => ({
    auth: {
        autoLogin: stub(),
        loginAnonUser: stub(),
    }
}));

jest.mock('react-native-cancelable-fetch', () => jest.fn().mockImplementation(() => ({
    finally: stub().resolves({}),
    then: stub().resolves({}),
    catch: stub().rejects({}),
})));

if (typeof window !== 'object') {
    global.window = global;
    global.window.log = (msg) => console.log(msg);
}

console.error = () => {};

window.timeStart = jest.fn();
window.timeEnd = jest.fn();

configure({ adapter: new Adapter() });
