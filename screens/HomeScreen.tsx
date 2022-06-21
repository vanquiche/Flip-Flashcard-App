// REACT
import { View, Text } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// NAVIGATION

// COMPONENTS
import Home from '../components/Pages/Home';

import { useTheme } from 'react-native-paper';
const Stack = createStackNavigator();

const HomeScreen = () => {
  const { colors } = useTheme();
  // const { user } = useSelector(
  //   (state: RootState) => state.user
  // );
  // const dispatch = useDispatch<AppDispatch>();

  // console.log(user)

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
    // headerShown: user._id ? true : false,
  };



  return (
    <Stack.Navigator screenOptions={headerStyle}>
      {/* {!user._id ? (
        <Stack.Screen name='Home' component={SignUp} />
      ) : ( */}
      <Stack.Screen name='Home' component={Home} />
      {/* )} */}
    </Stack.Navigator>
  );
};

export default HomeScreen;
