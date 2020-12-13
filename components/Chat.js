// Chat.js

import React, { Component } from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View
} from 'react-native';

export default class Chat extends Component {
  constructor() {
    super();

    this.state = {
      backGround: '',
      messages: [],
    };
  };

  /* Separate init() method to keep update functions outside 
  render method - to prevent React Warning
  */

  init() {
    // Variables declared from the passed-in props 
    let { name, backGround } = this.props.route.params;

    // Set a default username if the user does not enter one
    if (!name || name === '') name = 'User';

    // Displays username on the navbar in place of the title
    this.props.navigation.setOptions({ title: name });
    this.setState({
      name: name,
      backGround: backGround,
    })
  }

  componentDidMount() {
    this.init();

    // This sets a static messages object in the required format 
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: `Developer has entered the chat`,
          createdAt: new Date(),
          system: true,
        },
      ],
    })
  }

  /* This adds each new message to the preceding messages state
   and returns a new messages state */
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#E8F5FF',
          },
          right: {
            backgroundColor: '#081721'
          }
        }} />
    )
  }

  render() {

    let { name, backGround } = this.state;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: backGround
        }}
      >
        <GiftedChat
          renderBubble={this.renderBubble}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />

        { Platform.OS === 'android'
          ? <KeyboardAvoidingView behavior="height" />
          : null
        }

      </View>
    )
  }
}
