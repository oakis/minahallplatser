import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { store } from '../../App';
import { CLR_ERROR } from '../../actions/types';
import { Text } from '../common';
import { colors, component } from '../style';

export const Message = ({ type, message = '' }) => {
    const getIcon = (iconType) => {
        switch (iconType) {
            case 'info':
                return 'ios-information-circle';
            case 'success':
                return 'ios-checkmark-circle';
            case 'danger':
                return 'ios-alert';
            case 'warning':
                return 'ios-warning';
            default:
                return;
        }
    };
    if (message.length > 0) {
        return (
            <View style={[component.message.view, { backgroundColor: colors[type] }]}>
                {(type) ? <Icon name={getIcon(type)} size={20} style={component.message.icon} /> : null}
                <Text style={component.message.text}>{message}</Text>
                <Text style={{ fontSize: 10, fontWeight: 'bold' }} onPress={() => store.dispatch({ type: CLR_ERROR })}>Stäng</Text>
            </View>
        );
    }
    return <View />;
};
