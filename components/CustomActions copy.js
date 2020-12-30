import React from 'react';
import { View, Text, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';

export default class App extends React.Component {
  constructor() {
    super();
  }

  state = {
    image: null,
    recording: undefined,
    statusMessage: '',
    playMessage: '',
    recordedAudio: null,
    uri: null,
    location: null
  }

  // This requests permission to access media and pick image
  pickImage = async () => {
    try {
      // alias for Permissions.askAsync(Permissions.CAMERA_ROLL)
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status === 'granted') {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,    // Note: Default setting
        }).catch(error => console.log(error));

        if (!result.cancelled) {
          this.setState({
            image: result
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  takePhoto = async () => {
    try {
      const { status } = await Permissions.askAsync(
        Permissions.CAMERA,
        Permissions.CAMERA_ROLL
      );

      if (status === "granted") {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch((error) => console.log(error));

        if (!result.cancelled) {
          this.setState({
            image: result
          });
          // const imageUrlLink = await this.uploadImage(result.uri);
          // this.props.onSend({ image: imageUrlLink });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  startRecording = async () => {

    try {
      this.setState({
        statusMessage: 'Requesting permissions..',
      });
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      this.setState({
        statusMessage: 'Start recording...',
      });
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      this.setState({
        recording: 'recording',
        statusMessage: 'Recording Started',
        recordedAudio: recording,
      })

    } catch (error) {
      console.error('Failed to start recording', error);
    }
  }

  stopRecording = async () => {
    const recording = this.state.recordedAudio;
    this.setState({
      statusMessage: 'Stopping recording...',
    })

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    this.setState({
      recording: undefined,
      statusMessage: 'Recording Stopped',
      uri: uri,
    })
    console.log('Recording stopped and stored at', uri);
  }

  playSound = async () => {
    const sound = new Audio.Sound();
    const path = './assets/Hello.mp3';
    try {

      // Load the audio clip
      await sound.loadAsync(require('./assets/Hello.mp3'));

      // Play the audio clip
      await sound.playAsync();
      this.setState({
        playMessage: 'Playing audio clip',
      })
      console.log(`Playing audio clip: ${path}`);

      // Unload audio clip from memory when done
      await sound.unloadAsync();
      this.setState({
        playMessage: 'Playback stopped',
      })

    } catch (error) {
      console.log('Playback error:', error);
    }
  }

  getLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      let result = await Location.getCurrentPositionAsync({});

      if (result) {
        this.setState({
          location: result
        });
        console.log(result);
      }
    }
  }

  render() {
    const { statusMessage, recording, uri, playMessage } = this.state;
    return (

      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text>{statusMessage}</Text>
        <Text>{playMessage}</Text>
        <Button
          title="Pick an image from the library"
          onPress={this.pickImage}
        />

        <Button
          title="Take a photo"
          onPress={this.takePhoto}
        />

        <Button
          title={recording ? 'Stop Recording' : 'Start Recording'}
          onPress={recording ? this.stopRecording : this.startRecording}
        />

        <Button
          title="Play Audio"
          onPress={this.playSound}
        />
        <Text>{uri}</Text>

        <Button
          title="Get my location"
          onPress={this.getLocation}
        />

        {/* Nothing renders unless both are true */}
        {this.state.image &&
          <Image
            source={{ uri: this.state.image.uri }}
            style={{ width: 200, height: 200 }}
          />
        }

        {/* Nothing renders unless both are true */}
        {this.state.location &&
          <MapView
            style={{ width: 300, height: 200 }}
            region={{
              latitude: this.state.location.coords.latitude,
              longitude: this.state.location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />}
      </View>
    );
  }
}

