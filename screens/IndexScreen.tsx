import { ActivityIndicator, Image, StatusBar, View } from 'react-native';
import React, { useEffect, useState } from 'react';

// COMPONENTS
import HomeScreen from './HomeScreen';
import CategoryScreen from './CategoryScreen';
import ShopScreen from './ShopScreen';
import ProfileScreen from './ProfileScreen';
import AlertNotification from '../components/AlertNotification';
import TabIcon from '../components/TabIcon';

// REDUX STORE
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';

// UTILITIES
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { dismissNotification } from '../redux/storeSlice';
import { hydrateData } from '../redux/userThunkActions';

import swatchContext from '../contexts/swatchContext';
import DEFAULT_SWATCH_LIST from '../assets/swatchList';
import DEFAULT_PATTERNS from '../assets/patterns/patterns';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { defaultTheme } from '../components/types';
import Loader from '../components/Loader';
import { SafeAreaView } from 'react-native-safe-area-context';
import fontColorContrast from 'font-color-contrast';
import SignUpScreen from './SignUpScreen';

const Tab = createBottomTabNavigator();
const heartIcoin = require('../assets/images/HeartCoinImage.png');

// animation values
const SPIN_START = 0;
const SPIN_END = 180;
const SCALE_START = 1;
const SCALE_END = 1.2;

