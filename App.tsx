// App.tsx (FINAL VERSION)
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { ModalProvider } from './src/context/ModalContext';
import ErrorBoundary from './src/components/ErrorBoundary';

import HomeScreen from './src/screens/HomeScreen';
import Page1BasicInfo from './src/screens/Page1BasicInfo';
import Page2AddressInfo from './src/screens/Page2AddressInfo';
import Page3Summary from './src/screens/Page3Summary';

export type RootStackParamList = {
  Home: undefined;
  Page1: undefined;
  Page2: undefined;
  Page3: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ModalProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'User Profiles' }}
              />
              <Stack.Screen
                name="Page1"
                component={Page1BasicInfo}
                options={{ title: 'Step 1: Basic Info' }}
              />
              <Stack.Screen
                name="Page2"
                component={Page2AddressInfo}
                options={{ title: 'Step 2: Address Info' }}
              />
              <Stack.Screen
                name="Page3"
                component={Page3Summary}
                options={{ title: 'Step 3: Summary' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </ModalProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
