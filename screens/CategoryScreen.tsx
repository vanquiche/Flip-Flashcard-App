import { View, Text } from 'react-native';
import React from 'react';

import StackNavigator from '../components/StackNavigator';

import Categories from '../components/Categories';
import Sets from '../components/Sets';
import FlashCards from '../components/FlashCards';

const screens = [
  { id: '1', name: 'Categories', component: Categories },
  { id: '2', name: 'Sets', component: Sets },
  { id: '3', name: 'Cards', component: FlashCards },
];

const CategoryScreen = () => {
  return <StackNavigator screens={screens} />;
};

export default CategoryScreen;
