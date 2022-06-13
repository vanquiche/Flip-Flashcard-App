import { StatusBar } from 'react-native';
import React from 'react';
import { IconButton, useTheme } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import CategoryScreen from './CategoryScreen';
import ShopScreen from './ShopScreen';
import ProfileScreen from './ProfileScreen';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const Tab = createBottomTabNavigator();

const IndexScreen = () => {
  const { user, loading, notification } = useSelector(
    (state: RootState) => state.user
  );
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

  return (
    <>
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
