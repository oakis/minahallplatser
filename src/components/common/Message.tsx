import React from 'react';
import {View, StyleProp, TextStyle, ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {store} from '@src/App';
import {CLR_ERROR} from '@types';
import {Text} from '@common';
import {component} from '@style';

interface MessageProps {
  type: 'info' | 'success' | 'danger' | 'warning';
  message: string;
  backgroundColor: string;
}

const getIcon = (iconType: string): string => {
  switch (iconType) {
    case 'info':
      return 'info';
    case 'success':
      return 'check-circle';
    case 'danger':
      return 'error';
    case 'warning':
      return 'warning';
  }
  return '';
};

export const Message = ({
  type,
  message = '',
  backgroundColor,
}: MessageProps): JSX.Element => {
  if (message.length > 0) {
    return (
      <View
        style={
          [component.message.view, {backgroundColor}] as StyleProp<ViewStyle>
        }>
        {type ? (
          <Icon
            name={getIcon(type)}
            size={20}
            style={component.message.icon as StyleProp<TextStyle>}
          />
        ) : null}
        <Text style={component.message.text as StyleProp<TextStyle>}>
          {message}
        </Text>
        <Text
          style={{fontSize: 10, fontWeight: 'bold'}}
          onPress={() => store.dispatch({type: CLR_ERROR})}>
          Stäng
        </Text>
      </View>
    );
  }
  return <View />;
};
