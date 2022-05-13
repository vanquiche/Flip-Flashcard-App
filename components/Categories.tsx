import { View, Text, Button } from 'react-native';
import React from 'react';

import { StackNavigationTypes } from './types';

interface Props extends StackNavigationTypes{}

const Categories: React.FC<Props> = ({ navigation }) => {
  return (
    <View>
      <Text>Categories</Text>
      <Button title='Sets' onPress={() => navigation.navigate('Sets')}/>
    </View>
  );
};

export default Categories;
