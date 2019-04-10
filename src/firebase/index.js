import config from './config'
//
import firebase from 'firebase/'

firebase.initializeApp(config);

export const ref = firebase.database().ref('entities')
export const refConn = firebase.database().ref('connections')
export const refConnType = firebase.database().ref('connType');
export const refDashType = firebase.database().ref('dashType');
export const refGlobalConnType = firebase.database().ref('globalConnType');
export const refProjects = firebase.database().ref('projects');

