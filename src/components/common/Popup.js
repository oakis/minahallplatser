import React, { PureComponent } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import { Button } from './';
import { component } from '../style/component';
import { metrics } from '../style';

export class Popup extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            animateValue: new Animated.Value(0),
            hidden: true,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isVisible && nextProps.isVisible !== this.props.isVisible) {
            this.setState({ hidden: false });
            Animated.timing(this.state.animateValue, {
                toValue: 1,
                easing: Easing.elastic(),
                duration: 250,
                useNativeDriver: true
            }).start();
            Animated.timing(this.state.animateValue, {
                toValue: 1,
                easing: Easing.ease,
                duration: 250,
                useNativeDriver: true
            }).start();
        } else if (!nextProps.isVisible && !nextProps.isVisible !== !this.props.isVisible) {
            Animated.timing(this.state.animateValue, {
                toValue: 0,
                easing: Easing.ease,
                duration: 250,
                useNativeDriver: true
            }).start();
            Animated.timing(this.state.animateValue, {
                toValue: 0,
                easing: Easing.ease,
                duration: 250,
                useNativeDriver: true
            }).start();
            setTimeout(() => {
                this.setState({ hidden: true });
            }, 250);
        }
    }

    render() {
        const { children, onPress } = this.props;
        const { animateValue, hidden } = this.state;
        return (
            <View style={[component.popup.container, { height: hidden ? 0 : '100%', width: hidden ? 0 : '100%', backgroundColor: 'transparent' }]}>
                <TouchableOpacity activeOpacity={1} onPress={onPress} style={{ position: 'absolute', zIndex: 1, height: hidden ? 0 : '100%', width: hidden ? 0 : '100%' }}>
                    <Animated.View style={[component.popup.container, { opacity: animateValue }]} />
                </TouchableOpacity>
                <Animated.ScrollView
                    style={[component.popup.content, { opacity: animateValue, transform: [{ scale: animateValue }] }]}
                    scrollEnabled
                    keyboardShouldPersistTaps="always"
                >
                    {children}
                    <Button label="Stäng" uppercase color="primary" onPress={onPress} style={{ marginBottom: metrics.margin.xl }} />
                </Animated.ScrollView>
            </View>
        );
    }
}
