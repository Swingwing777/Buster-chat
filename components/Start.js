// Start.js is the Start/Home screen for the application

import React, { Component } from 'react';

import {
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

export default class Start extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      backGround: '',
    }
  }

  render() {

    /**
   * TextInput sets the user's name
   * TouchableOpacity elements set the background color for the next screen
   * and allow bespoke styling
   */

    return (
      <View style={styles.container}>
        <ImageBackground
          style={styles.image}
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
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.buttonColor, styles.button1]}
                accessibilityLabel='Select Black Background'
                onPress={() => this.setState({ backGround: '#090C08' })}
              />

              <TouchableOpacity
                style={[styles.buttonColor, styles.button2]}
                accessibilityLabel='Select Dark Grey Background'
                onPress={() => this.setState({ backGround: '#474056' })}
              />

              <TouchableOpacity
                style={[styles.buttonColor, styles.button3]}
                accessibilityLabel='Select Mid Grey Background'
                onPress={() => this.setState({ backGround: '#8A95A5' })}
              />

              <TouchableOpacity
                style={[styles.buttonColor, styles.button4]}
                accessibilityLabel='Select Field Grey Background'
                onPress={() => this.setState({ backGround: '#B9C6AE' })}
              />

            </View>

            <TouchableOpacity
              style={styles.chatButton}
              accessibilityLabel='Start chatting'
              color='#757083'
              onPress={
                () => this.props.navigation.navigate(
                  'Chat',
                  {
                    name: this.state.name,
                    backGround: this.state.backGround
                  }
                )
              }
            >
              <Text style={styles.chatButtonText}>
                Start Chatting
                </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground >
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
    flex: 1,   // to cover screen
    resizeMode: "cover",
    justifyContent: "space-between",  // Top-bottom distribution
    alignItems: "center"              // Left-right alignment
  },
  appTitle: {
    paddingTop: '15%',
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    justifyContent: "flex-start",

  },
  boxWrapper: {
    // flex: 1,
    flexDirection: 'column',
    width: '88%',
    height: '44%',
    backgroundColor: '#FFF',
    justifyContent: "space-between",
    paddingBottom: '6%',
    marginBottom: '6%',
  },
  nameInput: {
    width: '88%',
    height: '18%',
    borderColor: '#000',
    borderWidth: 1,
    opacity: 0.5,
    alignSelf: 'center',
    marginTop: '6%',
    paddingLeft: '6%'
  },
  chooseColor: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 1,
    marginLeft: '6%',
    borderColor: '#000',
    marginTop: '5%',
  },
  buttonRow: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingLeft: 16,
    marginBottom: '2%'
  },
  buttonColor: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: '#FFF',
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
    height: '18%',
    backgroundColor: '#757083',
    paddingHorizontal: '6%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  chatButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    alignSelf: 'center',
  }
});


