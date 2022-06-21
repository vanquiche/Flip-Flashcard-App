import { StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import { IconButton, useTheme } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import CategoryScreen from './CategoryScreen';
import ShopScreen from './ShopScreen';
import ProfileScreen from './ProfileScreen';
import SignUp from '../components/Pages/SignUp';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import AlertNotification from '../components/AlertNotification';
import { dismissMessage } from '../redux/notificationSlice';
import { removeReferences, getReferences } from '../redux/referenceSlice';
import { getUserData, updateUser } from '../redux/userSlice';
import { showMessage } from '../redux/notificationSlice';
import loginStreak from '../utility/loginStreak';
import sortWeek from '../utility/sortWeek';
import { DateTime } from 'luxon';

const Tab = createBottomTabNavigator();

const IndexScreen = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const { alert } = useSelector((state: RootState) => state.notification);

  const dispatch = useDispatch<AppDispatch>();
  const { colors } = useTheme();
  const TabIcon = (props: { icon: string }) => {
    return (
      <IconButton
        icon={props.icon}
        size={30}
        color={colors.secondary}
        style={{ marginTop: 5 }}
      />
    );
  };

  const clearNotification = () => {
    dispatch(dismissMessage());
  };

  useEffect(() => {
    // console.log('IndexScreen rendered');
    dispatch(getReferences())
    dispatch(getUserData());
    if (user._id) {
      const dt = DateTime;
      const today = dt.now();
      const lastLogin = user.login.week[user.login.week.length - 1];

      const diff = today.diff(dt.fromISO(lastLogin), 'hours').toObject();
      // console.log(diff.hours)
      // get date of last login from week
      const streak = loginStreak(lastLogin);
      // console.log('streak: ' + streak);
      if (diff.hours) {
        // if time passed is greater than 24hrs
        // then remove quiz references
        // otherwise get references
        diff.hours > 24
          ? dispatch(removeReferences())
          : false;
      }

      if (streak === null) {
        // login is less than 24hrs old then do nothing
        return;
      } else if (streak === false) {
        // login is older than 2days
        // set streak to 0
        const updateLogin = {
          login: {
            week: sortWeek(user.login.week),
            streak: 0,
          },
        };
        dispatch(updateUser(updateLogin));
      } else if (streak) {
        // login is greater than one day but less than 2days
        // increment streak
        const updateLogin = {
          experiencePoints: user.experiencePoints + 50,
          login: {
            week: sortWeek(user.login.week),
            streak: user.login.streak + 1,
          },
        };
        dispatch(updateUser(updateLogin));
        dispatch(showMessage('you earned 50 xp points for consecutive logins'));
      }
    }
  }, []);

  return (
    <>
      <AlertNotification
        dismiss={clearNotification}
        visible={alert.show}
        message={alert.message}
      />
      <StatusBar hidden />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: colors.primary,
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
          <Tab.Screen name='SignUp' component={SignUp} />
        ) : (
          <>
            <Tab.Screen
              name='Home-page'
              component={HomeScreen}
              options={{
                tabBarIcon: ({ focused }) => <TabIcon icon='home' />,
              }}
            />
            <Tab.Screen
              name='flashcards'
              component={CategoryScreen}
              options={{
                tabBarIcon: ({ focused }) => <TabIcon icon='cards' />,
              }}
            />
            <Tab.Screen
              name='store'
              component={ShopScreen}
              options={{
                tabBarIcon: ({ focused }) => <TabIcon icon='store' />,
              }}
            />
            <Tab.Screen
              name='Profile-page'
              component={ProfileScreen}
              options={{
                tabBarIcon: ({ focused }) => <TabIcon icon='heart' />,
              }}
            />
          </>
        )}
      </Tab.Navigator>
    </>
  );
};

export default IndexScreen;
