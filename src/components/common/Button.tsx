import React from 'react';
import {TouchableOpacity, TouchableNativeFeedback, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {isAndroid} from '@helpers';
import {Text, Spinner} from '@common';
import {component, colors} from '@style';

interface ButtonProps {
  icon?: string;
  iconSize?: number;
  label: string;
  color: string;
  fontColor?: string;
  onPress: () => void;
  uppercase?: boolean;
  loading?: boolean;
  style?: Record<string, unknown>;
}

export const Button = ({
  icon = '',
  iconSize = 24,
  label,
  color,
  fontColor = colors.alternative,
  onPress,
  uppercase = false,
  loading,
  style = {},
}: ButtonProps): JSX.Element => {
  const showSpinnerOrText = () => {
    if (loading) {
      return <Spinner size="small" color={fontColor} />;
    }
    return (
      <Text
        style={{
          marginLeft: icon ? 5 : 0,
          fontWeight: 'bold',
          fontFamily: isAndroid() ? 'sans-serif-thin' : 'System',
          color: fontColor,
        }}>
        {uppercase ? label.toUpperCase() : label}
      </Text>
    );
  };

  const renderButton = () => {
    if (isAndroid()) {
      return (
        <TouchableNativeFeedback onPress={onPress}>
          <View
            style={[component.button, {backgroundColor: color}, {...style}]}>
            {icon ? (
              <Icon name={icon} size={iconSize} color={fontColor} />
            ) : null}
            {showSpinnerOrText()}
          </View>
        </TouchableNativeFeedback>
      );
    }
    return (
      <TouchableOpacity
        style={[component.button, {backgroundColor: color}, {...style}]}
        onPress={onPress}>
        <Icon name={icon} size={iconSize} />
        {showSpinnerOrText()}
      </TouchableOpacity>
    );
  };

  return renderButton();
};
