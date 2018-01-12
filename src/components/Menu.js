import React, { Component } from 'react';
import { View, AsyncStorage, ImageBackground, Picker, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import { Text, ListItem, ListHeading } from './common';
import { RESET_ALL } from '../actions/types';
import { getSettings, setSetting } from '../actions';
import { store } from '../App';
import { colors, metrics, component } from './style';
import { track, globals } from './helpers';
import { Feedback } from './modals';

class Menu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: firebase.auth().currentUser,
            timeFormat: this.props.timeFormat,
            favoriteOrder: this.props.favoriteOrder,
            feedbackVisible: true
        };
    }

    componentWillMount() {
        this.props.getSettings();
    }

    logout() {
        globals.didLogout = true;
        firebase.auth().signOut().then(() => {
            AsyncStorage.clear();
            store.dispatch({ type: RESET_ALL });
            track('Logout', { Success: true });
        }, (error) => {
            track('Logout', { Success: false });
            window.log('Sign Out Error', error);
        });
    }

    openFeedback() {
        this.setState({ feedbackVisible: true });
    }

    closeFeedback() {
        this.setState({ feedbackVisible: false });
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
                    style={component.picker}
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

                    <ListHeading text="Konto" />

                    <Text style={component.text.menu.label}>
                        {'e-mail'.toUpperCase()}
                    </Text>
                    <Text style={component.text.menu.value}>
                        {this.state.user && this.state.user.isAnonymous ? 'Anonym' : this.state.user.email}
                    </Text>

                    <ListHeading text="Inställningar" />

                    <Text style={component.text.menu.label}>
                        {'tidsformat'.toUpperCase()}
                    </Text>
                    <Picker
                        selectedValue={this.state.timeFormat}
                        onValueChange={(itemValue) => {
                            this.setState({ timeFormat: itemValue });
                            this.props.setSetting('timeFormat', itemValue);
                        }}
                        style={component.picker}
                    >
                        <Picker.Item label="Minuter" value="minutes" />
                        <Picker.Item label="Klockslag" value="clock" />
                    </Picker>

                    {this.renderFavoriteOrder()}

                    <View style={{ marginBottom: metrics.margin.md }} />

                    <ListHeading text="Åtgärder" />

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

                    {this.state.user && this.state.user.isAnonymous ?
                    <ListItem
                        text="Registrera"
                        icon="ios-log-in-outline"
                        iconVisible
                        pressItem={() => {
                            Actions.register();
                        }}
                    />
                    :
                    <ListItem
                        text='Logga ut'
                        icon='ios-exit-outline'
                        iconVisible
                        pressItem={() => {
                            this.logout();
                        }}
                    />}
                </ScrollView>
            </View>
		);
	}

}

const mapStateToProps = state => {
    const { timeFormat, favoriteOrder } = state.settings;
	return { favoriteOrder, timeFormat };
};

export default connect(mapStateToProps, { getSettings, setSetting })(Menu);
