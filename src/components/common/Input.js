import React from 'react';
import { TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from './';
import { colors, component, metrics } from '../style';

export const Input = ({ value, label, icon, iconSize = 24, placeholder, onChangeText, autoFocus = false, returnKeyType, keyboardType, secureTextEntry = false }) => {
    return (
        <View style={component.input.container}>
            {(label) ? <Text>{label}</Text> : null}
            {(icon) ? <Icon name={icon} size={iconSize} style={{ paddingLeft: metrics.padding.sm, paddingRight: metrics.padding.sm }} /> : null}
            <TextInput
                style={{ marginTop: 0, flex: 1 }}
                placeholder={placeholder}
                onChangeText={onChangeText}
                autoFocus={autoFocus}
                returnKeyType={returnKeyType}
                value={value}
                underlineColorAndroid={colors.primary}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                autoCorrect={false}
                autoCapitalize={'none'}
            />
        </View>
    );
};
