import { View, Text } from 'react-native';
import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import AppBar from './AppBar';
import uuid from 'react-native-uuid';
import { useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

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

const StackNavigator = ({ screens, title, id }: Props) => {
  const { user } = useSelector((state: RootState) => state.store);

  return (
    <Stack.Navigator
      id={id}
      screenOptions={{
        headerStyle: {
          backgroundColor: user.theme.headerColor,
          height: 70,
        },
        headerTintColor: user.theme.fontColor,
        headerTitleStyle: {
          fontFamily: 'BalooBhaiExtraBold',
          fontSize: 22,
        },
        headerBackTitleVisible: false,
      }}
    >
      {screens.map((screen) => (
        <Stack.Screen
          name={screen.name}
          component={screen.component}
          key={uuid.v4().toString()}
          options={{
            cardStyle: {
              backgroundColor: user.theme.bgColor,
            },
          }}
        />
      ))}
    </Stack.Navigator>
  );
};

export default StackNavigator;
