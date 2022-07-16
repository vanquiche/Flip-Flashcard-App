import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import DEFAULT_PATTERNS, {
  STORE_PATTERNS,
  PRELOAD_IMGS,
} from './assets/patterns/defaultPatterns';

import 'react-native-gesture-handler';

import { Provider } from 'react-redux';
import { store } from './redux/store';
// COMPONENTS
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
  const [assetLoading, setAssetLoading] = useState(true);

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

  const cacheImages = async (imgs: string[]) => {
    return imgs.map((i) => {
      if (typeof i === 'string') {
        return Image.prefetch(i);
      } else {
        return Asset.fromModule(i).downloadAsync();
      }
    });
  };

  const loadFonts = async () => {
    await Font.loadAsync(customFonts);
  };

  const loadAssets = async () => {
    const imgAsset = cacheImages(PRELOAD_IMGS);
    const fontAsset = loadFonts();

    await Promise.all([fontAsset, imgAsset]);
    setAssetLoading(false);
  };

  useEffect(() => {
    loadAssets();
  }, []);

  if (assetLoading) {
    return <ActivityIndicator size='large' style={styles.spinner} />;
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

const styles = StyleSheet.create({
  spinner: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
