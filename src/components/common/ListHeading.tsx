import React from 'react';
import {View, StyleProp, TextStyle} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Text, Spinner} from '@common';
import {component, metrics, colors} from '@style';

interface ListHeadingProps {
  text: string;
  icon?: string;
  iconSize?: number;
  onPress?: () => void;
  loading?: boolean;
  style?: Record<string, unknown>;
}

/**
 * <Spinner måste ha en riktig färg nu
 */

export const ListHeading = ({
  text,
  icon,
  iconSize = 24,
  onPress,
  loading = false,
  style = {},
}: ListHeadingProps): JSX.Element => {
  return (
    <View>
      <View
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: 29,
          },
          style,
        ]}>
        <Text
          style={
            [component.text.heading, {height: 29}] as StyleProp<TextStyle>
          }>
          {text}
        </Text>
        <View
          style={{
            flex: 1,
            marginTop: metrics.margin.md,
            paddingRight: metrics.padding.md,
            height: 29,
            justifyContent: 'center',
          }}>
          {loading ? (
            <Spinner color={colors.primary} right />
          ) : icon ? (
            <Icon
              name={icon as string}
              onPress={onPress}
              size={iconSize}
              style={{textAlign: 'right'}}
            />
          ) : null}
        </View>
      </View>
      <View
        style={{height: 2, width: '100%', backgroundColor: colors.primary}}
      />
    </View>
  );
};
