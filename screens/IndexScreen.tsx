import { StatusBar } from 'react-native';
import React, { useEffect } from 'react';
import { IconButton, useTheme } from 'react-native-paper';

// COMPONENTS
import HomeScreen from './HomeScreen';
import CategoryScreen from './CategoryScreen';
import ShopScreen from './ShopScreen';
import ProfileScreen from './ProfileScreen';
import SignUp from '../components/Pages/SignUp';
import AlertNotification from '../components/AlertNotification';

// REDUX STORE
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';


// UTILITIES
import { DateTime } from 'luxon';
import sortWeek from '../utility/sortWeek';
import loginStreak from '../utility/loginStreak';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { dismissNotification } from '../redux/storeSlice';
import { getUserData } from '../redux/userThunkActions';
import { getFavoriteSets } from '../redux/cardThunkActions';

const Tab = createBottomTabNavigator();

const IndexScreen = () => {
  const { user } = useSelector((state: RootState) => state.store);
  const { notification } = useSelector((state: RootState) => state.store);

  const dispatch = useDispatch<AppDispatch>();
  const { colors } = useTheme();
  const TabIcon = (props: { icon: string }) => {
    return (
      <IconButton
        icon={props.icon}
        size={30}
        color={colors.secondary}
        style={{ marginTop: 5 }}
      />
    );
  };

  const clearNotification = () => {
    dispatch(dismissNotification());
  };

  useEffect(() => {
    // get user
    // get favorites
    // get completed quizes
    // get categoryPoints
    // get login data
    dispatch(getUserData());
    dispatch(getFavoriteSets())

  }, []);

  return (
    <>
      <AlertNotification
        dismiss={clearNotification}
        visible={notification.show}
        message={notification.message}
      />
      <StatusBar hidden />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: colors.primary,
            // disable tabbar if no user exist
            // display: !user._id ? 'none' : 'flex',
            height: 70,
          },
          tabBarShowLabel: false,
          headerShown: false,
        }}
      >
        {/* if there is no user then render Signup page, else render normal screens */}
        {!user._id ? (
          <Tab.Screen name='SignUp' component={SignUp} />
        ) : (
          <>
            <Tab.Screen
              name='Home-page'
              component={HomeScreen}
              options={{
                tabBarIcon: ({ focused }) => <TabIcon icon='home' />,
              }}
            />
            <Tab.Screen
              name='flashcards'
              component={CategoryScreen}
              options={{
                tabBarIcon: ({ focused }) => <TabIcon icon='cards' />,
              }}
            />
            <Tab.Screen
              name='store'
              component={ShopScreen}
              options={{
                tabBarIcon: ({ focused }) => <TabIcon icon='store' />,
              }}
            />
            <Tab.Screen
              name='Profile-page'
              component={ProfileScreen}
              options={{
                tabBarIcon: ({ focused }) => <TabIcon icon='heart' />,
              }}
            />
          </>
        )}
      </Tab.Navigator>
    </>
  );
};

export default IndexScreen;
