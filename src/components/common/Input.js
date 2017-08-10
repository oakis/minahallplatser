import React from 'react';
import { Text, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../style/color';

export const Input = ({ value, label, icon, iconSize = 24, placeholder, onChangeText, autoFocus = false, returnKeyType, keyboardType, secureTextEntry = false }) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {(label) ? <Text>{label}</Text> : null}
            {(icon) ? <Icon name={icon} size={iconSize} style={{ paddingLeft: 5, paddingRight: 5 }} /> : null}
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
            />
        </View>
    );
};
