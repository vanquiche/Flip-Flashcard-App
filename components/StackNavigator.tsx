import { View, Text } from 'react-native';
import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import AppBar from './AppBar';
import uuid from 'react-native-uuid'
import { useTheme } from 'react-native-paper';


const Stack = createStackNavigator();

interface Screen {
  id?: string;
  name: string;
  component: React.FC<any>;
}

interface Props {
  screens: Screen[];
  title?: string;
  id?: string;
}

const StackNavigator: React.FC<Props> = ({ screens, title, id }) => {
  const {colors, fonts} = useTheme();
  return (
    <Stack.Navigator
      id={id}
      // screenOptions={{
      //   header: (props) => <AppBar {...props} title={title}/>,
      // }}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
          height: 70
        },
        headerTintColor: colors.secondary,
        headerTitleStyle: {
          fontFamily: 'BalooBhaiExtraBold',
          fontSize: 22
        },
        headerBackTitleVisible: false
      }}
    >
      {screens.map((screen) => (
        <Stack.Screen
          name={screen.name}
          component={screen.component}
          key={uuid.v4().toString()}
        />
      ))}
    </Stack.Navigator>
  );
};

export default StackNavigator;
