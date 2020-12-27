// Chat.js

import React, { Component } from 'react';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'
import firebase from "firebase";
import "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";
import { Button, Keyboard } from 'react-native';

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
      isConnected: false,
      uid: 0,
      backGround: '#474056',
      name: '',
      messages: [],
      loggedInText: 'Please wait for authentication',
      user: {
        _id: '',
        name: '',
        avatar: '',
      }
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

  componentDidMount() {
    let { name, backGround } = this.props.route.params;
    //let isConnected = this.state.isConnected;

    /* Set a default username for title area 
    if the user does not enter one */
    if (!name || name === '') name = 'User';

    // create login system message
    this.id = uuidv4();

    // Displays desired background and username in the navbar
    this.props.navigation.setOptions({ title: name });

    this.setState({
      name: name,
      backGround: backGround,
    })

    // Always want to retrieve chat messages from asyncStorage
    this.getMessages();

    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {

        // Firebase user authentication
        this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async (user) => {
            if (!user) {
              try {
                await firebase.auth().signInAnonymously();
              } catch (error) {
                console.log(`Sign-in denied: ${error.message}`);
              }
            }

            // Update user state with currently active user data
            this.setState({
              isConnected: true,
              user: {
                _id: user.uid,
                name: name,
                avatar: "https://placeimg.com/140/140/any",
              },

              // Blank the authentication message
              loggedInText: '',
              messages: [
                {
                  _id: this.id,
                  text: `${name} has entered the chat`,
                  createdAt: new Date(),
                  system: true,
                }
              ],
            });

            this.unsubscribe = this.referenceMessages
              // Order by ensures correct chronological order
              .orderBy("createdAt", "desc")
              .onSnapshot(this.onCollectionUpdate);
          });
      } else {
        this.setState({
          isConnected: false,
          loggedInText: 'Offline',
        });

        // retrieve chat messages from asyncStorage 
        this.getMessages();
      }
    });
  }

  componentWillUnmount() {
    if (this.state.isConnected) {
      this.unsubscribe();
      this.authUnsubscribe();
    }
  }

  onCollectionUpdate = (querySnapshot) => {
    /* Use [] instead of this.state.messages to 
    avoid message duplication */
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

  // To update messages from local storage
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // To save messages state to local storage as 'messages' key 
  async saveMessages() {
    try {
      await AsyncStorage
        .setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  // To delete the locally stored 'messages' key
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  // Messages added to Firestore from state
  addMessages = () => {
    // Find the newest (ie first ) message of messages state 
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
      sent: true,
    });
  };

  // Developer use - Clears Firestore, leaves placeholder to maintain collection
  async deleteMessagesFirestore(error) {
    collectionPlaceholder =
    {
      _id: 1,
      text: 'Hello',
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'Creator',
        avatar: "https://sweepback.co.uk/img/creator.jpg",
        // avatar: '../assets/creator.jpg',
      },
      sent: true,
    }
    this.referenceMessages.get()
      .then(res => {
        res.forEach(doc => {
          doc.ref.delete();
        })
        this.referenceMessages.add(collectionPlaceholder);
      })
      .catch(error);
  }

  // Adds new message to preceding messages state & returns new messages state
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessages();

        // Call function to save to local storage
        this.saveMessages();
        // Hide keyboard after message sent
        Keyboard.dismiss();
      }
    );
  }

  // onLongPress(context, message) {
  //   const { messages } = this.state;
  //   const options = ['Delete Message', 'Copy Text', 'Cancel'];
  //   const cancelButtonIndex = options.length - 1;
  //   context.actionSheet().showActionSheetWithOptions({
  //     options,
  //     cancelButtonIndex
  //   }, (buttonIndex) => {
  //     switch (buttonIndex) {
  //       case 0:
  //         let temp = messages.filter(temp => message._id !== temp._id);
  //         this.setState({ messages: temp, });
  //         this.deleteMessageServer(temp);
  //         break;
  //       case 1:
  //         Clipboard.setString(this.props.currentMessage.text);
  //         break;
  //     }
  //   });
  // }

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

  // To render message toolbar only if user is online
  renderInputToolbar(props) {
    if (props.isConnected == false) {
    } else {
      return (
        <InputToolbar
          {...props}
        />
      );
    }
  }

  render() {
    let { backGround } = this.state;
    let { /* isConnected, */ loggedInText } = this.state;
    return (

      <View
        // Flex: 1 prop essential to ensure View fills entire available space
        style={{
          flex: 1,
          backgroundColor: backGround
        }}
      >
        <Text>{loggedInText}</Text>

        {/* Tempo render - to test isConnected state */}
        {/* <Text>isConnected state is: {isConnected.toString()}</Text> */}

        {/* GiftedChat renders chat progress */}
        <GiftedChat
          renderBubble={this.renderBubble}
          // Add isConnected state to GiftedChat props
          isConnected={this.state.isConnected}
          renderInputToolbar={this.renderInputToolbar}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={this.state.user}
          renderUsernameOnMessage={true}
          onLongPress={this.onLongPress}
        />

        {/* Cures Android keyboard overlap issue */}
        { Platform.OS === 'android'
          ? <KeyboardAvoidingView behavior="height" />
          : null
        }

        {/* Development use only */}
        <Button
          title='Dev Use: Delete Local/Remote'
          accessibilityLabel='Developer delete messages'
          onPress={() => {
            this.deleteMessages()
            this.deleteMessagesFirestore()
          }} />
      </View>
    )
  }
}
