import React from 'react';
import { TouchableOpacity, TouchableNativeFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { isAndroid } from '../helpers';
import { Text, Spinner } from './';
import { colors, component } from '../style';

export const Button = ({ icon, iconSize = 24, label, color, fontColor = 'alternative', onPress, uppercase = false, loading }) => {
    function showSpinnerOrText() {
        if (loading) {
            return (
                <Spinner
					size="small"
					color={colors[fontColor]}
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

    function renderButton() {
        if (isAndroid()) {
            return (
                <TouchableNativeFeedback
                    onPress={onPress}
                >
                    <View style={[component.button, { backgroundColor: colors[color] }]}>
                        <Icon name={icon} size={iconSize} />
                        {showSpinnerOrText()}
                    </View>
                </TouchableNativeFeedback>
            );
        }
        return (
            <TouchableOpacity
                style={[component.button, { backgroundColor: colors[color] }]}
                onPress={onPress}
            >
                <Icon name={icon} size={iconSize} />
                {showSpinnerOrText()}
            </TouchableOpacity>
        );
    }

    return renderButton();
};
