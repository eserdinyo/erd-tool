import config from './config'
//
import firebase from 'firebase/'

firebase.initializeApp(config);

export const refConnType = firebase.database().ref('connType');
export const ref = firebase.database().ref('entities')
export const refConn = firebase.database().ref('connections')
