import { View, Text } from 'react-native';
import React, { useContext } from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import uuid from 'react-native-uuid';
import swatchContext from '../contexts/swatchContext';

const Stack = createStackNavigator();

interface Screen {
  id?: string;
  name: string;
  component: React.FC<any>;
}

interface Props {
  screens: Screen[];
  id?: string;
  hideHeader?: boolean;
}

const StackNavigator = ({ screens, id, hideHeader }: Props) => {
  const { theme } = useContext(swatchContext);

  return (
    <Stack.Navigator
      id={id}
      screenOptions={{
        headerShown: hideHeader ? !hideHeader : true,
        headerStyle: {
          backgroundColor: theme.headerColor,
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
