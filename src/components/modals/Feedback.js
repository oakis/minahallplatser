import React, { PureComponent } from 'react';
import { View, Modal, ScrollView, Alert } from 'react-native';
import fetch from 'react-native-cancelable-fetch';
import firebase from 'react-native-firebase';
import { Button, ListHeading, Input, Text } from '../common';
import { metrics, colors } from '../style';
import { track, getDeviceModel, getOsVersion, getAppVersion, handleJsonFetch } from '../helpers';
import { firebaseFunctionsUrl } from '../../Server';

export class Feedback extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            name: '',
            email: (firebase.auth().currentUser) ? firebase.auth().currentUser.email : '',
            message: '',
            validated: true
        };
    }

    reset() {
        this.setState({
            loading: false,
            name: '',
            email: firebase.auth().currentUser.email || '',
            message: '',
            validated: true
        });
    }

    validate() {
        const { name, email, message } = this.state;
        return (name.length > 0 && message.length > 0 && email.length);
    }

    render() {
        const inputStyle = { borderRadius: 15, paddingLeft: metrics.margin.sm, paddingRight: metrics.margin.sm, marginTop: metrics.margin.md, marginBottom: metrics.margin.md, backgroundColor: '#fff' };
        return (
            <Modal
                visible={this.props.visible}
                onRequestClose={this.props.close}
                animationType={'slide'}
            >
                <View style={{ flex: 1, backgroundColor: colors.background }}>
                    <ScrollView
                        contentContainerStyle={{ flex: 0 }}
                        keyboardShouldPersistTaps="always"
                    >
                        <ListHeading
                            text={'Skicka feedback'}
                            style={{ marginTop: metrics.margin.lg }}
                        />
                        <View
                            style={{ padding: metrics.padding.md, width: '100%' }}
                        >
                            <Text>Namn <Text style={{ color: colors.danger }}>*</Text></Text>
                            <Input
                                value={this.state.name}
                                onChangeText={(name) => this.setState({ name, validated: true })}
                                style={inputStyle}
                                underlineColorAndroid={'#fff'}
                            />
                            <Text>E-mail <Text style={{ color: colors.danger }}>*</Text></Text>
                            <Input
                                value={this.state.email}
                                onChangeText={(email) => this.setState({ email, validated: true })}
                                style={inputStyle}
                                underlineColorAndroid={'#fff'}
                            />
                            <Text>Meddelande <Text style={{ color: colors.danger }}>*</Text></Text>
                            <Input
                                value={this.state.message}
                                onChangeText={(message) => this.setState({ message, validated: true })}
                                style={inputStyle}
                                underlineColorAndroid={'#fff'}
                                multiline
                            />
                            {this.state.validated ? null : <Text style={{ color: colors.danger, marginBottom: metrics.margin.md }}>Var god fyll i ditt namn, en giltig e-mail och ett meddelande.</Text>}
                            <Button
                                label="Skicka feedback"
                                onPress={() => {
                                    if (this.validate()) {
                                        const { name, email, message } = this.state;
                                        this.setState({ loading: true });
                                        window.log(`Send feedback: - Name: ${name} - E-mail: ${email} - Message: ${message} - Device: ${getDeviceModel()} - OS: ${getOsVersion()} - App Version: ${getAppVersion()}`);
                                        const url = `${firebaseFunctionsUrl}/sendFeedback?name=${name}&email=${email}&message=${message}&device=${getDeviceModel()}&os=${getOsVersion()}&appVersion=${getAppVersion()}`;
                                        fetch(url, {}, 'sendFeedback')
                                        .finally(handleJsonFetch)
                                        .then(() => {
                                            track('Feedback Send');
                                            window.log('sendFeedback(): OK');
                                            Alert.alert('', 'Tack för din feedback!');
                                            this.reset();
                                        })
                                        .catch((err) => {
                                            track('Feedback Failed', { Error: err });
                                            window.log('sendFeedback(): FAILED', err);
                                            Alert.alert('', 'Något gick snett, försök igen senare.');
                                            this.setState({ loading: false });
                                        })
                                        .finally(() => this.props.close());
                                    } else {
                                        this.setState({ validated: false });
                                    }
                                }}
                                uppercase
                                loading={this.state.loading}
                                color={'primary'}
                                fontColor={'alternative'}
                            />
                            <Button
                                label="Avbryt"
                                onPress={() => {
                                    track('Feedback Cancel');
                                    this.props.close();
                                }}
                                uppercase
                                color={'danger'}
                                fontColor={'alternative'}
                            />
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        );
    }

}
