import React from 'react';
import { Text, TouchableOpacity, TouchableNativeFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { isAndroid } from '../helpers';
import { Spinner } from './Spinner';
import { colors } from '../style';

export const Button = ({ icon, iconSize = 24, label, color, fontColor = 'alternative', onPress, uppercase = false, loading }) => {
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
                    fontFamily: (isAndroid()) ? 'sans-serif-thin' : 'System',
                    color: colors[fontColor]
                }}
            >
                {(uppercase) ? label.toUpperCase() : label}
            </Text>
        );
    }

    const buttonStyle = {
        alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 5,
        backgroundColor: colors[color],
        borderRadius: 3,
        elevation: 1,
        shadowRadius: 1,
        shadowColor: colors.smoothBlack,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5
    };

    function renderButton() {
        if (isAndroid()) {
            return (
                <TouchableNativeFeedback
                    onPress={onPress}
                >
                    <View style={buttonStyle}>
                        <Icon name={icon} size={iconSize} />
                        {showSpinnerOrText()}
                    </View>
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
