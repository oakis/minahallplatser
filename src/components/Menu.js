import React, { Component } from 'react';
import { View, AsyncStorage, ImageBackground, Picker } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { Text, ListItem, ListHeading } from './common';
import { RESET_ALL } from '../actions/types';
import { getSettings, setSetting } from '../actions';
import { store } from '../App';
import { colors, metrics, component } from './style';
import { track } from './helpers';

class Menu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: firebase.auth().currentUser,
            timeFormat: this.props.timeFormat,
            favoriteOrder: this.props.favoriteOrder
        };
    }

    componentWillMount() {
        this.props.getSettings();
    }

    logout() {
        firebase.auth().signOut().then(() => {
            AsyncStorage.clear();
            store.dispatch({ type: RESET_ALL });
            track('Logout', { Success: true });
        }, (error) => {
            track('Logout', { Success: false });
            window.log('Sign Out Error', error);
        });
    }

    renderFavoriteOrder = () => {
        if (this.state.user.isAnonymous) {
            return null;
        }
        return (
            <View>
                <Text style={component.text.menu.label}>
                {'sortera favoriter'.toUpperCase()}
                </Text>
                <Picker
                    selectedValue={this.state.favoriteOrder}
                    onValueChange={(itemValue) => {
                        this.setState({ favoriteOrder: itemValue });
                        this.props.setSetting('favoriteOrder', itemValue);
                    }}
                    style={{ marginLeft: metrics.margin.md + 2, marginTop: -12, marginBottom: -12, marginRight: -5 }}
                >
                    <Picker.Item label="Ingen sortering" value="nothing" />
                    <Picker.Item label="Mina mest använda" value="opened" />
                </Picker>
            </View>
        );
    }

	render() {
		return (
			<View style={{ flexDirection: 'column', backgroundColor: colors.background, flex: 1 }}>
                <View>
                    <ImageBackground source={{ uri: 'https://www.w3schools.com/css/img_fjords.jpg' }} style={{ width: 225, height: 150 }}>
                        <View
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.7)',
                                flex: 1
                            }}
                        />
                    </ImageBackground>

                    <ListHeading text="Ditt konto" />

                    <Text style={component.text.menu.label}>
                        {'e-mail'.toUpperCase()}
                    </Text>
                    <Text style={component.text.menu.value}>
                        {this.state.user && this.state.user.isAnonymous ? 'Anonym' : this.state.user.email}
                    </Text>

                    <ListHeading text="Dina inställningar" />

                    <Text style={component.text.menu.label}>
                        {'tidsformat'.toUpperCase()}
                    </Text>
                    <Picker
                        selectedValue={this.state.timeFormat}
                        onValueChange={(itemValue) => {
                            this.setState({ timeFormat: itemValue });
                            this.props.setSetting('timeFormat', itemValue);
                        }}
                        style={{ marginLeft: metrics.margin.md + 2, marginTop: -12, marginBottom: -12, marginRight: -5 }}
                    >
                        <Picker.Item label="Minuter" value="minutes" />
                        <Picker.Item label="Klockslag" value="clock" />
                    </Picker>

                    {this.renderFavoriteOrder()}

                    <ListHeading />

                    <ListItem
                        text='Logga ut'
                        icon='ios-exit-outline'
                        iconVisible
                        pressItem={() => {
                            this.logout();
                        }}
                    />
                </View>
            </View>
		);
	}

}

const mapStateToProps = state => {
    const { timeFormat, favoriteOrder } = state.settings;
	return { favoriteOrder, timeFormat };
};

export default connect(mapStateToProps, { getSettings, setSetting })(Menu);
