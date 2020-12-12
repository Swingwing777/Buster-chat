// Chat.js

import React, { Component } from 'react';
import { GiftedChat } from 'react-native-gifted-chat'

import {
  StyleSheet,
  Text,
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
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />

      </View>
    )
  }
}

const styles = StyleSheet.create({
  // chatBackground: {
  //   flex: 1,
  //   flexDirection: 'column',
  //   justifyContent: 'flex-start',
  // },
  // userChat: {
  //   fontSize: 16,
  //   fontWeight: '300',
  //   color: '#000',
  //   borderColor: '#000',
  //   borderWidth: 1,
  //   borderRadius: 7,
  //   backgroundColor: '#FFF',
  //   alignSelf: 'flex-start',
  //   margin: '3%',
  //   paddingHorizontal: '1%',
  //   paddingVertical: '1%',
  // },
  // friendChat: {
  //   fontSize: 16,
  //   fontWeight: '300',
  //   color: '#000',
  //   borderColor: '#000',
  //   borderWidth: 1,
  //   borderRadius: 7,
  //   backgroundColor: '#d6d6d6',
  //   alignSelf: 'flex-end',
  //   margin: '3%',
  //   paddingHorizontal: '1%',
  //   paddingVertical: '1%',
  // }
});