import { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { configureFonts, IconButton } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from 'react-query';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import * as Font from 'expo-font';

import 'react-native-gesture-handler';

// COMPONENTS
import HomeScreen from './screens/HomeScreen';
import CategoryScreen from './screens/CategoryScreen';
import ShopScreen from './screens/ShopScreen';
import ProfileScreen from './screens/ProfileScreen';

declare global {
    namespace ReactNativePaper {

    }
}

const Tab = createMaterialBottomTabNavigator();
const queryClient = new QueryClient();

const customFonts = {
  BalooBhaiRegular: require('./assets/fonts/BalooBhai2-Regular.ttf'),
  BalooBhaiMedium: require('./assets/fonts/BalooBhai2-Medium.ttf'),
  BalooBhaiBold: require('./assets/fonts/BalooBhai2-Bold.ttf'),
  BalooBhaiSemiBold: require('./assets/fonts/BalooBhai2-SemiBold.ttf'),
  BalooBhaiExtraBold: require('./assets/fonts/BalooBhai2-ExtraBold.ttf'),
};

export default function App() {
  const [loading, setLoading] = useState(true);


  const theme = {
    ...DefaultTheme,
    roundness: 10,
    colors: {
      ...DefaultTheme.colors,
      primary: '#FFD9D9',
    },
    fonts: {
      ...DefaultTheme.fonts,
      // regular: {
      //   fontFamily: 'BalooBhaiRegular',
      // },
      thin: {
        fontFamily: 'BalooBhaiMedium',
      },
      light: {
        fontFamily: 'BalooBhaiSemiBold',
      },
      regular: {
        fontFamily: 'BalooBhaiBold',
      },
      medium: {
        fontFamily: 'BalooBhaiExtraBold',
      },
    },
  };

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync(customFonts);
      setLoading(false);
    };
    loadFonts();
  }, []);

  if (loading) {
    return <ActivityIndicator size='large' />;
  }

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
                tabBarIcon: ({ focused }) => (
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
                tabBarIcon: ({ focused }) => (
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
                tabBarIcon: ({ focused }) => (
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
                tabBarIcon: ({ focused }) => (
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
