// Chat.js

import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class Chat extends React.Component {
  render() {
    let name = this.props.route.params.name;   // OR ...
    // let { name } = this.props.route.params;

    this.props.navigation.setOptions({ title: name });

    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text>Hello Everyone</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});