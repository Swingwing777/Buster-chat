/* eslint-disable linebreak-style */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const backgroundImg = require('../assets/background.png');

export default class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      backGround: '',
    };
  }

  render() {
    /**
    * TextInput sets the user's name;
    * TouchableOpacity elements set the background
    * color for the next screen.
    */
    const { name, backGround } = this.state;
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <ImageBackground
          style={styles.image}
          source={backgroundImg}
          accessibilityRole="image"
        >

          <Text style={styles.appTitle} accessibilityRole="text">
            Chit-Chat
          </Text>

          <View style={styles.boxWrapper}>

            <TextInput
              style={styles.nameInput}
              accessible
              accessibilityLabel="Type name here"
              accessibilityHint="Adds your name to the Chat screen"
              accessibilityRole="none"
              // eslint-disable-next-line no-shadow
              onChangeText={(name) => this.setState({ name })}
              value={name}
              placeholder="Your Name"
            />

            <Text style={styles.chooseColor}>
              Choose Background Color
            </Text>
            <View
              style={styles.buttonRow}
              accessibilityRole="combobox"
            >
              <TouchableOpacity
                style={[styles.buttonColor, styles.button1]}
                accessibilityLabel="Press me"
                accessibilityHint="Selects a black Chat background"
                accessibilityRole="button"
                onPress={() => this.setState({ backGround: '#090C08' })}
              />

              <TouchableOpacity
                style={[styles.buttonColor, styles.button2]}
                accessibilityLabel="Press me"
                accessibilityHint="Selects a dark grey Chat background"
                accessibilityRole="button"
                onPress={() => this.setState({ backGround: '#474056' })}
              />

              <TouchableOpacity
                style={[styles.buttonColor, styles.button3]}
                accessibilityLabel="Press me"
                accessibilityHint="Selects a mid grey Chat background"
                accessibilityRole="button"
                onPress={() => this.setState({ backGround: '#8A95A5' })}
              />

              <TouchableOpacity
                style={[styles.buttonColor, styles.button4]}
                accessibilityLabel="Press me"
                accessibilityHint="Selects a field grey Chat background"
                accessibilityRole="button"
                onPress={() => this.setState({ backGround: '#B9C6AE' })}
              />

            </View>

            <TouchableOpacity
              style={styles.chatButton}
              accessible
              accessibilityLabel="Start chatting"
              accessibilityHint="Navigates to the Chat screen"
              accessibilityRole="button"
              color="#757083"
              onPress={
                () => navigation.navigate(
                  'Chat',
                  {
                    name,
                    backGround,
                  },
                )
              }
            >
              <Text style={styles.chatButtonText}>
                Start Chatting
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    flex: 1, // To fill full space
    resizeMode: 'cover',
    justifyContent: 'space-between', // Top-bottom distribution
    alignItems: 'center', // Left-right alignment
  },
  appTitle: {
    paddingTop: '15%',
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    justifyContent: 'flex-start',

  },
  boxWrapper: {
    // flex: 1,
    flexDirection: 'column',
    width: '88%',
    height: '44%',
    backgroundColor: '#FFF',
    justifyContent: 'space-between',
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
    paddingLeft: '6%',
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
    marginBottom: '2%',
  },
  buttonColor: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: '#FFF',
  },
  button1: {
    backgroundColor: '#090C08',
  },
  button2: {
    backgroundColor: '#474056',
  },
  button3: {
    backgroundColor: '#8A95A5',
  },
  button4: {
    backgroundColor: '#B9C6AE',
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
  },
});

Start.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
