// Chat.js

import React, { Component } from 'react';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'
import firebase from "firebase";
import "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";
import { Button, Keyboard } from 'react-native';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

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
      },
      image: null,
      location: null,
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

    // Firebase initialization must occur before any Firebase requests
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // Reference to messages collection
    this.referenceMessages =
      firebase.firestore().collection('messages');
  };

  componentDidMount() {
    let { name, backGround } = this.props.route.params;

    // Default username for title area if user does not enter one
    if (!name || name === '') name = 'User';

    // For login system message
    this.id = uuidv4();

    // Displays desired background and username in the navbar
    this.props.navigation.setOptions({ title: name });

    this.setState({
      name: name,
      backGround: backGround,
    })

    // Always want to retrieve chat messages from asyncStorage
    this.getMessages();

    // Checks if user online
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
              // orderBy ensures correct chronological order
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

  /** onCollectionUpdate queries the 
   * Firestore messages collection.
   * Note: arrow syntax binds 'this'
   * to the parent scope (ie Component), 
   * rather than to onCollectionUpdate() 
   */
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      // message format to match GiftedChat format
      messages.push({
        _id: data._id,
        text: data.text.toString(),
        createdAt: data.createdAt.toDate(),
        user: data.user,
        image: data.image || "",
        location: data.location
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

  /** getMessages retrieves locally
   * held messages from asyncStorager 
   * for offline viewing.
   */
  getMessages = async () => {
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

  /** saveMessages saves the 'messages'
   * state to local asyncStorage.
   */
  saveMessages = async () => {
    try {
      await AsyncStorage
        .setItem(
          'messages',
          JSON.stringify(this.state.messages)
        );
    } catch (error) {
      console.log(error.message);
    }
  }

  /** addMessages adds newest message
 * from 'messages' state to Firestore.
 */
  addMessages = () => {
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || "",
      location: message.location || null,
      sent: true,
    });
  };

  /** For Developer use - deletes the
   * 'messages' key from local Storage.
   */
  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  /** For Developer use - Clears Firestore
   * and leaves placeholder message
   * to maintain collection.
   */
  deleteMessagesFirestore = async () => {
    collectionPlaceholder =
    {
      _id: 1,
      text: 'Hello',
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'Creator',
        avatar: "https://sweepback.co.uk/img/creator.jpg",
      },
      sent: true,
    }
    try {
      this.referenceMessages.get()
        .then(res => {
          res.forEach(doc => {
            doc.ref.delete();
          })
          this.referenceMessages.add(collectionPlaceholder);
        })
    } catch (error) {
      console.log(error);
    }
  };

  /** onSend adds each new message to preceding
   * messages state and returns new messages state, 
   * triggering re-render.
   */
  onSend = (messages = []) => {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessages();
        this.saveMessages();
        Keyboard.dismiss();
      }
    );
  }

  /** renderBubble enables bespoke styling
   *  to adjust default GiftedChat styling
   */
  renderBubble = (props) => {
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

  /** renderInputToolbar renders the
   * input toolbar only if the user is online
   */
  renderInputToolbar = (props) => {
    if (props.isConnected == false) {
    } else {
      return (
        <InputToolbar
          {...props}
        />
      );
    }
  }

  /** renderCustomActions renders the
   * custom actions icon & hidden list
   * of user options within input toolbar
   */
  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  /** renderCustomView renders a Google map image
   * to display shared location.
   */
  renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {
    let { backGround } = this.state;
    let { loggedInText } = this.state;
    return (

      <View
        style={{
          // flex: 1 essential to fill all available space
          flex: 1,
          backgroundColor: backGround
        }}
      >
        <Text>{loggedInText}</Text>

        {/* GiftedChat renders chat progress */}
        <GiftedChat
          renderBubble={this.renderBubble}
          isConnected={this.state.isConnected}
          renderInputToolbar={this.renderInputToolbar}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={this.state.user}
          renderUsernameOnMessage={true}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
        />

        {/* Cures Android keyboard overlap issue */}
        { Platform.OS === 'android'
          ? <KeyboardAvoidingView behavior="height" />
          : null
        }

        {/* Development use only - comment out block for production */}
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
