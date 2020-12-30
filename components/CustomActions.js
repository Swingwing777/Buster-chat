import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';

export default class CustomActions extends Component {
  // constructor() {
  //   super();
  // }

  // state = {
  // }

  onActionPress = () => {
    const options = [
      'Choose From Library',
      'Take Picture',
      'Send Location',
      'Cancel'
    ];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log('user wants to pick an image');
            this.pickImage();
            return;
          case 1:
            console.log('user wants to take a photo');
            this.takePhoto()
            return;
          case 2:
            console.log('user wants to get their location');
            this.getLocation();
            return;
          default:                     // What is default for?
        }
      },
    );
  };

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
    // const { statusMessage, recording, uri, playMessage } = this.state;
    return (
      <TouchableOpacity
        style={[styles.container]}
        onPress={this.onActionPress}>
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};


// Additional rendering from experiement project..........................

  // <View style={{ flex: 1, justifyContent: 'center' }}>
      //   <Text>{statusMessage}</Text>
      //   <Text>{playMessage}</Text>
      //   <Button
      //     title="Pick an image from the library"
      //     onPress={this.pickImage}
      //   />

      //   <Button
      //     title="Take a photo"
      //     onPress={this.takePhoto}
      //   />

      //   <Button
      //     title={recording ? 'Stop Recording' : 'Start Recording'}
      //     onPress={recording ? this.stopRecording : this.startRecording}
      //   />

      //   <Button
      //     title="Play Audio"
      //     onPress={this.playSound}
      //   />
      //   <Text>{uri}</Text>

      //   <Button
      //     title="Get my location"
      //     onPress={this.getLocation}
      //   />

      //   {/* Nothing renders unless both are true */}
      //   {this.state.image &&
      //     <Image
      //       source={{ uri: this.state.image.uri }}
      //       style={{ width: 200, height: 200 }}
      //     />
      //   }

      //   {/* Nothing renders unless both are true */}
      //   {this.state.location &&
      //     <MapView
      //       style={{ width: 300, height: 200 }}
      //       region={{
      //         latitude: this.state.location.coords.latitude,
      //         longitude: this.state.location.coords.longitude,
      //         latitudeDelta: 0.0922,
      //         longitudeDelta: 0.0421,
      //       }}
      //     />}
      // </View>
