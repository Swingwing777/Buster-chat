# Buster-chat 
### [Screen Title: 'Chit-Chat']

Buster-chat is a React-Native based, screenreader compatible messaging app, allowing users to pass messages as well as share camera and gallery images and GPS location.  Messages and images are stored in Google Firebase and Cloud Firestore.

![Screenshot_Start200.png](https://sweepback.co.uk/supportfiles/Readme%20Support%20Media%20-%20for%20Sweepback/Screenshot_Start200.png)![Screenshot_Chat200.png](https://sweepback.co.uk/supportfiles/Readme%20Support%20Media%20-%20for%20Sweepback/Screenshot_Chat200.png?dl=0)
> Note: Screenshots from Android Emulator.  iOS similar though not identical due to native UI rendering.

### Tech:

Buster-Chat uses the following open source projects to work:

* [React-native] - A framework for building native apps using React
* [Node.js] - A JavaScript runtime built on Chrome's V8 JavaScript engine.
* [npm] - Build Amazing Things.
* [Gifted Chat] - The most complete chat UI for React Native.
* [Google Firebase] - Including Cloud Firestore.
* [Expo] - A framework and a platform for universal React applications.
* [Dillinger] - The Last Markdown Editor ever.
* And of course Buster-Chat itself is open source with a [public repository][Buster]
 on GitHub.
----
### Installation:

Buster-Chat requires [Node.js LTS](https://nodejs.org/) v14+ to build.

Install the latest LTS version of Node.js, followed by the Expo CLI:
```sh
$ nvm install lts/*
$ npm install expo-cli --global
```

Then update all dependencies to Expo-compatible versions (as Expo is commonly not as up-to-date with the latest version from npm):
```sh
$ expo update
$ npm install expo-cli --global
```
Now sign up for an [Expo] account, if you have not already, and then login by typing:
```sh
$ expo login
```
* Enter your account details.

To create your new app, type:
```sh
$ cd <myPortfolios> 
$ expo init <myChoiceOfName>
```
* This creates the barebones React-Native app:
* Now **copy-paste** the repository files into the App, to achieve a folder layout as follows:

![DirectoryStructure200.png](https://sweepback.co.uk/supportfiles/Readme%20Support%20Media%20-%20for%20Sweepback/DirectoryStructure200.png?dl=0&raw=1)

Then, from within the project's root directory, type: 
```sh
$ expo install 
```
* This ensures any remaining depencies detailed in `package.json` are installed as Expo compatible versions.
>
Finally, type:
```sh
$ expo start 
```
* Alternatively, type `npm start`.  
* Either command starts the Metro Bundler in the default browser.
![Metro Bundler.png](https://sweepback.co.uk/supportfiles/Readme%20Support%20Media%20-%20for%20Sweepback/Metro%20Bundler.png?dl=0&raw=1)
----

### Storage: 
You will need your own Google Firebase account for storage of both messages and shared images.
* This in turn requires a Google user account.  Please see [Google Firebase] for setup details.  

##### Message Storage:
* Once your account is setup, open your Firebase Console and select an existing project or create a new one.
* In the left side menu, select **Project Overview** --> **Project Settings**.
* Under the **General** tab, click **Firestore for Web** or the **'</>'** icon.  On the next screen, select **Register App**.  Beneath it appears a fully-populated code window: Copy and save `var firebaseConfig = { ... }`.  This code must be added to the `Chat.js` file within the `constructor()`.
![Firestore2.png](https://sweepback.co.uk/supportfiles/Readme%20Support%20Media%20-%20for%20Sweepback/Firestore2.png?dl=0&raw=1)

* Now select Cloud Firstore in the left side menu and start and name a new collection:
![Firestore3.png](https://sweepback.co.uk/supportfiles/Readme%20Support%20Media%20-%20for%20Sweepback/Firestore3.png?dl=0&raw=1)

* As a minimum, a collection **must** contain one document, or else it is automatically deleted.
* A reference to the collection is then added to the `componentDidMount` method of `Chat.js`:
```sh
    this.referenceCollectionname =
      firebase.firestore().collection('collectionname');
```
##### Image Storage:
* Using the same project created in the Message Storage section above, now select **Storage** from the left side menu.
* Images are converted to blobs before upload --> See the `CustomActions.js` file.
* `CustomActions.js` offers two asynchronous alternatives for uploading an image:
  * `fetch` method: `uploadImageFetch()`, or....
  * `XMLHttp` method: `uploadImage()`.
  The only essential difference is that the latter method needs additional code to close the connection once completed.  As currently coded, `CustomActions` uses the former method, but both are included and have been successfully tested.

##### Storage Deletion:
Anticipating that developing any similar app requires plenty of test messages, two asynchronous methods have been included in `Chat.js` to allow deletion of the asyncStorage and the Firestore storage.  These are:
* `deleteMessages()` and
* `deleteMessagesFirestore()`
These are both triggered by an additonal `<Button>` component in `Chat.js`, labelled: *Dev Use: Delete Local/Remote*.  This can be commented in or out as required.
Note: Image storage must currently be deleted manually via [Google Firebase].
----

### Testing:

Testing can be completed via any physical Android or Apple iOS device installed with the Expo app. A free Expo account is required as a minimum.
* For Android, see [Google Play].
* For iOS, see the [Apple App store].

##### Testing | Android Emulator:
Testing can also be completed using the Android Emulator, available as part of the [Android Studio] suite for both Mac and PC.
The following installation steps require attention:
* At the **Install Type** screen, select 'Custom'.
* At the **SDK Components Setup** screen, make certain to select **Android Virtual Device**.
* After installation, start Android Studio, and select **Configure** --> **SDK Manager** --> **SDK Tools** --> Ensure that **Android SDK Build-Tools** shows as installed, or else click to install. 
* Restart Android Studio and select **Configure** --> **AVD Manager** --> **+ Create Virtual Device** --> Note: For ease of later testing, pick a profile that includes Google Play Store.
* Follow the steps through to create the virtual device, including acceptance of the License Agreement.  Once completed, return to the Virtual Device Manager via **Configure** --> **AVD** and click the Play symbol to start your new virtual device.
![Virtual_Device-Android.png](https://sweepback.co.uk/supportfiles/Readme%20Support%20Media%20-%20for%20Sweepback/Virtual_Device-Android.png?dl=0&raw=1)     
* The virtual device will require the installation of the Expo App from [Google Play], just as for a real device.  Then select **Run on Android device/emulator** in the Expo browser window.
* Thereafter, for running with Expo on your PC or Mac, or any troubleshooting, refer to the [Expo] website.  

![Android_Metro.jpg](https://sweepback.co.uk/supportfiles/Readme%20Support%20Media%20-%20for%20Sweepback/Android_Metro.jpg?dl=0&raw=1)

##### Testing | iOS Simulator:
Testing on an iOS simulator is available on Mac OS only, using [XCode] which is a developer tool available through the Mac App Store.
* Once installed on your Mac, select **Preferences** --> **Components**, and then select and install a simulator from the dsipalyed list.
* To run, start the Expo project in your terminal and once the Metro Bundler starts in the browser, select **Run on iSO simulator**.

![iOS_Metro.jpg](https://sweepback.co.uk/supportfiles/Readme%20Support%20Media%20-%20for%20Sweepback/iOS_Metro.jpg?dl=0&raw=1)

----
### Todos

 - Add voice dictation
 - Add video sharing
----
License 
----

##### DWhal
* Email via GitHub.
* [GitHub]
* [LinkedIn]
* [Twitter]



   [Dillinger]: <https://github.com/joemccann/dillinger>
   [Node.js]: <https://nodejs.org/en/>
   [npm]: <https://www.npmjs.com/>
   [Expo]: <https://expo.io>
   [React-native]: <https://reactnative.dev>
   [React Navigation]: <https://reactnavigation.org>
   [Gifted Chat]: <https://github.com/FaridSafi/react-native-gifted-chat>
   [Google Firebase]: <https://firebase.google.com/>
   [Buster]: <https://github.com/Swingwing777/Buster-chat>
   [Google Play]: <https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en&gl=US>
   [Apple App store]: <https://apps.apple.com/us/app/expo-client/id982107779>
   [Android Studio]: <https://developer.android.com/studio>
   [XCode]: <https://apps.apple.com/us/app/xcode/id497799835?mt=12>
   [GitHub]: <https://github.com/Swingwing777/Buster-chat>
   [LinkedIn]: <linkedin.com/in/david-hales-3450305a>
   [Twitter]: <https://twitter.com/dwhal>
   [Google Firebase]: <https://console.firebase.google.com/>
  
