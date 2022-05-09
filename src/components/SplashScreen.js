import React, {useEffect} from 'react';
import {View, ImageBackground} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import {Spinner, Text} from '@common';
import {colors} from '@style';

const SplashScreen = () => {
  useEffect(() => {
    analytics().logScreenView({
      screen_class: 'Splashscreen',
      screen_name: 'Splashscreen',
    });
  }, []);

  return (
    <ImageBackground
      source={{uri: 'https://www.w3schools.com/css/img_fjords.jpg'}}
      style={{
        flex: 1,
      }}>
      <View
        style={{
          backgroundColor: 'rgba(255,255,255,0.7)',
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {/* Mina hållplatser logo, custom 'spinner' under logo (brummande buss t.ex) */}
        <Text
          style={{
            marginBottom: 10,
            opacity: 1,
            fontSize: 24,
            fontWeight: 'bold',
          }}>
          Mina Hållplatser
        </Text>
        <Spinner size="large" color={colors.primary} noFlex />
      </View>
    </ImageBackground>
  );
};

export default SplashScreen;
