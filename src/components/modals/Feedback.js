import React, {useState} from 'react';
import {View, Modal, ScrollView, Alert} from 'react-native';
import database from '@react-native-firebase/database';
import {Button, ListHeading, Input, Text} from '@common';
import {metrics, colors} from '@style';
import {track, getDeviceModel, getOsVersion, getAppVersion} from '@helpers';

const inputStyle = {
  borderRadius: 15,
  paddingLeft: metrics.margin.sm,
  paddingRight: metrics.margin.sm,
  marginTop: metrics.margin.md,
  marginBottom: metrics.margin.md,
  backgroundColor: '#fff',
};

export const Feedback = props => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [validated, setValidated] = useState(true);

  const feedbackDB = database().ref('/feedback').push();

  const onChangeEmail = str => {
    setEmail(str);
    setValidated(true);
  };

  const onChangeName = str => {
    setName(str);
    setValidated(true);
  };

  const onChangeMessage = str => {
    setMessage(str);
    setValidated(true);
  };

  const cancel = () => {
    track('Feedback Cancel');
    props.close();
  };

  const reset = () => {
    setLoading(false);
    setName('');
    setEmail('');
    setMessage('');
    setValidated(true);
  };

  const sendFeedback = () => {
    if (validate()) {
      setLoading(true);
      window.log(
        `Send feedback: - Name: ${name} - E-mail: ${email} - Message: ${message} - Device: ${getDeviceModel()} - OS: ${getOsVersion()} - App Version: ${getAppVersion()}`,
      );
      feedbackDB
        .set({
          name,
          email,
          message,
          device: getDeviceModel(),
          os: getOsVersion(),
          appVersion: getAppVersion(),
        })
        .then(() => {
          track('Feedback Send');
          window.log('sendFeedback(): OK');
          Alert.alert('', 'Tack för din feedback!');
          reset();
        })
        .catch(err => {
          track('Feedback Failed', err);
          window.log('sendFeedback(): FAILED', err);
          Alert.alert('', 'Något gick snett, försök igen senare.');
          setLoading(false);
        })
        .then(props.close);
    } else {
      setValidated(false);
    }
  };

  const validate = () => {
    return name.length > 0 && message.length > 0 && email.length > 0;
  };

  return (
    <Modal
      visible={props.visible}
      onRequestClose={props.close}
      animationType="slide">
      <View style={{flex: 1, backgroundColor: colors.background}}>
        <ScrollView
          contentContainerStyle={{flex: 0}}
          keyboardShouldPersistTaps="always">
          <ListHeading
            text="Skicka feedback"
            style={{marginTop: metrics.margin.lg}}
          />
          <View style={{padding: metrics.padding.md, width: '100%'}}>
            <Text>
              Namn <Text style={{color: colors.danger}}>*</Text>
            </Text>
            <Input
              value={name}
              onChangeText={onChangeName}
              style={inputStyle}
              underlineColorAndroid="#fff"
            />
            <Text>
              E-mail <Text style={{color: colors.danger}}>*</Text>
            </Text>
            <Input
              value={email}
              onChangeText={onChangeEmail}
              style={inputStyle}
              underlineColorAndroid="#fff"
            />
            <Text>
              Meddelande <Text style={{color: colors.danger}}>*</Text>
            </Text>
            <Input
              value={message}
              onChangeText={onChangeMessage}
              style={inputStyle}
              underlineColorAndroid="#fff"
              multiline
            />
            {validated ? null : (
              <Text
                style={{
                  color: colors.danger,
                  marginBottom: metrics.margin.md,
                }}>
                Var god fyll i ditt namn, en giltig e-mail och ett meddelande.
              </Text>
            )}
            <Button
              label="Skicka feedback"
              onPress={sendFeedback}
              uppercase
              loading={loading}
              color="primary"
              fontColor="alternative"
            />
            <Button
              label="Avbryt"
              onPress={cancel}
              uppercase
              color="danger"
              fontColor="alternative"
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};
