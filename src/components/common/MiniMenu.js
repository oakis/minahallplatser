import React, {useEffect, useRef, useState} from 'react';
import {View, TouchableNativeFeedback, TouchableOpacity} from 'react-native';
import Animated, {EasingNode} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {colors} from '@style/color';
import {Text} from '@common';
import {component} from '@style/component';

export const MiniMenu = props => {
  const [hidden, setHidden] = useState(true);

  const animateValue = useRef(new Animated.Value(0)).current;

  const style = {
    menu: {
      zIndex: 2,
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor: colors.alternative,
      elevation: 5,
      borderRadius: 5,
      transformOrigin: 'top right',
    },
    child: {
      wrapper: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        width: '100%',
        borderBottomColor: colors.darkgrey,
        paddingVertical: 15,
        justifyContent: 'center',
        alignItems: 'flex-start',
      },
      content: {
        flex: 1,
        fontSize: 14,
      },
      icon: {
        marginTop: 3,
        marginHorizontal: 15,
      },
    },
  };

  useEffect(() => {
    if (props.isVisible) {
      setHidden(false);
      Animated.timing(animateValue, {
        toValue: 1,
        easing: EasingNode.elastic(),
        duration: 250,
        useNativeDriver: true,
      }).start();
      Animated.timing(animateValue, {
        toValue: 1,
        easing: EasingNode.ease,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else if (!props.isVisible) {
      Animated.timing(animateValue, {
        toValue: 0,
        easing: EasingNode.ease,
        duration: 250,
        useNativeDriver: true,
      }).start();
      Animated.timing(animateValue, {
        toValue: 0,
        easing: EasingNode.ease,
        duration: 250,
        useNativeDriver: true,
      });
      setTimeout(() => {
        setHidden(true);
      }, 250);
    }
  }, [animateValue, props.isVisible]);

  const getLongestContentLength = () =>
    props.items
      .map(obj => obj.content.length)
      .reduce((a, b) => (a > b ? a : b));

  return (
    <View
      style={[
        component.popup.container,
        {
          height: hidden ? 0 : '100%',
          width: hidden ? 0 : '100%',
          backgroundColor: 'transparent',
        },
      ]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={props.onClose}
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
      <Animated.View
        style={{
          ...style.menu,
          ...props.style,
          height: hidden ? 0 : props.items.length * 51,
          width: hidden ? 0 : getLongestContentLength() * 8 + 50,
          transform: [{scale: animateValue}],
          opacity: animateValue,
        }}>
        {props.items.map(({icon, content, onPress}, index) => (
          <TouchableNativeFeedback
            pointerEvents={'box-only'}
            style={{flex: 1, alignSelf: 'stretch', elevation: 5}}
            key={index}
            onPress={onPress}>
            <View
              style={{
                ...style.child.wrapper,
                borderBottomWidth: index === props.items.length - 1 ? 0 : 1,
              }}>
              <Icon
                name={icon}
                style={{
                  ...style.child.icon,
                  color: colors.smoothBlack,
                  fontSize: 14,
                }}
              />
              {typeof content === 'string' ? (
                <Text style={style.child.content}>{content}</Text>
              ) : (
                <View style={style.child.content}>{content}</View>
              )}
            </View>
          </TouchableNativeFeedback>
        ))}
      </Animated.View>
    </View>
  );
};

export default MiniMenu;
