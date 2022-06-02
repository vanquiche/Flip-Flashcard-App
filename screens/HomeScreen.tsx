// REACT
import { View, Text } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// NAVIGATION

// COMPONENTS
import Home from '../components/Pages/Home';
import StackNavigator from '../components/StackNavigator';
import SignUp from '../components/Pages/SignUp';

import { useTheme } from 'react-native-paper';
import { UserContext } from '../context/userContext';

const Stack = createStackNavigator();

const HomeScreen = () => {
  const { user } = useContext(UserContext);
  const { colors } = useTheme();

  const headerStyle = {
    headerStyle: {
      backgroundColor: colors.primary,
      height: 70,
    },
    headerTintColor: colors.secondary,
    headerTitleStyle: {
      fontFamily: 'BalooBhaiExtraBold',
      fontSize: 22,
    },
    // disable header if no user is found
    headerShown: user.length === 0 ? false : true,
  };

  return (
    <Stack.Navigator screenOptions={headerStyle}>
      <Stack.Screen name='Home' component={user.length === 0 ? SignUp : Home} />
    </Stack.Navigator>
  );
};

export default HomeScreen;
