import React, { PureComponent } from 'react';
import { View, Animated, Easing, TouchableOpacity, ScrollView } from 'react-native';
import { Button } from './';
import { component } from '../style/component';

export class Popup extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            opacity: new Animated.Value(0),
            isVisible: this.props.isVisible,
            hidden: true,
            transitioning: false,
            scale: new Animated.Value(0.5)
        };
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

    render() {
        const { children, onPress } = this.props;
        const { opacity, hidden, transitioning, scale } = this.state;
        return (
            <View style={[component.popup.container, { height: hidden ? 0 : '100%', width: hidden ? 0 : '100%', backgroundColor: 'transparent' }]}>
                <TouchableOpacity activeOpacity={1} disabled={transitioning} onPress={onPress} style={{ position: 'absolute', zIndex: 1, height: hidden ? 0 : '100%', width: hidden ? 0 : '100%' }}>
                    <Animated.View style={[component.popup.container, { opacity }]} />
                </TouchableOpacity>
                <Animated.View style={[component.popup.content, { opacity, transform: [{ scale }] }]}>
                    <ScrollView>
                        {children}
                        <Button label="Stäng" uppercase color={'primary'} onPress={onPress} />
                    </ScrollView>
                </Animated.View>
            </View>
        );
    }
}
