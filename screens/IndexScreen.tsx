import { StatusBar, View } from 'react-native';
import React, { useEffect } from 'react';
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

const Tab = createBottomTabNavigator();

const IndexScreen = () => {
  const { user, notification } = useSelector((state: RootState) => state.store);
  const dispatch = useDispatch<AppDispatch>();

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
                  <TabIcon
                    icon='home'
                    color={
                      focused
                        ? user.theme.actionIconColor
                        : user.theme.iconColor
                    }
                  />
                ),
              }}
            />
            <Tab.Screen
              name='flashcards'
              component={CategoryScreen}
              options={{
                tabBarIcon: ({ focused }) => (
                  <TabIcon
                    icon='card'
                    color={
                      focused
                        ? user.theme.actionIconColor
                        : user.theme.iconColor
                    }
                  />
                ),
              }}
            />
            <Tab.Screen
              name='store'
              component={ShopScreen}
              options={{
                tabBarIcon: ({ focused }) => (
                  <TabIcon
                    icon='store'
                    color={
                      focused
                        ? user.theme.actionIconColor
                        : user.theme.iconColor
                    }
                  />
                ),
              }}
            />
            <Tab.Screen
              name='Profile-page'
              component={ProfileScreen}
              options={{
                tabBarIcon: ({ focused }) => (
                  <TabIcon
                    icon='heart'
                    color={
                      focused
                        ? user.theme.actionIconColor
                        : user.theme.iconColor
                    }
                  />
                ),
              }}
            />
          </>
        )}
      </Tab.Navigator>
    </swatchContext.Provider>
  );
};

export default IndexScreen;
