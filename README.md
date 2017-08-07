# Mina Hållplatser

## What is this?

This is a small school project for a frontend course.
It's an mobile app used to check departures from the local public transportation company (bus, tram).
Technologies used are React Native, Redux, redux-thunk, Firebase, base-64, lodash, moment, native-base, react-native-router-flux and react-native-vector-icons.

## Setup for development

* Open a new terminal window and type `git clone https://github.com/oakis/minahallplatser.git`

* Follow this guide up until "Testing your React Native Installation".
https://facebook.github.io/react-native/docs/getting-started.html

* In terminal type `npm install`.

* Create an account at http://developer.vasttrafik.se
and then create a new file src/Vasttrafik.js

##### src/Vasttrafik.js
```
export const key = '<YOUR-KEY>';
export const secret = '<YOUR-SECRET>';
export const url = 'https://api.vasttrafik.se/token';
```

* In terminal type `react-native start`.

* Open up a new terminal and type `react-native run-android`.

The app should now start in your Android emulator.
