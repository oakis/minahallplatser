import React from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {store} from '@src/App';
import {CLR_ERROR} from '@types';
import {Text} from '@common';
import {colors, component} from '@style';

export const Message = ({type, message = ''}) => {
  const getIcon = iconType => {
    switch (iconType) {
      case 'info':
        return 'info';
      case 'success':
        return 'check-circle';
      case 'danger':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return;
    }
  };
  if (message.length > 0) {
    return (
      <View style={[component.message.view, {backgroundColor: colors[type]}]}>
        {type ? (
          <Icon name={getIcon(type)} size={20} style={component.message.icon} />
        ) : null}
        <Text style={component.message.text}>{message}</Text>
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
