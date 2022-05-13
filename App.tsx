import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { QueryClient, QueryClientProvider } from 'react-query';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import 'react-native-gesture-handler';

// COMPONENTS
import HomeScreen from './screens/HomeScreen';
import CategoryScreen from './screens/CategoryScreen';
import ShopScreen from './screens/ShopScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createMaterialBottomTabNavigator();
const queryClient = new QueryClient();



export default function App() {
  
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#FFD9D9',
    },
  };

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <PaperProvider theme={theme}>
          <Tab.Navigator
            labeled={true}
            shifting={false}
            barStyle={{ backgroundColor: theme.colors.primary, elevation: 0 }}
          >
            <Tab.Screen name='Home-page' component={HomeScreen} />
            <Tab.Screen name='Categories-page' component={CategoryScreen} />
            <Tab.Screen name='Shop-page' component={ShopScreen} />
            <Tab.Screen name='Profile-page' component={ProfileScreen} />
          </Tab.Navigator>
        </PaperProvider>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
