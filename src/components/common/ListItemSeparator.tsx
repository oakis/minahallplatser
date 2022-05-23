import React from 'react';
import {View} from 'react-native';
import {colors} from '@style';

export const ListItemSeparator = (): JSX.Element => {
  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: colors.darkgrey,
      }}
    />
  );
};
