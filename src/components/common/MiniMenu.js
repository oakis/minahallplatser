import React, { PureComponent } from 'react';
import { View, TouchableNativeFeedback, Animated, Easing, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../style/color';
import { Text } from './index';
import { component } from '../style/component';

export class MiniMenu extends PureComponent {

    state = {
        hidden: true,
        opacity: new Animated.Value(0),
        scale: new Animated.Value(0),
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
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isVisible && !this.state.isVisible) {
            this.setState({ isVisible: true, hidden: false, transitioning: true });
            Animated.timing(this.state.scale, {
                toValue: 1,
                easing: Easing.elastic(),
                duration: 500,
                useNativeDriver: true
            }).start();
            Animated.timing(this.state.opacity, {
                toValue: 1,
                easing: Easing.ease,
                duration: 250,
                useNativeDriver: true
            }).start(() => {
                this.setState({ transitioning: false });
            });
        } else if (!nextProps.isVisible && this.state.isVisible) {
            this.setState({ isVisible: false, transitioning: true });
            Animated.timing(this.state.scale, {
                toValue: 0,
                easing: Easing.inOut(Easing.back()),
                duration: 500,
                useNativeDriver: true
            }).start();
            Animated.timing(this.state.opacity, {
                toValue: 0,
                easing: Easing.linear,
                duration: 250,
                useNativeDriver: true
            }).start(() => {
                this.setState({ hidden: true, transitioning: false });
            });
        }
    }

    getLongestContentLength = () => this.props.items.map(obj => obj.content.length).reduce((a, b) => a > b ? a : b );

    render() {
        const { onClose } = this.props;
        const { scale, hidden, transitioning, opacity } = this.state;
        return (
            <View style={[component.popup.container, { height: hidden ? 0 : '100%', width: hidden ? 0 : '100%', backgroundColor: 'transparent' }]}>
                <TouchableOpacity activeOpacity={1} disabled={transitioning} onPress={onClose} style={{ position: 'absolute', zIndex: 1, height: hidden ? 0 : '100%', width: hidden ? 0 : '100%' }}>
                <Animated.View style={[component.popup.container, { opacity }]} />
                </TouchableOpacity>
                <Animated.View style={{
                    ...this.style.menu,
                    ...this.props.style,
                    height: hidden ? 0 : this.props.items.length * 51,
                    width: hidden ? 0 : this.getLongestContentLength() * 8 + 50,
                    transform: [{ scale }]
                }}>
                    {this.props.items.map(({ icon, content, onPress }, index) => (
                        <TouchableNativeFeedback
                            pointerEvents={'box-only'}
                            style={{ flex: 1, alignSelf: 'stretch', elevation: 5 }}
                            key={index}
                            onPress={onPress}
                        >
                            <View style={{ ...this.style.child.wrapper, borderBottomWidth: index === this.props.items.length - 1 ? 0 : 1 }}>
                                <Icon
                                    name={icon}
                                    style={{ ...this.style.child.icon, color: colors.smoothBlack, fontSize: 14 }}
                                />
                                {typeof content === 'string' ? <Text style={this.style.child.content}>{content}</Text> : <View style={this.style.child.content}>{content}</View>}
                            </View>
                        </TouchableNativeFeedback>
                    ))}
                </Animated.View>
            </View>
        );
    }
}
