import React from 'react';

import StackNavigator from '../components/StackNavigator';

import Profile from '../components/Pages/Profile';
import Themes from '../components/Pages/Themes';

const screens = [
  { name: 'Profile', component: Profile },
  { name: 'Themes', component: Themes },
];

const ProfileScreen = () => {
  return <StackNavigator screens={screens} />;
};

export default ProfileScreen;
