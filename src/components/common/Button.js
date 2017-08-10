import React from 'react';
import { Text, TouchableOpacity, TouchableNativeFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { isAndroid } from '../helpers/device';
import { Spinner } from './Spinner';
import colors from '../style/color';

export const Button = ({ icon, iconSize = 24, label, color, fontColor = colors.smoothBlack, onPress, uppercase = false, loading }) => {

    function showSpinnerOrText() {
        if (loading) {
            return (
                <Spinner
					size="small"
					color={colors.alternative}
                />
            );
        }
        return (
            <Text
                style={{
                    marginLeft: (icon) ? 5 : 0,
                    fontWeight: 'bold',
                    //fontFamily: 'sans-serif-thin',
                    color: colors[fontColor]
                }}
            >
                {(uppercase) ? label.toUpperCase() : label}</Text>
        );
    }

    const buttonStyle = {
        alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 2,
        backgroundColor: colors[color],
        borderRadius: 3
    };

    function renderButton() {
        if (isAndroid()) {
            return (
                <TouchableNativeFeedback
                    style={buttonStyle}
                    onPress={onPress}
                >
                    <Icon name={icon} size={iconSize} />
                    {showSpinnerOrText()}
                </TouchableNativeFeedback>
            );
        }
        return (
            <TouchableOpacity
                style={buttonStyle}
                onPress={onPress}
            >
                <Icon name={icon} size={iconSize} />
                {showSpinnerOrText()}
            </TouchableOpacity>
        );
    }

    return renderButton();
};
