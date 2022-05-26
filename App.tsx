import { useState, useEffect } from 'react';
import { ActivityIndicator, StatusBar } from 'react-native';
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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      secondary: string;
    }
  }
}

// const Tab = createMaterialBottomTabNavigator();
const Tab = createBottomTabNavigator();

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
      secondary: '#f08080',
    },
    fonts: {
      ...DefaultTheme.fonts,
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

  const TabIcon = (props: {icon: string}) => {
    return (
      <IconButton
        icon={props.icon}
        size={26}
        color={theme.colors.secondary}
        style={{ marginTop: 5 }}
      />
    );
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
          <StatusBar hidden />
          <Tab.Navigator
           screenOptions={{
             tabBarStyle: {
              backgroundColor: theme.colors.primary
             },
             tabBarShowLabel: false,
             headerShown: false,
           }}
          >
            <Tab.Screen
              name='Home-page'
              component={HomeScreen}
              options={{
                tabBarIcon: ({ focused }) => (
                <TabIcon icon='home'/>
                ),
              }}
            />
            <Tab.Screen
              name='flashcards'
              component={CategoryScreen}
              options={{
                tabBarIcon: ({ focused }) => (
                  <TabIcon icon='cards'/>
                ),
              }}
            />
            <Tab.Screen
              name='store'
              component={ShopScreen}
              options={{
                tabBarIcon: ({ focused }) => (
                  <TabIcon icon='store' />
                ),
              }}
            />
            <Tab.Screen
              name='Profile-page'
              component={ProfileScreen}
              options={{
                tabBarIcon: ({ focused }) => (
                  <TabIcon icon='heart'/>
                ),

              }}
            />
          </Tab.Navigator>
        </PaperProvider>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
