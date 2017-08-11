import React from 'react';
import { View, Text } from 'react-native';
import colors from '../style/color';

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
            elevation: 5
        },
        text: {
            color: colors.alternative
        }
    };
    if (message.length > 0) {
        return (
            <View style={style.view}>
                <Text style={style.text}>{message}</Text>
            </View>
        );
    }
    return <View />;
};
