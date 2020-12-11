// Chat.js

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class Chat extends Component {
  constructor() {
    super();

    this.state = {
      backGround: ''
    };
  };


  init() {
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
    this.init();   // here is the right place to change header title or other properties
  }

  render() {
    // Use params passed by navigation.navigate to 'Chat'

    let { backGround } = this.props.route.params;


    return (
      <View
        style={[styles.chatBackground, { backGround }]}
      >

        {/* To be changed to a combination of previous texts and a textInput */}
        <Text style={styles.userChat}>Hello</Text>
        <Text style={styles.friendChat}>Hello {this.state.name}</Text>
        <Text style={styles.userChat}>My colour choice is: `{this.state.backGround}`</Text>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  chatBackground: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  userChat: {
    fontSize: 16,
    fontWeight: '300',
    color: '#000',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 7,
    backgroundColor: '#FFF',
    alignSelf: 'flex-start',
    margin: '3%',
    paddingHorizontal: '1%',
    paddingVertical: '1%',
  },
  friendChat: {
    fontSize: 16,
    fontWeight: '300',
    color: '#000',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 7,
    backgroundColor: '#d6d6d6',
    alignSelf: 'flex-end',
    margin: '3%',
    paddingHorizontal: '1%',
    paddingVertical: '1%',
  }
});