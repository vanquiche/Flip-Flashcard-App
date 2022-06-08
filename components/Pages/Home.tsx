import { View, ScrollView, StyleSheet } from 'react-native';
import React, { useContext, useEffect, useState, useReducer } from 'react';
import { Button, Text, Title, useTheme } from 'react-native-paper';

import { CommonActions } from '@react-navigation/native';

import { UserContext } from '../../context/userContext';
import { cardReducer } from '../../reducers/CardReducer';

import db from '../../db-services';
import getData from '../../utility/getData';
import FavoriteCard from '../FavoriteCard';

import { Set, StackNavigationTypes, User } from '../types';
import loginStreak from '../../utility/loginStreak';
import sortWeek from '../../utility/sortWeek';
import LoginGoal from '../LoginGoal';

interface Props extends StackNavigationTypes {}

const Home: React.FC<Props> = ({ navigation, route }) => {
  const [favorites, dispatch] = useReducer(cardReducer, []);
  const { user, userDispatch } = useContext(UserContext);
  // console.log(user)

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
    getData({ type: 'set', favorite: true }, dispatch);
  }, []);

  useEffect(() => {
    if (user) {
      const lastLogin = user.login.week;
      // get date of last login from week
      const streak = loginStreak(lastLogin[lastLogin.length - 1]);

      if (streak === null) {
        // login is less than 24hrs old then do nothing
        return;
      } else if (streak === false) {
        // login is older than 2days
        // set streak to 0
        const updateLogin = {
          login: {
            week: sortWeek(user.login.week),
            streak: 0
          }
        }
        userDispatch({type: 'set login', payload: updateLogin})

      } else if (streak) {
        // login is greater than one day but less than 2days
        // increment streak
        const updateLogin = {
          login: {
            week: sortWeek(user.login.week),
            streak: (user.login.streak += 1),
          }
        }
        userDispatch({type: 'set login', payload: updateLogin})
      }
    } else return;
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', marginTop: 15 }}>
        <View style={[styles.infoCard, { backgroundColor: colors.primary }]}>
          <Title style={{ color: colors.secondary }}>
            LEVEL: {user?.level}
          </Title>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.primary }]}>
          <Title style={{ color: colors.secondary }}>
            {user?.heartcoin} COINS
          </Title>
        </View>
      </View>

      <View
        style={{
          backgroundColor: colors.primary,
          marginHorizontal: 15,
          marginVertical: 15,
          height: 185,
          justifyContent: 'space-evenly',
          alignItems: 'center',
          borderRadius: 15,
        }}
      >
        <Title style={{ color: colors.secondary }}>LOGIN GOAL</Title>
        <LoginGoal dates={user.login.week} />
        <Title style={{ color: colors.secondary }}>
          LOGIN STREAK: {user.login.streak}
        </Title>
      </View>

      <Title style={{ textAlign: 'center', color: colors.secondary }}>
        FAVORITE SETS
      </Title>

      <ScrollView
        horizontal={true}
        // pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.favoritesContainer,
          { width: 180 * favorites.length },
        ]}
      >
        {favorites.map((set) => {
          return (
            <FavoriteCard
              key={set._id}
              card={set}
              onPress={() => navigateToFavorite(set)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  favoritesContainer: {
    // width: 600,
    // paddingHorizontal: 20
    marginHorizontal: 15,
    marginVertical: 10,
  },
  infoCard: {
    width: '45%',
    height: 75,
    borderRadius: 10,
    margin: 10,
    // marginVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
