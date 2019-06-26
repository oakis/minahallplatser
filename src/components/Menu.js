import React, { Component } from 'react';
import { View, ImageBackground, ScrollView, Picker } from 'react-native';
import { connect } from 'react-redux';
import { ListItem, ListItemSeparator, Text } from './common';
import { setSetting } from '../actions';
import { colors, metrics, component } from './style';
import { track, isAndroid } from './helpers';
import { Feedback } from './modals';

class Menu extends Component {

    state = {
        feedbackVisible: false,
    }

    openFeedback() {
        this.setState({ feedbackVisible: true });
    }

    closeFeedback() {
        this.setState({ feedbackVisible: false });
    }

    renderFavoriteOrder = () => {
        return (
            <View style={{ height: 60 }}>
                <Text style={component.text.menu.label}>
                    SORTERA FAVORITER
                </Text>
                <Picker
                    selectedValue={this.props.favoriteOrder}
                    onValueChange={(itemValue) => {
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

    renderTimeFormat = () => {
        return (
            <View style={{ height: 60 }}>
                <Text style={component.text.menu.label}>
                    TIDSFORMAT
                </Text>
                <Picker
                    selectedValue={this.props.timeFormat}
                    onValueChange={(itemValue) => {
                        this.props.setSetting('timeFormat', itemValue);
                    }}
                    style={[isAndroid() ? component.picker : {}]}
                    itemStyle={{ fontSize: 16, height: 90, marginTop: -10 }}
                >
                    <Picker.Item label="Minuter" value="minutes" />
                    <Picker.Item label="Klockslag" value="clock" />
                </Picker>
            </View>
        );
    }

	render() {
		return (
			<View style={{ flexDirection: 'column', backgroundColor: colors.background, flex: 1 }}>
                <Feedback
                    visible={this.state.feedbackVisible}
                    close={() => this.closeFeedback()}
                />
                <ScrollView>
                    <ImageBackground source={{ uri: 'https://www.w3schools.com/css/img_fjords.jpg' }} style={{ width: 225, height: 120 }}>
                        <View
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.7)',
                                flex: 1
                            }}
                        />
                    </ImageBackground>

                    {this.renderFavoriteOrder()}

                    <ListItemSeparator />

                    {this.renderTimeFormat()}

                    <ListItemSeparator />

                    <View style={{ flex: 1 }} />

                    <ListItem
                        text="Lämna feedback"
                        icon="ios-mail-outline"
                        iconVisible
                        pressItem={() => {
                            track('Feedback Open');
                            this.openFeedback();
                        }}
                        style={{ marginTop: metrics.margin.md }} // Första ListItem ska ha en marginTop för att få ett jämnt mellanrum mellan ListItem's
                    />

                </ScrollView>
            </View>
		);
	}

}

const mapStateToProps = state => {
    const { timeFormat, favoriteOrder } = state.settings;
	return { favoriteOrder, timeFormat };
};

export default connect(mapStateToProps, { setSetting })(Menu);
