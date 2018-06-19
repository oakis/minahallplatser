import React, { Component } from 'react';
import { View, AsyncStorage, ImageBackground, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
import { Actions } from 'react-native-router-flux';
import { ListItem, ListHeading } from './common';
import { RESET_ALL } from '../actions/types';
import { setSetting } from '../actions';
import { store } from '../App';
import { colors, metrics } from './style';
import { track, globals } from './helpers';
import { Feedback } from './modals';

class Menu extends Component {

    state = {
        user: firebase.auth().currentUser || { email: null },
        feedbackVisible: false,
    }

    logout() {
        globals.didLogout = true;
        globals.isLoggingIn = false;
        firebase.auth().signOut().then(() => {
            AsyncStorage.clear().then(() => {
                store.dispatch({ type: RESET_ALL });
                track('Logout', { Success: true });
            });
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

                    {this.state.user && !this.state.user.isAnonymous ?
                        <ListItem
                            text="Profil"
                            icon="ios-person"
                            iconVisible
                            pressItem={() => {
                                Actions.profile();
                            }}
                        />
                    : null}

                    <ListItem
                        text="Inställningar"
                        icon="ios-settings"
                        iconVisible
                        pressItem={() => {
                            Actions.settings();
                        }}
                    />

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
                    <View>
                        <ListItem
                            text="Logga in"
                            icon="ios-log-in-outline"
                            iconVisible
                            pressItem={() => {
                                Actions.login();
                            }}
                        />
                        <ListItem
                            text="Registrera"
                            icon="ios-log-in-outline"
                            iconVisible
                            pressItem={() => {
                                Actions.register();
                            }}
                        />
                    </View>
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
    const { timeFormat, favoriteOrder, allowedGPS } = state.settings;
	return { favoriteOrder, timeFormat, allowedGPS };
};

export default connect(mapStateToProps, { setSetting })(Menu);
