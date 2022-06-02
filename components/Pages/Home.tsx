import { View, Text } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { Button } from 'react-native-paper';

import { UserContext } from '../../context/userContext';
import db from '../../db-services';

import { StackNavigationTypes } from '../types';

interface Props extends StackNavigationTypes {}

const Home: React.FC<Props> = ({ navigation, route }) => {
  const { user, setUser } = useContext(UserContext);
  // console.log(user)

  useEffect(() => {

  }, [])

  return (
    <View>
      <Text>Home Page</Text>
      <Text>Hello {user[0]?.username}</Text>
      <Button
        mode='text'
        onPress={() =>
          navigation.navigate('flashcards', {
            screen: 'Sets',
            params: {
              categoryRef: 'T9phKEf26c8tQZ3g',
              categoryTitle: 'Jejsid',
            },
            // establish routes to allow navigation within tab
            route: [
              {screen: 'Categories'},
              {screen: 'Sets'},
              {screen: 'Cards'}
            ]
          })
        }
      >
        Go to Set
      </Button>
    </View>
  );
};

export default Home;
