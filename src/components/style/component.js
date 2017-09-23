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
			flex: 1,
			flexDirection: 'row',
			justifyContent: 'space-between',
			marginTop: metrics.margin.sm,
			marginHorizontal: metrics.margin.md,
			paddingBottom: metrics.padding.sm,
			height: 50,
			borderBottomWidth: 1,
			borderBottomColor: colors.darkgrey
		},
		text: {
			justifyContent: 'flex-start',
            alignSelf: 'center',
            fontSize: 18
		},
		icon: {
			justifyContent: 'flex-end',
			alignSelf: 'center'
		}
    }
};
