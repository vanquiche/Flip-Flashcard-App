import { View, Text } from 'react-native';
import React, { useContext } from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import AppBar from './AppBar';
import uuid from 'react-native-uuid';
import { useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import swatchContext from '../contexts/swatchContext';

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
  const { theme } = useContext(swatchContext);

  return (
    <Stack.Navigator
      id={id}
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.headerColor,
          height: 70,
        },
        headerTintColor: 'white',
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
              backgroundColor: theme.bgColor,
            },
          }}
        />
      ))}
    </Stack.Navigator>
  );
};

export default StackNavigator;
