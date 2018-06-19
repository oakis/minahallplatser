import React, { PureComponent } from 'react';
import {
    View,
    ScrollView,
} from 'react-native';
import firebase from 'react-native-firebase';
import {
    ListItem,
    ListItemSeparator,
} from './common';

class Profile extends PureComponent {
    render() {
        const user = firebase.auth().currentUser;
        console.log(user);
        return (
            <View style={{ flex: 1 }}>
                <ScrollView scrollEnabled keyboardShouldPersistTaps="always">
                    {user.providerData[0].displayName ?
                        <View>
                            <ListItem
                                text={user.providerData[0].displayName}
                                avatar={user.providerData[0].photoURL}
                                iconVisible
                            />
                            <ListItemSeparator />
                        </View>
                    : null}
                    <ListItem
                        text={user.email}
                        icon="ios-mail"
                        iconVisible
                    />
                    <ListItemSeparator />
                </ScrollView>
            </View>
        );
    }
}

export default Profile;
