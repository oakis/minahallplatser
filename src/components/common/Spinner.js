import React from 'react';
import { ActivityIndicator } from 'react-native';

export const Spinner = ({ size, color, noFlex = false, left = false }) => {
    return (
        <ActivityIndicator
            size={size}
            color={color}
            style={[noFlex ? null : { flex: 1 }, left ? { alignSelf: 'flex-start' } : null]}
        />
    );
};
