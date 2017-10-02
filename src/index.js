import React from 'react'
import ReactDOM from 'react-dom'
import Routes from './Routes';
import * as firebase from 'firebase';
import 'antd/dist/antd.css';
import 'semantic-ui-css/semantic.min.css';

// Initialize Firebase
var config = {
  apiKey: "AIzaSyA6qG8P_MaSCMlMfxRn_Q7wzsuNoCd_6G0",
  authDomain: "bidding-ead3c.firebaseapp.com",
  databaseURL: "https://bidding-ead3c.firebaseio.com",
  projectId: "bidding-ead3c",
  storageBucket: "bidding-ead3c.appspot.com",
  messagingSenderId: "617223192535"
};
firebase.initializeApp(config);

ReactDOM.render(
  <Routes />,
  document.getElementById('root')
);
