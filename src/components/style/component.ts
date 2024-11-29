import {Dimensions, StyleProp, TextStyle, ViewStyle} from 'react-native';
import {colors, metrics} from './';

export const component = {
  button: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: metrics.padding.md,
    paddingBottom: metrics.padding.md,
    marginBottom: metrics.margin.sm,
    borderRadius: metrics.borderRadius,
    elevation: 1,
    shadowRadius: 1,
    shadowColor: colors.smoothBlack,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
  } as StyleProp<ViewStyle>,
  input: {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      shadowRadius: 5,
      shadowColor: colors.smoothBlack,
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 0.2,
    } as StyleProp<ViewStyle>,
  },
  text: {
    heading: {
      marginTop: metrics.margin.md,
      paddingLeft: metrics.padding.md,
      paddingRight: metrics.padding.sm,
      fontSize: 20,
      fontWeight: 'bold',
    } as StyleProp<TextStyle>,
    menu: {
      label: {
        fontSize: 12,
        fontWeight: 'bold',
        paddingLeft: metrics.padding.md,
        paddingTop: metrics.padding.md,
        paddingBottom: 0,
        marginBottom: 0,
      } as StyleProp<TextStyle>,
      value: {
        paddingLeft: metrics.padding.md,
        marginBottom: metrics.margin.md,
      } as StyleProp<TextStyle>,
    },
  },
  message: {
    view: {
      alignSelf: 'stretch',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: metrics.padding.lg,
      margin: metrics.margin.sm,
      borderRadius: metrics.borderRadius,
      elevation: 5,
      shadowRadius: 5,
      shadowColor: colors.smoothBlack,
      shadowOffset: {width: 2.5, height: 2.5},
      shadowOpacity: 0.5,
    } as StyleProp<ViewStyle>,
    text: {
      color: colors.alternative,
      fontSize: 12,
      alignSelf: 'center',
      flex: 1,
    } as StyleProp<TextStyle>,
    icon: {
      marginRight: metrics.margin.lg,
      marginLeft: 0,
      marginTop: 2,
      alignSelf: 'center',
    } as StyleProp<TextStyle>,
  },
  listitem: {
    view: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: metrics.padding.md,
      height: 50,
    } as StyleProp<ViewStyle>,
    text: {
      justifyContent: 'flex-start',
      alignSelf: 'center',
      fontSize: 18,
    } as StyleProp<TextStyle>,
    icon: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 24,
    } as StyleProp<TextStyle>,
  },
  popup: {
    container: {
      position: 'absolute',
      zIndex: 1,
      height: '100%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.overlay,
    } as StyleProp<ViewStyle>,
    content: {
      position: 'absolute',
      width: '85%',
      minHeight: 250,
      maxHeight: (Dimensions.get('window').height * 0.9) / 1.3,
      zIndex: 2,
      backgroundColor: colors.alternative,
      borderRadius: 5,
      borderWidth: 2,
      elevation: 10,
      padding: metrics.padding.md,
    } as StyleProp<ViewStyle>,
    header: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: metrics.margin.sm,
    } as StyleProp<TextStyle>,
    text: {
      marginBottom: metrics.margin.md,
    } as StyleProp<TextStyle>,
    image: {
      marginBottom: metrics.margin.xl,
    } as StyleProp<ViewStyle>,
  },
};
