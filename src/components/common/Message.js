import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, component } from '../style';

export const Message = ({ type, message }) => {
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
            </View>
        );
    }
    return <View />;
};
