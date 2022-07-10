// REACT
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// NAVIGATION

// COMPONENTS
import Home from '../components/Pages/Home';

import StackNavigator from '../components/StackNavigator';
import Stats from '../components/Pages/Stats';
const screen = [
  { name: 'Home', component: Home },
  { name: 'Stats', component: Stats },
];

const HomeScreen = () => {
  return <StackNavigator screens={screen} />;
};

export default HomeScreen;
