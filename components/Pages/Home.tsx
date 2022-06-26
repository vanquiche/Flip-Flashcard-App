import { View, ScrollView, StyleSheet } from 'react-native';
import React, { useEffect, useReducer, Suspense } from 'react';
import {
  ActivityIndicator,
  Button,
  Text,
  Title,
  useTheme,
} from 'react-native-paper';

import { CommonActions, useIsFocused } from '@react-navigation/native';

import getData from '../../utility/getData';
import FavoriteCard from '../FavoriteCard';

import { Set, StackNavigationTypes, User } from '../types';
import loginStreak from '../../utility/loginStreak';
import sortWeek from '../../utility/sortWeek';
import LoginGoal from '../LoginGoal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { checkLogin } from '../../redux/userThunkActions';
import { showNotification } from '../../redux/storeSlice';

interface Props extends StackNavigationTypes {}

const Home: React.FC<Props> = ({ navigation, route }) => {
  const { user, loading, favoriteSets } = useSelector(
    (state: RootState) => state.store
  );
  const dispatch = useDispatch<AppDispatch>();

  const level = user.xp / 300 < 1 ? 1 : Math.floor(user.xp / 300);

  // bad code?? 

  // const inStreak = loginStreak(user.login[user.login.length - 1]);
  // if (inStreak) {
  //   dispatch(showNotification(`logged in ${user.streak} days consecutively!`));
  // }

  const { colors } = useTheme();

  const navigateToFavorite = (set: Set) => {
    navigation.dispatch({
      ...CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'flashcards',
            state: {
              routes: [
                {
                  name: 'Categories',
                },
                {
                  name: 'Sets',
                  params: {
                    categoryRef: set.categoryRef,
                  },
                },
                {
                  name: 'Cards',
                  params: {
                    color: set.color,
                    design: set.design,
                    setRef: set._id,
                    categoryRef: set.categoryRef,
                  },
                },
              ],
            },
          },
        ],
      }),
    });
  };

  useEffect(() => {
    dispatch(
      checkLogin({
        lastLogin: user.login,
        streak: user.streak,
        xp: user.xp
      })
    );
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', marginTop: 15, marginHorizontal: 10,justifyContent: 'space-around' }}>
        <View style={[styles.infoCard, { backgroundColor: colors.primary }]}>
          <Title style={{ color: colors.secondary }}>LEVEL: {level}</Title>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.primary }]}>
          <Title style={{ color: colors.secondary }}>XP: {user.xp}</Title>
        </View>
      </View>

      <LoginGoal dates={user.login} streak={user.streak} />

      <Title style={{ textAlign: 'center', color: colors.secondary }}>
        FAVORITE SETS
      </Title>

      <Suspense fallback={<ActivityIndicator />}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.favoritesContainer,
            { width: 180 * favoriteSets.length },
          ]}
        >
          {favoriteSets
            .filter((fav) => fav.favorite === true)
            .map((set) => {
              return (
                <FavoriteCard
                  key={set._id}
                  card={set}
                  onPress={() => navigateToFavorite(set)}
                />
              );
            })}
        </ScrollView>
      </Suspense>
    </View>
  );
};

const styles = StyleSheet.create({
  favoritesContainer: {
    marginHorizontal: 15,
    marginVertical: 10,
  },
  infoCard: {
    width: '45%',
    height: 75,
    borderRadius: 10,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
