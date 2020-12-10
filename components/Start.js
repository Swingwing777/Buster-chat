// Start.js is the Start/Home screen for the application

import React from 'react';

import {
  Button,
  ImageBackground,
  StyleSheet,
  Text,
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
    backgroundColor: '#090C08'
  }

  changeColor = (color) => {
    this.setState({
      backgroundColor: color
    })
  };

  render() {

    return (
      <View style={styles.container}>
        <ImageBackground
          style={styles.image}

          // local image source for background
          source={require('../assets/background.png')}
        >

          <Text style={styles.appTitle}>
            Chit-Chat
          </Text>

          <View style={styles.boxWrapper}>

            <TextInput
              style={styles.nameInput}
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
              placeholder='Your Name'
            />

            <Text style={styles.chooseColor}>
              Choose Background Color
            </Text>
            <View>
              <Button
                title=''
                accessibilityLabel='Select Black Background'
                style={styles.button, styles.button1}
              // onPress={
              //   this.changeColor('#090C08')
              // }
              >
              </Button>
              <Button
                title=''
                accessibilityLabel='Select Dark Grey Background'
                style={styles.button, styles.button2}
              // onPress={
              //   this.changeColor('#474056')
              // }
              >
              </Button>
              <Button
                title=''
                accessibilityLabel='Select Mid Grey Background'
                style={styles.button, styles.button3}
              // onPress={
              //   this.changeColor('#8A95A5')
              // }
              >
              </Button>
              <Button
                title=''
                accessibilityLabel='Select Field Grey Background'
                style={styles.button, styles.button4}
              // onPress={
              //   this.changeColor('#B9C6AE')
              // }
              >
              </Button>
            </View>

            <Button
              title="Start Chatting"
              style={styles.chatButton}
              onPress={
                () => this.props.navigation.navigate(
                  'Chat',
                  { name: this.state.name },
                  { backgroundColor: this.state.backgroundColor }
                )
              }
            />
          </View>
        </ImageBackground>
      </View >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  appTitle: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF'
  },
  boxWrapper: {
    width: '88%',
    height: '44%',
    backgroundColor: '#FFF',
  },
  nameInput: {
    width: '88%',
    borderColor: '#000',
    opacity: 0.5
  },
  chooseColor: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 1
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  button1: {
    backgroundColor: '#090C08'
  },
  button2: {
    backgroundColor: '#474056'
  },
  button3: {
    backgroundColor: '#8A95A5'
  },
  button4: {
    backgroundColor: '#B9C6AE'
  },
  chatButton: {
    width: '88%',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    backgroundColor: '#757083'
  }
});
