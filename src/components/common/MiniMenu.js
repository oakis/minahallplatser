import React, { PureComponent } from 'react';
import { View, Text, TouchableNativeFeedback, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../style/color';

export class MiniMenu extends PureComponent {

    state = {
        scale: new Animated.Value(0),
        hidden: true,
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
                duration: 160,
                useNativeDriver: true
            }).start();
        } else if (!nextProps.isVisible && this.state.isVisible) {
            this.setState({ isVisible: false, transitioning: true });
            Animated.timing(this.state.scale, {
                toValue: 0,
                easing: Easing.elastic(),
                duration: 160,
                useNativeDriver: true
            }).start(() => {
                this.setState({ hidden: true, transitioning: false });
            });
        }
    }

    getLongestContentLength = () => this.props.items.map(obj => obj.content.length).reduce((a, b) => a > b ? a : b );

    render() {
        window.log(this.getLongestContentLength());
        const { scale, hidden } = this.state;
        return (
            <Animated.View style={{
                ...this.style.menu,
                height: hidden ? 0 : this.props.items.length * 51,
                width: hidden ? 0 : this.getLongestContentLength() * 8 + 28,
                transform: [{ scale }]
            }}>
                {this.props.items.map(({ icon, content, callback }, index) => (
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
                            {typeof content === 'string' ? (<Text style={this.style.child.content}>{content}</Text>) : (content)}
                        </View>
                    </TouchableNativeFeedback>
                ))}
            </Animated.View>
        );
    }
}
