import React, {useEffect, useRef, useState} from 'react';
import {View, TouchableOpacity, StyleProp, ViewStyle} from 'react-native';
import Animated, {EasingNode} from 'react-native-reanimated';
import {Button} from '@common';
import {metrics, component, colors} from '@style';

const duration = 160;

interface PopupProps {
  isVisible: boolean;
  onPress: () => void;
  children: React.ReactNode;
}

export const Popup = (props: PopupProps): JSX.Element => {
  const [hidden, setHidden] = useState(true);

  const animateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (props.isVisible) {
      setHidden(false);
      Animated.timing(animateValue, {
        toValue: 1,
        easing: EasingNode.elastic(),
        duration,
      }).start();
      Animated.timing(animateValue, {
        toValue: 1,
        easing: EasingNode.ease,
        duration,
      }).start();
    } else if (!props.isVisible) {
      Animated.timing(animateValue, {
        toValue: 0,
        easing: EasingNode.ease,
        duration,
      }).start();
      Animated.timing(animateValue, {
        toValue: 0,
        easing: EasingNode.ease,
        duration,
      }).start();
      setTimeout(() => {
        setHidden(true);
      }, duration);
    }
  }, [animateValue, props.isVisible]);

  return (
    <View
      style={
        [
          component.popup.container,
          {
            height: hidden ? 0 : '100%',
            width: hidden ? 0 : '100%',
            backgroundColor: 'transparent',
          },
        ] as StyleProp<ViewStyle>
      }>
      <TouchableOpacity
        activeOpacity={1}
        onPress={props.onPress}
        style={{
          position: 'absolute',
          zIndex: 1,
          height: hidden ? 0 : '100%',
          width: hidden ? 0 : '100%',
        }}>
        <Animated.View
          style={[component.popup.container, {opacity: animateValue}]}
        />
      </TouchableOpacity>
      <Animated.ScrollView
        style={[
          component.popup.content,
          {opacity: animateValue, transform: [{scale: animateValue}]},
        ]}
        scrollEnabled
        keyboardShouldPersistTaps="always">
        {props.children}
        <Button
          label="Stäng"
          uppercase
          color={colors.primary}
          onPress={props.onPress}
          style={{marginBottom: metrics.margin.xl}}
        />
      </Animated.ScrollView>
    </View>
  );
};

export default Popup;
