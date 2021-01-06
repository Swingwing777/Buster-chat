import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, LogBox } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import firebase from "firebase";

// Ignore all log notifications:
LogBox.ignoreAllLogs();

export default class CustomActions extends Component {

  // This requests permission to access media and pick image
  pickImage = async () => {
    try {
      // alias for Permissions.askAsync(Permissions.CAMERA_ROLL)
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status === 'granted') {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          // Note: Default setting
          // Other options here
        }).catch(error => console.log(error));

        if (!result.cancelled) {
          // const imageUrl = await this.uploadImage(result.uri);
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // This requests permission to use camera and take photo
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
          // const imageUrlLink = await this.uploadImage(result.uri);
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Method 1 - upload Gallery or Camera image to Storage with fetch() and blob()
  uploadImageFetch = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const getImageName = uri.split("/");   // To split the uri into array
      const imageFinalString = getImageName[getImageName.length - 1];
      const ref = firebase
        .storage()
        .ref()
        .child(`images/${imageFinalString}`);

      const snapshot = await ref.put(blob);

      const imageURL = await snapshot.ref.getDownloadURL();
      return imageURL;
    } catch (error) {
      console.log(error);
    }
  }

  // Method 2 - upload Gallery or Camera image to Storage with XMLHttpRequest
  uploadImage = async (uri) => {
    try {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });

      const getImageName = uri.split("/");   // To split the uri into array
      const imageFinalString = getImageName[getImageName.length - 1];
      const ref = firebase
        .storage()
        .ref()
        .child(`images/${imageFinalString}`);

      const snapshot = await ref.put(blob);

      blob.close();

      const imageURL = await snapshot.ref.getDownloadURL();
      return imageURL;
    } catch (error) {
      console.log(error);
    }
  };

  //This requests permission to access location
  getLocation = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === 'granted') {
        let result = await Location.getCurrentPositionAsync({});

        if (result) {
          this.props.onSend({
            location: {
              longitude: result.coords.longitude,
              latitude: result.coords.latitude,
            },
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

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
        try {
          switch (buttonIndex) {
            case 0:
              console.log('user wants to pick an image');
              this.pickImage();
              return;
            case 1:
              console.log('user wants to take a photo');
              this.takePhoto();
              return;
            case 2:
              console.log('user wants to get their location');
              this.getLocation();
              return;
            default:
          }
        } catch (error) {
          console.log(error)
        }
      },
    );
  };

  render() {
    // const { statusMessage, recording, uri, playMessage } = this.state;
    return (
      <TouchableOpacity
        style={[styles.container]}
        onPress={this.onActionPress}>
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text
            style={[styles.iconText, this.props.iconTextStyle]}
            accessibilityLabel='Message Options'
            accessibilityRole='menu'
          >+</Text>
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
