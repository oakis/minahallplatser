import React from 'react';
import {
  TouchableOpacity,
  Image,
  View,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {component} from '@style';
import {Text} from '@common';

interface ListItemProps {
  text: string;
  icon: string | null;
  pressItem: () => void;
  pressIcon: () => void;
  iconVisible: boolean;
  iconColor: string;
  style: Record<string, unknown>;
  avatar: string | null;
}

export const ListItem = ({
  text,
  icon = null,
  pressItem,
  pressIcon,
  iconVisible = false,
  iconColor = '#000',
  style = {},
  avatar = null,
}: ListItemProps): JSX.Element => {
  return (
    <TouchableOpacity
      onPress={pressItem}
      style={[component.listitem.view, style]}>
      <Text style={component.listitem.text as StyleProp<TextStyle>}>
        {text}
      </Text>
      <View style={component.listitem.icon as StyleProp<ViewStyle>}>
        {!iconVisible || avatar !== null ? null : (
          <Icon
            style={{color: iconColor}}
            name={icon as string}
            size={24}
            onPress={pressIcon}
          />
        )}
        {avatar === null ? null : (
          <Image
            style={{width: 24, height: 24, borderRadius: 12}}
            source={{uri: avatar}}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};
