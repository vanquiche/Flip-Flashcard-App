import { StatusBar } from 'react-native';
import React, { useState } from 'react';
import { IconButton, useTheme } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import CategoryScreen from './CategoryScreen';
import ShopScreen from './ShopScreen';
import ProfileScreen from './ProfileScreen';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import AlertNotification from '../components/AlertNotification';
import { dismissMessage } from '../redux/notificationSlice';

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
            display: !user._id ? 'none' : 'flex',
            height: 70,
          },
          tabBarShowLabel: false,
          headerShown: false,
        }}
      >
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
      </Tab.Navigator>
    </>
  );
};

export default IndexScreen;
