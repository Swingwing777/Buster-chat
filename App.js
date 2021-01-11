import React from 'react';

// import react native gesture handler and dependencies
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// import views
import Start from './components/Start';
import Chat from './components/Chat';

// Create navigator stack to handle view-to-view transitions
const Stack = createStackNavigator();

/**
 * ##### Creates a new function component:
 * - This is the root file and contains
 * the navigation stack.
 * @class App
 */
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
