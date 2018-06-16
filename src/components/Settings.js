import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Picker, Switch } from 'react-native';
import firebase from 'react-native-firebase';
import { setSetting } from '../actions';
import { Text, ListItemSeparator } from './common';
import { component, colors, metrics } from './style';
import { isAndroid } from './helpers';

class Settings extends Component {
    state = {
        user: firebase.auth().currentUser || { email: null },
        timeFormat: this.props.timeFormat,
        favoriteOrder: this.props.favoriteOrder,
        feedbackVisible: false,
        allowedGPS: this.props.allowedGPS
    };

    renderFavoriteOrder = () => {
        if (this.state.user.isAnonymous) {
            return null;
        }
        return (
            <View style={{ height: 60 }}>
                <Text style={component.text.menu.label}>
                {'sortera favoriter'.toUpperCase()}
                </Text>
                <Picker
                    selectedValue={this.state.favoriteOrder}
                    onValueChange={(itemValue) => {
                        this.setState({ favoriteOrder: itemValue });
                        this.props.setSetting('favoriteOrder', itemValue);
                    }}
                    style={[isAndroid() ? component.picker : {}]}
                    itemStyle={{ fontSize: 16, height: 90, marginTop: -10 }}
                >
                    <Picker.Item label="Ingen sortering" value="nothing" />
                    <Picker.Item label="Mina mest använda" value="opened" />
                    <Picker.Item label="Efter bokstav" value="busStop" />
                </Picker>
            </View>
        );
    }

    render() {
        return (
            <View>

                <View style={{ height: 60 }}>
                    <Text style={component.text.menu.label}>
                        {'tidsformat'.toUpperCase()}
                    </Text>
                    <Picker
                        selectedValue={this.state.timeFormat}
                        onValueChange={(itemValue) => {
                            this.setState({ timeFormat: itemValue });
                            this.props.setSetting('timeFormat', itemValue);
                        }}
                        style={[isAndroid() ? component.picker : {}]}
                        itemStyle={{ fontSize: 16, height: 90, marginTop: -10 }}
                    >
                        <Picker.Item label="Minuter" value="minutes" />
                        <Picker.Item label="Klockslag" value="clock" />
                    </Picker>
                </View>

                <ListItemSeparator />

                {this.renderFavoriteOrder()}

                <ListItemSeparator />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 60 }}>
                    <Text style={[component.text.menu.label, { paddingTop: 0 }]}>
                        {'Hållplatser nära dig'.toUpperCase()}
                    </Text>
                    <Switch 
                        onValueChange={(value) => {
                            this.setState({ allowedGPS: value });
                            this.props.setSetting('allowedGPS', value);
                        }} 
                        value={this.state.allowedGPS}
                        tintColor={colors.darkergrey}
                        onTintColor={colors.primaryRGBA}
                        thumbTintColor={colors.primary}
                        style={{ marginRight: metrics.margin.md }}
                    />
                </View>

                <ListItemSeparator />

            </View>
        );
    }
}

const mapStateToProps = state => {
    const { allowedGPS, favoriteOrder, hasUsedGPS, timeFormat } = state.settings;
    return { allowedGPS, favoriteOrder, hasUsedGPS, timeFormat };
};

export default connect(mapStateToProps, {
    setSetting,
})(Settings);
