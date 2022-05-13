import { View, Text } from 'react-native';
import React from 'react';

import StackNavigator from '../components/StackNavigator';

import Profile from '../components/Profile';

const screens = [{ name: 'Profile', component: Profile }];

const ProfileScreen = () => {
  return <StackNavigator screens={screens} />;
};

export default ProfileScreen;
