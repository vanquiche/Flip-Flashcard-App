// REACT
import { View, Text } from 'react-native';
import React from 'react';

// NAVIGATION

// COMPONENTS
import Home from '../components/Home';
import StackNavigator from '../components/StackNavigator';

const screens = [{ name: 'Home', component: Home }];

const HomeScreen = () => {
  return <StackNavigator screens={screens} />;
};

export default HomeScreen;
