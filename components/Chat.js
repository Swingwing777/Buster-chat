// Chat.js

import React, { Component } from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import firebase from "firebase";
import "firebase/firestore";

import {
  KeyboardAvoidingView,
  Platform,
  Alert,
  View,
  Text
} from 'react-native';

export default class Chat extends Component {
  constructor() {
    super();

    this.state = {
      backGround: '',
      name: '',
      messages: [],
      loggedInText: 'Please wait for authentication',
      user: {
        _id: '',
        name: '',
        avatar: ''
      },
    };

    const firebaseConfig = {
      apiKey: "AIzaSyAslhRrYTA1g6UsYGc5XfYFDtOB2HkQD50",
      authDomain: "test-8c742.firebaseapp.com",
      projectId: "test-8c742",
      storageBucket: "test-8c742.appspot.com",
      messagingSenderId: "26001870209",
      appId: "1:26001870209:web:81ed424ddc9a29bdc6ec80",
      measurementId: "G-CEKYF200N3"
    }

    /* Firebase initialization must come before
     any Firebase requests */
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // Reference to messages collection
    this.referenceMessages =
      firebase.firestore().collection('messages');
  };

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      const data = doc.data();

      // Format to match GiftedChat format
      messages.push({
        _id: data._id,
        text: data.text.toString(),
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });
    this.setState({
      messages,
    });

    // If no messages
    if (!messages.length > 0) {
      Alert.alert('You have no messages');
    }

  };

  componentDidMount() {

    let { name, backGround } = this.props.route.params;

    // Set a default username if the user does not enter one
    if (!name || name === '') name = 'User';

    // Displays desired background and username in the navbar
    this.props.navigation.setOptions({ title: name });
    this.setState({
      name: name,
      backGround: backGround,
    })

    // Firebase user authentication
    this.authUnsubscribe = firebase.auth().
      onAuthStateChanged(async (user) => {
        if (!user) {
          await firebase.auth().signInAnonymously();
        }

        // Update user state with currently active user data
        this.setState({
          user: {
            _id: user._id,
            name: name,
            avatar: "https://placeimg.com/140/140/any",
          },
          loggedInText: `${name} has entered the chat`,
          messages: [],
        });
      });

    // User wants to see all messages, not filtered.
    if (this.referenceMessages !== null) {
      this.unsubscribe = this.referenceMessages
        .onSnapshot(this.onCollectionUpdate);

    } else {
      Alert.alert('You have no messages');
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.authUnsubscribe();
  }


  // Messages added to Firestore from state
  addMessages = () => {
    // Find the newest (ie first ) message of messages state 
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user._id,
      sent: true,
    });
  };

  /* This adds each new message to the preceding messages state
  and returns a new messages state */
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessages();
      }
    );
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#bdbdbd',   // Grey
          },
          right: {
            backgroundColor: '#081721'    // Midnight blue
          }
        }} />
    )
  }

  render() {

    let { backGround } = this.state;

    return (
      <View

        /* Flex: 1 prop essential to ensure View
         fills entire available space */
        style={{
          flex: 1,
          backgroundColor: backGround
        }}
      >
        <Text>{this.state.loggedInText}</Text>

        {/* GiftedChat renders chat progress */}
        <GiftedChat
          renderBubble={this.renderBubble}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={this.state.user._id}
        />

        {/* Cures Android keyboard overlap issue */}
        { Platform.OS === 'android'
          ? <KeyboardAvoidingView behavior="height" />
          : null
        }
      </View>
    )
  }
}
