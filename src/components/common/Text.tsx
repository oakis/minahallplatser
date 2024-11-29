import React from 'react';
import {StyleProp, Text, TextStyle} from 'react-native';
import {isAndroid} from '@helpers';

interface TextProps {
  style?: StyleProp<TextStyle>;
  heading?: boolean;
  children: React.ReactNode;
  onPress?: () => void;
}

const DefaultFont = ({
  style,
  heading = false,
  children,
  ...props
}: TextProps): JSX.Element => {
  const textStyle = {
    fontFamily: isAndroid() ? 'sans-serif' : 'System',
    fontSize: heading ? 22 : 16,
  };
  let applyStyle;
  if (Array.isArray(style)) {
    applyStyle = [textStyle, ...style];
  } else {
    applyStyle = [textStyle, style];
  }

  return (
    <Text {...props} style={applyStyle}>
      {children}
    </Text>
  );
};

export {DefaultFont as Text};
