import { Dimensions } from 'react-native';
import { colors, metrics } from './';

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
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5
    },
    input: {
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
            shadowRadius: 5,
            shadowColor: colors.smoothBlack,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.2
        }
    },
    text: {
        heading: {
            marginTop: metrics.margin.md,
            paddingLeft: metrics.padding.md,
            paddingRight: metrics.padding.sm,
            fontSize: 20,
            fontWeight: 'bold'
        },
        menu: {
            label: {
                fontSize: 12,
                fontWeight: 'bold',
                paddingLeft: metrics.padding.md,
                paddingTop: metrics.padding.md,
                paddingBottom: 0,
                marginBottom: 0
            },
            value: {
                paddingLeft: metrics.padding.md,
                marginBottom: metrics.margin.md
            }
        }
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
            shadowOffset: { width: 2.5, height: 2.5 },
            shadowOpacity: 0.5
        },
        text: {
            color: colors.alternative,
            fontSize: 12,
            alignSelf: 'center',
            flex: 1
        },
        icon: {
            marginRight: metrics.margin.lg,
            marginLeft: 0,
            marginTop: 2,
            alignSelf: 'center'
        }
    },
    listitem: {
        view: {
			flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: metrics.padding.md,
			height: 50
		},
		text: {
			justifyContent: 'flex-start',
            alignSelf: 'center',
            fontSize: 18,
		},
		icon: {
            justifyContent: 'center',
            alignItems: 'center',
            width: 24,
		},
    },
    popup: {
        container: {
            position: 'absolute',
            zIndex: 1,
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.overlay
        },
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
            padding: metrics.padding.md
        },
        header: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: metrics.margin.sm
        },
        text: {
            marginBottom: metrics.margin.md
        },
        image: {
            marginBottom: metrics.margin.xl
        }
    }
};
