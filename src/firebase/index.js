import config from './config'
//
import firebase from 'firebase/'

firebase.initializeApp(config);

export const ref = firebase.database().ref('entities')
export const refConn = firebase.database().ref('connections')
export const refConnType = firebase.database().ref('connType');
export const refDashType = firebase.database().ref('dashType');
