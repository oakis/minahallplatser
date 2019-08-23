import React, { PureComponent } from 'react';
import { View, TouchableWithoutFeedback, Text, TouchableNativeFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../style/color';

export class MiniMenu extends PureComponent {

    state = {
        open: true,
    }

    style = {
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
        },
        child: {
            wrapper: {
                // backgroundColor: 'red',
                display: 'flex',
                flexDirection: 'row',
                flex: 1,
                width: '100%',
                borderBottomColor: colors.darkgrey,
                // marginVertical: 2,
                // padding: 5,
                paddingVertical: 5,
                justifyContent: 'center',
                alignItems: 'flex-start',
            },
            label: {
                flex: 1,
            },
            icon: {
                marginTop: 3,
                marginHorizontal: 5,
            },
        },
    }



    getLongestLabelLength = () => this.props.items.map(obj => obj.label.length).reduce((a, b) => a > b ? a : b );

    render() {
        window.log(this.getLongestLabelLength());
        return (
            <View style={{ ...this.style.menu, height: this.props.items.length * 31, width: this.getLongestLabelLength() * 8 + 28 }}>
                {this.props.items.map(({ icon, label, callback }, index) => (
                    <TouchableNativeFeedback
                        pointerEvents={'box-only'}
                        style={{ flex: 1, backgroundColor: 'red', alignSelf: 'stretch', elevation: 5 }}
                        key={index}
                        onPress={() => callback()}
                    >
                        <View style={{ ...this.style.child.wrapper, borderBottomWidth: index === this.props.items.length - 1 ? 0 : 1 }}>
                            <Icon
                                name={icon}
                                style={{ ...this.style.child.icon, color: colors.smoothBlack, fontSize: 14 }}
                            />
                            <Text style={this.style.child.label}>{label}</Text>
                        </View>
                    </TouchableNativeFeedback>
                ))}
            </View>
        );
    }
}
