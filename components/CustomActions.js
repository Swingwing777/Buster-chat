import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  LogBox,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import firebase from 'firebase';

// Ignore all log notifications:
LogBox.ignoreAllLogs();

/**
 * ##### Creates a new Class component:
 * - to control user-selectable actions
 * @class CustomActions
 */
export default class CustomActions extends Component {
  /**
   * ##### Purpose:
   * - Requests permission to access device media
   *  gallery to pick image.
   * @async
   * @function pickImage
   * @param {*} props onSend
   * @param {*} props status
   */
  pickImage = async () => {
    try {
      const { onSend } = this.props;
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status === 'granted') {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch((error) => console.log(error));

        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri); // Method 1
          // const imageUrl = await this.uploadImage(result.uri);   // Method 2
          onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  /**
   * ##### Purpose:
   * - Requests permission to use camera; then takes photo.
   * @async
   * @function takePhoto
   * @param {*} props onSend
   * @param {*} props status
   */
  takePhoto = async () => {
    try {
      const { onSend } = this.props;
      const { status } = await Permissions.askAsync(
        Permissions.CAMERA,
        Permissions.CAMERA_ROLL,
      );

      if (status === 'granted') {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch((error) => console.log(error));

        if (!result.cancelled) {
          // const imageUrlLink = await this.uploadImage(result.uri);
          const imageUrl = await this.uploadImageFetch(result.uri);
          onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  /**
   * ##### Method 1 - Fetch:
   * - Upload Gallery or Camera image to
   * storage with fetch() and blob().
   * @function uploadImagefetch
   * @async
   * @param {string} uri
   * @returns {string} imageURL
  */
  // eslint-disable-next-line consistent-return
  uploadImageFetch = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const getImageName = uri.split('/'); // To split the uri into array of strings
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

  /**
   * ##### Method 2 - XMLHttpRequest:
   * - Upload Gallery or Camera image
   *  to Storage with XMLHttpRequest and blob().
   * @function uploadImage
   * @async
   * @param {string} uri
   * @returns {string} imageURL
   */
  uploadImage = async (uri) => {
    try {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function res() {
          resolve(xhr.response);
        };
        xhr.onerror = function rej(e) {
          console.log(e);
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });

      const getImageName = uri.split('/'); // To split the uri into array of strings
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

  /**
   * ##### Purpose:
   * - Requests permission to access device location,
   * then sends location via onSend.
   * @async
   * @function getLocation
   * @param {*} props onSend
   * @param {*} props status
   * @returns {Promise} Location data
   */
  getLocation = async () => {
    try {
      const { onSend } = this.props;
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === 'granted') {
        const result = await Location.getCurrentPositionAsync({});

        if (result) {
          onSend({
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

  /**
   * ##### Purpose:
   * - Renders and reveals custom actions.
   * @async
   * @function onActionPress
   * @returns {actionSheet}
   */
  onActionPress = () => {
    const options = [
      'Choose From Library',
      'Take Picture',
      'Send Location',
      'Cancel',
    ];
    const { actionSheet } = this.context;
    const cancelButtonIndex = options.length - 1;
    actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        try {
          switch (buttonIndex) {
            case 0:
              // console.log('user wants to pick an image');
              this.pickImage();
              return;
            case 1:
              // console.log('user wants to take a photo');
              this.takePhoto();
              return;
            case 2:
              // console.log('user wants to get their location');
              this.getLocation();
              return;
            default:
          }
        } catch (error) {
          console.log(error);
        }
      },
    );
  };

  render() {
    const { wrapperStyle, iconTextStyle } = this.props;
    return (
      <TouchableOpacity
        style={[styles.container]}
        onPress={this.onActionPress}
      >
        <View style={[styles.wrapper, wrapperStyle]}>
          <Text
            style={[styles.iconText, iconTextStyle]}
            accessibilityLabel="Message Options"
            accessibilityRole="menu"
          >
            +
          </Text>
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

CustomActions.defaultProps = {
  onSend: PropTypes.func,
  wrapperStyle: PropTypes.func,
  iconTextStyle: PropTypes.func,
};

CustomActions.propTypes = {
  onSend: PropTypes.func,
  wrapperStyle: PropTypes.func,
  iconTextStyle: PropTypes.func,
};
