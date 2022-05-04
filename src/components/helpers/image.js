import {Dimensions} from 'react-native';

export const calcImageSize = (percent, margin) => {
  const dimensions = Dimensions.get('window');
  const imageWidth = dimensions.width * percent - margin;
  const imageHeight = Math.round((imageWidth * 9) / 16);
  return {imageHeight, imageWidth};
};
