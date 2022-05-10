import {Dimensions} from 'react-native';

type ImageType = {
  imageHeight: number;
  imageWidth: number;
};

export const calcImageSize = (percent: number, margin: number): ImageType => {
  const dimensions = Dimensions.get('window');
  const imageWidth = dimensions.width * percent - margin;
  const imageHeight = Math.round((imageWidth * 9) / 16);
  return {imageHeight, imageWidth};
};
