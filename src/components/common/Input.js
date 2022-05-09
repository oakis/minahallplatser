import React from 'react';
import {TextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Text, Spinner} from '@common';
import {colors, component, metrics} from '@style';

export const Input = ({
  style,
  value,
  label,
  icon,
  iconRight = null,
  iconRightPress = null,
  iconSize = 24,
  placeholder,
  onChangeText,
  autoFocus = false,
  returnKeyType,
  keyboardType,
  secureTextEntry = false,
  loading = false,
  underlineColorAndroid = colors.primary,
  onFocus,
  multiline = false,
}) => {
  return (
    <View style={[component.input.container, style]}>
      {label ? <Text>{label}</Text> : null}
      {icon ? (
        <Icon
          name={icon}
          size={iconSize}
          style={{
            marginLeft: metrics.margin.sm,
            marginRight: metrics.margin.sm,
          }}
        />
      ) : null}
      <TextInput
        style={{marginTop: 0, flex: 1}}
        placeholder={placeholder}
        onChangeText={onChangeText}
        autoFocus={autoFocus}
        returnKeyType={returnKeyType}
        value={value}
        underlineColorAndroid={underlineColorAndroid}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCorrect={false}
        autoCapitalize="none"
        onFocus={onFocus}
        multiline={multiline}
      />
      {iconRight !== null ? (
        <View style={{marginLeft: metrics.margin.sm}}>
          {loading ? (
            <Spinner
              color={colors.primary}
              style={{
                padding: metrics.padding.md,
                paddingRight: metrics.padding.md + 4,
              }}
            />
          ) : (
            <Icon
              onPress={iconRightPress}
              name={iconRight}
              size={iconSize}
              style={{padding: metrics.padding.md}}
            />
          )}
        </View>
      ) : null}
    </View>
  );
};
