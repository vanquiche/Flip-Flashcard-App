import { StatusBar, View, Text } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import { IconButton, useTheme } from 'react-native-paper';

// COMPONENTS
import HomeScreen from './HomeScreen';
import CategoryScreen from './CategoryScreen';
import ShopScreen from './ShopScreen';
import ProfileScreen from './ProfileScreen';
import SignUp from '../components/Pages/SignUp';
import AlertNotification from '../components/AlertNotification';
import TabIcon from '../components/TabIcon';

// REDUX STORE
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';

// UTILITIES
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { dismissNotification } from '../redux/storeSlice';
import { hydrateData } from '../redux/userThunkActions';
import { getFavoriteSets } from '../redux/cardThunkActions';
import { getCards } from '../redux/cardThunkActions';

import swatchContext from '../contexts/swatchContext';
import DEFAULT_SWATCH_LIST from '../assets/swatchList';
import DEFAULT_PATTERNS from '../assets/patterns/defaultPatterns';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolateColor,
  withSpring,
} from 'react-native-reanimated';

const Tab = createBottomTabNavigator();

// animation values
const SPIN_START = 0;
const SPIN_END = 180;
const SCALE_START = 1;
const SCALE_END = 1.3;

const IndexScreen = () => {
  const { user, notification } = useSelector((state: RootState) => state.store);
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
        { rotateY: profileIconFlip.value + 'deg'},
        { scale: profileIconScale.value },
      ],
    };
  });

  const cardAnimate = useAnimatedStyle(() => {
    return {
      transform: [
        { rotateX: cardIconFlip.value + 'deg' },
        { scale: cardIconScale.value },
      ],
    };
  });

  // swatch colors and patterns for swatch selector
  // passed through context
  const colors = DEFAULT_SWATCH_LIST.concat(user.collection.colors);
  const patterns = { ...DEFAULT_PATTERNS, ...user.collection.patterns };

  const clearNotification = () => {
    dispatch(dismissNotification());
  };

  // HYDRATE DATA
  useEffect(() => {
    dispatch(hydrateData());
  }, []);

  return (
    <swatchContext.Provider value={{ colors, patterns }}>
      <AlertNotification
        dismiss={clearNotification}
        visible={notification.show}
        message={notification.message}
        bgColor={user.theme.cardColor}
        textColor={user.theme.fontColor}
      />
      <StatusBar hidden />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: user.theme.tabColor,
            height: 70,
          },
          tabBarShowLabel: false,
          headerShown: false,
        }}
      >
        {/* if there is no user then render Signup page, else render normal screens */}
        {!user._id ? (
          <Tab.Screen
            name='SignUp'
            component={SignUp}
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
                        focused
                          ? user.theme.actionIconColor
                          : user.theme.iconColor
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
                      icon='card'
                      color={
                        focused
                          ? user.theme.actionIconColor
                          : user.theme.iconColor
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
                  cardIconFlip.value = SPIN_START;
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
                    <TabIcon
                      icon='circle'
                      focused={focused}
                      color={
                        focused
                          ? user.theme.actionIconColor
                          : user.theme.iconColor
                      }
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
                      focused={focused}
                      color={
                        focused
                          ? user.theme.actionIconColor
                          : user.theme.iconColor
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
    </swatchContext.Provider>
  );
};

export default IndexScreen;