const IndexScreen = () => {
  const { user, notification } = useSelector((state: RootState) => state.store);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  const homeIconSpin = useSharedValue(SPIN_START);
  const homeIconScale = useSharedValue(SCALE_START);

  const cardIconFlip = useSharedValue(SPIN_START);
  const cardIconScale = useSharedValue(SCALE_START);

  const shopIconFlip = useSharedValue(SPIN_START);
  const shopIconScale = useSharedValue(SCALE_START);

  const profileIconFlip = useSharedValue(SPIN_START);
  const profileIconScale = useSharedValue(SCALE_START);

  const homeAnimate = useAnimatedStyle(() => {
    return {
      transform: [
        { rotateY: homeIconSpin.value + 'deg' },
        { scale: homeIconScale.value },
      ],
    };
  });

  const shopAnimate = useAnimatedStyle(() => {
    return {
      transform: [
        { rotateY: shopIconFlip.value + 'deg' },
        { scale: shopIconScale.value },
      ],
    };
  });

  const profileAnimate = useAnimatedStyle(() => {
    return {
      transform: [
        { rotateY: profileIconFlip.value + 'deg' },
        { scale: profileIconScale.value },
      ],
    };
  });

  const cardAnimate = useAnimatedStyle(() => {
    return {
      transform: [
        { rotateY: cardIconFlip.value + 'deg' },
        { scale: cardIconScale.value },
      ],
    };
  });

  // swatch colors and patterns for swatch selector
  // passed through context
  const colors = user
    ? DEFAULT_SWATCH_LIST.concat(user.collection.colors)
    : DEFAULT_SWATCH_LIST;
  const patterns = user
    ? { ...DEFAULT_PATTERNS, ...user.collection.patterns }
    : DEFAULT_PATTERNS;
  const theme = user ? user.theme : defaultTheme;

  const clearNotification = () => {
    dispatch(dismissNotification());
  };

  const initializeData = async () => {
    try {
      await dispatch(hydrateData());
    } finally {
      setIsLoading(false);
    }
  };

  // HYDRATE DATA
  useEffect(() => {
    initializeData();
  }, []);

  const statusBarColor =
    user && user._id
      ? fontColorContrast(theme.headerColor, 0.5)
      : fontColorContrast('lightblue', 0.5);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return (
    <swatchContext.Provider value={{ colors, patterns, theme }}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: user && user._id ? theme.headerColor : 'lightblue',
        }}
      >
        <AlertNotification
          dismiss={clearNotification}
          visible={notification.show}
          message={notification.message}
          bgColor={theme.cardColor}
          textColor={theme.fontColor}
        />

        <StatusBar
          barStyle={
            statusBarColor === '#000000' ? 'dark-content' : 'light-content'
          }
        />

        <Tab.Navigator
          screenOptions={{
            tabBarStyle: {
              backgroundColor: theme.tabColor,
            },
            tabBarShowLabel: false,
            headerShown: false,
          }}
        >
          {/* if there is no user then render Signup page, else render normal screens */}
          {/* if user is undefined or if user object exist but has not been initialized yet */}
          {!user || (user && !user._id) ? (
            <Tab.Screen
              name='Walkthrough'
              component={SignUpScreen}
              options={{
                tabBarIconStyle: { display: 'none' },
                tabBarStyle: { display: 'none' },
              }}
            />
          ) : (
            <>
              <Tab.Screen
                name='Home-page'
                component={HomeScreen}
                options={{
                  tabBarIcon: ({ focused }) => (
                    <Animated.View style={homeAnimate}>
                      <TabIcon
                        icon='home-variant'
                        color={
                          focused ? theme.actionIconColor : theme.iconColor
                        }
                      />
                    </Animated.View>
                  ),
                }}
                listeners={{
                  focus: () => {
                    homeIconSpin.value = withSpring(SPIN_END);
                    homeIconScale.value = withSpring(SCALE_END);
                  },
                  blur: () => {
                    homeIconSpin.value = SPIN_START;
                    homeIconScale.value = withSpring(SCALE_START);
                  },
                }}
              />
              <Tab.Screen
                name='flashcards'
                component={CategoryScreen}
                options={{
                  tabBarIcon: ({ focused }) => (
                    <Animated.View style={cardAnimate}>
                      <TabIcon
                        icon='cards'
                        color={
                          focused ? theme.actionIconColor : theme.iconColor
                        }
                      />
                    </Animated.View>
                  ),
                }}
                listeners={{
                  focus: () => {
                    cardIconFlip.value = withSpring(SPIN_END);
                    cardIconScale.value = withSpring(SCALE_END);
                  },
                  blur: () => {
                    cardIconFlip.value = withSpring(SPIN_START);
                    cardIconScale.value = withSpring(SCALE_START);
                  },
                }}
              />
              <Tab.Screen
                name='store'
                component={ShopScreen}
                options={{
                  tabBarIcon: ({ focused }) => (
                    <Animated.View style={shopAnimate}>
                      {/* <TabIcon
                        icon='circle'
                        focused={focused}
                        color={
                          focused ? theme.actionIconColor : theme.iconColor
                        }
                      /> */}
                      <Image
                        source={heartIcoin}
                        style={{
                          width: 25,
                          height: 25,
                          tintColor: focused
                            ? theme.actionIconColor
                            : theme.iconColor,
                        }}
                      />
                    </Animated.View>
                  ),
                }}
                listeners={{
                  focus: () => {
                    shopIconFlip.value = withSpring(SPIN_END);
                    shopIconScale.value = withSpring(SCALE_END);
                  },
                  blur: () => {
                    shopIconFlip.value = SPIN_START;
                    shopIconScale.value = withSpring(SCALE_START);
                  },
                }}
              />
              <Tab.Screen
                name='Profile-page'
                component={ProfileScreen}
                options={{
                  tabBarIcon: ({ focused }) => (
                    <Animated.View style={profileAnimate}>
                      <TabIcon
                        icon='heart'
                        color={
                          focused ? theme.actionIconColor : theme.iconColor
                        }
                      />
                    </Animated.View>
                  ),
                }}
                listeners={{
                  focus: () => {
                    profileIconFlip.value = withSpring(SPIN_END);
                    profileIconScale.value = withSpring(SCALE_END);
                  },
                  blur: () => {
                    profileIconFlip.value = SPIN_START;
                    profileIconScale.value = withSpring(SCALE_START);
                  },
                }}
              />
            </>
          )}
        </Tab.Navigator>
      </SafeAreaView>
    </swatchContext.Provider>
  );
};

export default IndexScreen;
