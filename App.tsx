import React, { useState, useEffect, useReducer } from 'react';
import { ActivityIndicator, StatusBar } from 'react-native';
import { configureFonts, IconButton } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

import * as Font from 'expo-font';

import 'react-native-gesture-handler';

// COMPONENTS
import HomeScreen from './screens/HomeScreen';
import CategoryScreen from './screens/CategoryScreen';
import ShopScreen from './screens/ShopScreen';
import ProfileScreen from './screens/ProfileScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { initUser } from './context/userContext';
import db from './db-services';
import { User } from './components/types';
import { cardReducer } from './reducers/CardReducer';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState, store } from './redux/store';
import { getUserData } from './redux/userSlice';
import IndexScreen from './screens/IndexScreen';

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      secondary: string;
    }
  }
}

const customFonts = {
  BalooBhaiRegular: require('./assets/fonts/BalooBhai2-Regular.ttf'),
  BalooBhaiMedium: require('./assets/fonts/BalooBhai2-Medium.ttf'),
  BalooBhaiBold: require('./assets/fonts/BalooBhai2-Bold.ttf'),
  BalooBhaiSemiBold: require('./assets/fonts/BalooBhai2-SemiBold.ttf'),
  BalooBhaiExtraBold: require('./assets/fonts/BalooBhai2-ExtraBold.ttf'),
};

export default function App() {
  const [fontLoading, setFontLoading] = useState(true);

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

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync(customFonts);
      setFontLoading(false);
    };
    loadFonts();
  }, []);

  if (fontLoading) {
    return <ActivityIndicator size='large' />;
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <PaperProvider theme={theme}>
          <IndexScreen />
        </PaperProvider>
      </NavigationContainer>
    </Provider>
  );
}
