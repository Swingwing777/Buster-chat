// Start.js is the Start/Home screen for the application

import React from 'react';
import {
  View,
  Button,
  TextInput
} from 'react-native';

export default class Start extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = { name: '' };
  // }
  state = {
    name: '',
  }

  render() {

    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <TextInput
          onChangeText={(name) => this.setState({ name })}
          value={this.state.name}
          placeholder='Your Name'
        />

        <Button
          title="Start Chatting"
          onPress={
            () => this.props.navigation.navigate(
              'Chat',
              { name: this.state.name }
            )
          }
        />
      </View>
    )
  }
}