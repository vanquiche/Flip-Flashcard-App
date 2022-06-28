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
import { getUserData, checkLogin } from '../redux/userThunkActions';
import { getFavoriteSets } from '../redux/cardThunkActions';
import { getCards } from '../redux/cardThunkActions';

const Tab = createBottomTabNavigator();

const IndexScreen = () => {
  const { user, notification } = useSelector((state: RootState) => state.store);
  const dispatch = useDispatch<AppDispatch>();

  const { colors } = useTheme();

  const clearNotification = () => {
    dispatch(dismissNotification());
  };

  // HYDRATE DATA
  useEffect(() => {
    dispatch(getUserData());
    dispatch(getFavoriteSets());
    dispatch(getCards({ type: 'category', query: { type: 'category' } }));
  }, []);

  useEffect(() => {
    dispatch(
      checkLogin({
        lastLogin: user.login,
        streak: user.streak,
        xp: user.xp,
      })
    );
  }, []);

  return (
    <>
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
            // disable tabbar if no user exist
            // display: !user._id ? 'none' : 'flex',
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
            options={{ tabBarIconStyle: { display: 'none' } }}
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
                    icon='cards'
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
    </>
  );
};

export default IndexScreen;
