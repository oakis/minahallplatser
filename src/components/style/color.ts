type ColorType =
  | 'default'
  | 'alternative'
  | 'primary'
  | 'primaryRGBA'
  | 'info'
  | 'success'
  | 'danger'
  | 'warning'
  | 'lightgrey'
  | 'darkgrey'
  | 'darkergrey'
  | 'smoothBlack'
  | 'overlay'
  | 'background';

type Color = {
  [key in ColorType]: string;
};

export const colors: Color = {
  default: '#000',
  alternative: '#fff',
  primary: '#779ECB',
  primaryRGBA: 'rgba(119, 158, 203, 0.4)',
  info: '#779ECB',
  success: '#77DD77',
  danger: '#FF6961',
  warning: '#FFB347',

  lightgrey: '#efefef',
  darkgrey: '#dedede',
  darkergrey: '#cecece',
  smoothBlack: '#282828',

  overlay: 'rgba(0, 0, 0, 0.4)',

  background: '#EAE9EF',
};
