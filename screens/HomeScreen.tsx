// REACT
import React from 'react';

// NAVIGATION

// COMPONENTS
import Home from '../components/Pages/Home';

import StackNavigator from '../components/StackNavigator';
import Stats from '../components/Pages/Stats';
import Themes from '../components/Pages/Themes';
const screen = [
  { name: 'Home', component: Home },
  { name: 'Stats', component: Stats },
  { name: 'Themes', component: Themes },
];

const HomeScreen = () => {
  return <StackNavigator screens={screen} />;
};

export default HomeScreen;
