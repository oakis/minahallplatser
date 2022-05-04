import React from 'react';
import {Text} from 'react-native';
import {isAndroid} from '@helpers';

const DefaultFont = ({style, heading = false, children, ...props}) => {
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
