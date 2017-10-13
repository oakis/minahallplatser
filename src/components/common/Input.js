import React from 'react';
import { TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text, Spinner } from './';
import { colors, component, metrics } from '../style';

export const Input = ({ style, value, label, icon, iconRight = null, iconRightPress = null, iconSize = 24, placeholder, onChangeText, autoFocus = false, returnKeyType, keyboardType, secureTextEntry = false, loading = false }) => {
    return (
        <View style={[component.input.container, style]}>
            {(label) ? <Text>{label}</Text> : null}
            {(icon) ? <Icon name={icon} size={iconSize} style={{ marginLeft: metrics.margin.sm, marginRight: metrics.margin.sm }} /> : null}
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
            {(iconRight !== null) ?
                <View style={{ marginLeft: metrics.margin.sm, marginRight: metrics.margin.sm }}>
                    {(loading) ?
                        <Spinner color={colors.primary} /> :
                        <Icon onPress={iconRightPress} name={iconRight} size={iconSize} style={{ marginLeft: metrics.margin.sm, marginRight: metrics.margin.sm }} />
                    }
                </View>
                : null
            }
        </View>
    );
};
