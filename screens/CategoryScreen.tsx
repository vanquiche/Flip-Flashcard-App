import { View, Text } from 'react-native';
import React from 'react';

import StackNavigator from '../components/StackNavigator';

import Categories from '../components/Categories';
import Sets from '../components/Sets';
import FlashCards from '../components/FlashCards';

const screens = [
  { name: 'Categories', component: Categories },
  { name: 'Sets', component: Sets },
  { name: 'Cards', component: FlashCards },
];

const CategoryScreen = () => {
  return <StackNavigator screens={screens} />;
};

export default CategoryScreen;
