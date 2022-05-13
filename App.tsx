import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from 'react-query';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import 'react-native-gesture-handler';

// COMPONENTS
import HomeScreen from './screens/HomeScreen';
import CategoryScreen from './screens/CategoryScreen';
import ShopScreen from './screens/ShopScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createMaterialBottomTabNavigator();
const queryClient = new QueryClient();

export default function App() {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#8ecae6',
    },
  };

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <PaperProvider theme={theme}>
          <Tab.Navigator
            labeled={true}
            shifting={true}
            barStyle={{
              backgroundColor: theme.colors.primary,
              elevation: 0,
              // paddingBottom: 20,
            }}
          >
            <Tab.Screen
              name='Home-page'
              component={HomeScreen}
              options={{
                tabBarIcon: ({focused}) => (
                  <IconButton
                    icon='home'
                    size={26}
                    color='white'
                    style={{ marginTop: -5 }}
                  />
                ),
              }}
            />
            <Tab.Screen
              name='Topics'
              component={CategoryScreen}
              options={{
                tabBarIcon: ({focused}) => (
                  <IconButton
                    icon='cards'
                    size={26}
                    color='white'
                    style={{ marginTop: -5 }}
                  />
                ),
              }}
            />
            <Tab.Screen
              name='Shop-page'
              component={ShopScreen}
              options={{
                tabBarIcon: ({focused}) => (
                  <IconButton
                    icon='store'
                    size={26}
                    color='white'
                    style={{ marginTop: -5 }}
                  />
                ),
              }}
            />
            <Tab.Screen
              name='Profile-page'
              component={ProfileScreen}
              options={{
                tabBarIcon: ({focused}) => (
                  <IconButton
                    icon='heart'
                    size={26}
                    color='white'
                    style={{ marginTop: -5 }}
                  />
                ),
              }}
            />
          </Tab.Navigator>
        </PaperProvider>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
