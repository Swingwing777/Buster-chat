// Start.js is the Start/Home screen for the application

import React from 'react';

import {
  Button,
  ImageBackground,
  StyleSheet,
  TextInput,
  View
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
      <ImageBackground
        style={{ flex: 1 }}
        source={require('../assets/Background Image.png')}
      >
        <View style={styles.container}>
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
      </ImageBackground>
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
