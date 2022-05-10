import React from 'react';
import {TextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Text, Spinner} from '@common';
import {colors, component, metrics} from '@style';

type InputProps = {
  style: object;
  value: string;
  label: string;
  icon: string | null;
  iconRight: string | null;
  iconRightPress: () => void;
  iconSize: number;
  placeholder: string;
  onChangeText: () => void;
  autoFocus: boolean;
  secureTextEntry: boolean;
  loading: boolean;
  underlineColorAndroid: string;
  onFocus: () => void;
  multiline: boolean;
};

export const Input = ({
  style,
  value,
  label,
  icon = null,
  iconRight = null,
  iconRightPress = () => {},
  iconSize = 24,
  placeholder,
  onChangeText,
  autoFocus = false,
  secureTextEntry = false,
  loading = false,
  underlineColorAndroid = colors.primary,
  onFocus,
  multiline = false,
}: InputProps): JSX.Element => {
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
        value={value}
        underlineColorAndroid={underlineColorAndroid}
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
