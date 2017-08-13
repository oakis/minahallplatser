import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../style';

export const Message = ({ type, message }) => {
    const style = {
        view: {
            alignSelf: 'stretch',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
            margin: 15,
            backgroundColor: colors[type],
            borderRadius: 3,
            elevation: 5,
            shadowRadius: 5,
            shadowColor: colors.smoothBlack,
            shadowOffset: { width: 2.5, height: 2.5 },
            shadowOpacity: 0.5
        },
        text: {
            color: colors.alternative,
            fontSize: 12,
            alignSelf: 'center',
            flex: 1
        },
        icon: {
            marginRight: 20,
            marginLeft: 0,
            marginTop: 2,
            alignSelf: 'center'
        }
    };
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
            <View style={style.view}>
                {(type) ? <Icon name={getIcon(type)} size={20} style={style.icon} /> : null}
                <Text style={style.text}>{message}</Text>
            </View>
        );
    }
    return <View />;
};
