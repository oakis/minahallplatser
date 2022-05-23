import React from 'react';
import {ActivityIndicator} from 'react-native';
import {colors} from '@style';

interface SpinnerProps {
  style?: Record<string, unknown>;
  size?: 'small' | 'large' | undefined;
  color?: string;
  noFlex?: boolean;
  left?: boolean;
  right?: boolean;
}

export const Spinner = ({
  style,
  size,
  color = colors.alternative,
  noFlex = false,
  left = false,
  right = false,
}: SpinnerProps): JSX.Element => {
  return (
    <ActivityIndicator
      size={size}
      color={color}
      style={[
        style,
        noFlex ? null : {flex: 1},
        left ? {alignSelf: 'flex-start'} : null,
        right ? {alignSelf: 'flex-end'} : null,
      ]}
    />
  );
};
