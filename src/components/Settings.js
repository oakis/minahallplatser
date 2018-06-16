import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Picker, Switch, TouchableNativeFeedback, ScrollView, Keyboard, AsyncStorage } from 'react-native';
import firebase from 'react-native-firebase';
import { store } from '../App';
import { RESET_ALL } from '../actions/types';
import { setSetting } from '../actions';
import { Text, ListItemSeparator, Popup, Input, Button } from './common';
import { component, colors, metrics } from './style';
import { isAndroid, globals, showMessage, track } from './helpers';
import { getFirebaseError } from '../actions/auth';

class Settings extends Component {
    state = {
        user: firebase.auth().currentUser || { email: null },
        timeFormat: this.props.timeFormat,
        favoriteOrder: this.props.favoriteOrder,
        feedbackVisible: false,
        allowedGPS: this.props.allowedGPS,
        popupVisible: false,
        email: '',
        password: '',
        deleteAccountMessage: '',
    };

    delete = () => {
        const { email, password } = this.state;
        if (this.validateDeleteAccount()) {
            firebase.auth().signInAndRetrieveDataWithEmailAndPassword(email, password)
                .then(({ user }) => {
                    window.log('Trying to delete user:', user);
                    AsyncStorage.clear().then(() => {
                        store.dispatch({ type: RESET_ALL });
                    });
                    firebase.database()
                    .ref(`/users/${user.uid}`)
                    .remove()
                        .then(() => {
                            globals.didLogout = true;
                            globals.isLoggingIn = false;
                            user.delete()
                                .then(() => {
                                    window.log('user.delete(): SUCCESS');
                                    track('Account delete', { Success: true });
                                    showMessage('long', 'Ditt konto och all data raderades.');
                                })
                                .catch(e => {
                                    window.log('user.delete(): FAIL', e);
                                    showMessage('long', 'Det gick inte att radera ditt konto. Var god försök igen.');
                                    track('Account delete', { Success: false });
                                });
                            })
                            .catch(e => {
                                window.log('database().remove(): FAIL:', e);
                                showMessage('long', 'Det gick inte att radera ditt konto. Var god försök igen.');
                                track('Account delete', { Success: false });
                            });
                })
                .catch(e => {
                    this.setState({ deleteAccountMessage: getFirebaseError(e) });
                });
        } else {
            this.setState({ deleteAccountMessage: 'Var god fyll i din e-mail och ditt lösenord.' });
        }
    }

    validateDeleteAccount() {
        const { email, password } = this.state;
        return (password.length > 0 && email.length > 0);
    }

    renderDeleteAccount = () => {
        if (this.state.user.isAnonymous) {
            return null;
        }
        return (
            <TouchableNativeFeedback onPress={() => this.setState({ popupVisible: true })}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 60 }}>
                    <Text style={[component.text.menu.label, { paddingTop: 0, color: colors.danger }]}>
                        RADERA KONTO
                    </Text>
                </View>
            </TouchableNativeFeedback>
        );
    }

    renderFavoriteOrder = () => {
        if (this.state.user.isAnonymous) {
            return null;
        }
        return (
            <View style={{ height: 60 }}>
                <Text style={component.text.menu.label}>
                    SORTERA FAVORITER
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
            <View style={{ flex: 1 }}>

                <Popup
                    isVisible={this.state.popupVisible}
                    onPress={() => {
                        this.setState({ popupVisible: false });
                        Keyboard.dismiss();
                    }}
                >
                    <Text>
                        OBS! Det går inte att ångra denna åtgärd. All data kommer bli förlorad.
                        Om du ändå vill ta bort ditt konto så fyll i din e-mail och lösenord samt tryck på RADERA.
                    </Text>
                    <Input
                        keyboardType="email-address"
                        value={this.state.email}
                        onChangeText={text => this.setState({ email: text, deleteAccountMessage: '' })}
                        placeholder="e-mail"
                    />
                    <Input
                        secureTextEntry
                        value={this.state.password}
                        onChangeText={text => this.setState({ password: text, deleteAccountMessage: '' })}
                        placeholder="lösenord"
                    />
                    {this.state.deleteAccountMessage.length === 0 ?
                        null :
                        <Text style={{ color: colors.danger, marginBottom: metrics.margin.md }}>{this.state.deleteAccountMessage}</Text>
                    }
                    <Button
                        label="Radera"
                        uppercase
                        color="danger"
                        onPress={this.delete}
                    />
                </Popup>

                <ScrollView scrollEnabled keyboardShouldPersistTaps="always">

                    <View style={{ height: 60 }}>
                        <Text style={component.text.menu.label}>
                            TIDSFORMAT
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
                            HÅLLPLATSER NÄRA DIG
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

                    {this.renderDeleteAccount()}

                    <ListItemSeparator />

                </ScrollView>

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
