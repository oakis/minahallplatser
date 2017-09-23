import React from 'react';
import { Text } from 'react-native';
import { isAndroid } from '../helpers';

const textStyle = {
    fontFamily: (isAndroid()) ? 'sans-serif' : 'System'
};

const DefaultFont = ({ style, children, ...props }) => {
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

export { DefaultFont as Text };
