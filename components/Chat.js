import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import firebase from 'firebase';
import 'firebase/firestore';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {
  Button, Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
  View,
  Text,
} from 'react-native';
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';

/**
 * Creates a new Class component
 * @class Chat
 */
export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      isConnected: false,
      backGround: '#474056',
      messages: [],
      loggedInText: 'Please wait for authentication',
      user: {
        _id: '',
        name: '',
        avatar: '',
      },
    };

    const firebaseConfig = {
      apiKey: 'AIzaSyAslhRrYTA1g6UsYGc5XfYFDtOB2HkQD50',
      authDomain: 'test-8c742.firebaseapp.com',
      projectId: 'test-8c742',
      storageBucket: 'test-8c742.appspot.com',
      messagingSenderId: '26001870209',
      appId: '1:26001870209:web:81ed424ddc9a29bdc6ec80',
      measurementId: 'G-CEKYF200N3',
    };

    // Firebase initialization must occur before any Firebase requests
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // Reference to messages collection
    this.referenceMessages = firebase.firestore().collection('messages');
  }

  /**
   * Sets the user choices,
   * gets the local message store
   * authenticates the user,
   * displays system message and
   * sets initial states.
   * @function componentDidMount
   * @state isConnected
   * @state user
   * @state loggedInText
   * @state messages
   *
   */
  componentDidMount() {
    const { route, navigation } = this.props;
    let { name } = route.params;
    const { backGround } = route.params;

    // Default username for title area if user does not enter one
    if (!name || name === '') name = 'User';

    // For login system message
    this.id = uuidv4();

    // Displays desired background and username in the navbar
    navigation.setOptions({ title: name });

    this.setState({
      backGround,
    });

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
                name,
                avatar: 'https://placeimg.com/140/140/any',
              },

              // Blank the authentication message
              loggedInText: '',
              messages: [
                {
                  _id: this.id,
                  text: `${name} has entered the chat`,
                  createdAt: new Date(),
                  system: true,
                },
              ],
            });

            this.unsubscribe = this.referenceMessages
              // orderBy ensures correct chronological order
              .orderBy('createdAt', 'desc')
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

  /**
   * Unsubscribes from Firestore
   * and cancels user autherisation.
   * @function componentWillUnmount
   */
  componentWillUnmount() {
    const { isConnected } = this.state;
    if (isConnected) {
      this.unsubscribe();
      this.authUnsubscribe();
    }
  }

  /**
   * Query the Firestore messages collection.
   * Note: arrow syntax binds 'this'
   * to the parent scope (ie Component),
   * rather than to onCollectionUpdate()
   * @function onCollectionUpdate
   * @param {array} messages
   * @return {state} messages
   *
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
        image: data.image || '',
        location: data.location,
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

  /**
   * Retrieves locally
   * held messages from asyncStorager
   * for offline viewing.
   * @function getMessages
   * @async
   */
  getMessages = async () => {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  /**
   * Saves the 'messages'
   * state to local asyncStorage.
   * @function saveMessages
   * @async
   */
  saveMessages = async () => {
    try {
      const { messages } = this.state;
      await AsyncStorage
        .setItem(
          'messages',
          JSON.stringify(messages),
        );
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
   * Adds newest message
   * from 'messages' state to Firestore.
   * @function addMessages
   * @async
   */
  addMessages = () => {
    const { messages } = this.state;
    const message = messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || '',
      location: message.location || null,
      sent: true,
    });
  };

  /**
   * *For Developer use only*:
   * Deletes 'messages' key
   * from local asyncStorage.
   * @function deleteMessages
   * @async
   */
  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
   * *For Developer use only*:
   * Clears Firestore and
   * leaves placeholder message
   * to maintain collection.
   * @function deleteMessagesFirestore
   * @async
   */
  deleteMessagesFirestore = async () => {
    const collectionPlaceholder = {
      _id: 1,
      text: 'Hello',
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'Creator',
        avatar: 'https://sweepback.co.uk/img/creator.jpg',
      },
      sent: true,
    };
    try {
      this.referenceMessages.get()
        .then((res) => {
          res.forEach((doc) => {
            doc.ref.delete();
          });
          this.referenceMessages.add(collectionPlaceholder);
        });
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Adds each new message to
   * preceding messages state;
   * returns new messages state.
   * @function onSend
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
      },
    );
  }

  /**
   * Enables bespoke styling
   * to default GiftedChat.
   * @function renderBubble
   */
  renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        left: {
          backgroundColor: '#bdbdbd', // Grey
        },
        right: {
          backgroundColor: '#081721', // Midnight blue
        },
      }}
    />
  )

  /**
   * Renders input toolbar
   * only if user is online.
   * @function renderInputToolbar
   */
  renderInputToolbar = (props) => {
    // eslint-disable-next-line no-empty
    if (props.isConnected === false) {
    } else {
      return (
        <InputToolbar
          {...props}
        />
      );
    }
  }

  /**
   * Renders custom actions icon
   * & hidden list of user options
   * within input toolbar.
   * @function renderCustomActions
   */
  renderCustomActions = (props) => <CustomActions {...props} />;

  /**
   * Renders a Google map image
   * to display shared location.
   * @function renderCustomView
   */
  renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 20,
            margin: 3,
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
    const {
      backGround,
      loggedInText,
      messages,
      isConnected,
      user,
    } = this.state;
    return (

      <View
        style={{
          // flex: 1 essential to fill all available space
          flex: 1,
          backgroundColor: backGround,
        }}
      >
        <Text>{loggedInText}</Text>

        {/* GiftedChat renders chat progress */}
        <GiftedChat
          renderBubble={this.renderBubble}
          isConnected={isConnected}
          renderInputToolbar={this.renderInputToolbar}
          messages={messages}
          onSend={(message) => this.onSend(message)}
          user={user}
          renderUsernameOnMessage
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
        />

        {/* Cures Android keyboard overlap issue */}
        { Platform.OS === 'android'
          ? <KeyboardAvoidingView behavior="height" />
          : null}

        {/* Development use only - comment out block for production */}
        <Button
          title="Dev Use: Delete Local/Remote"
          accessibilityLabel="Developer delete messages"
          onPress={() => {
            this.deleteMessages();
            this.deleteMessagesFirestore();
          }}
        />
      </View>
    );
  }
}

Chat.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      backGround: PropTypes.string,
      name: PropTypes.string,
    }),
  }).isRequired,
  navigation: PropTypes.shape({
    setOptions: PropTypes.func,
  }).isRequired,
};
