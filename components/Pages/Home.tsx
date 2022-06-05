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

interface Props extends StackNavigationTypes {}

const Home: React.FC<Props> = ({ navigation, route }) => {
  const [favorites, dispatch] = useReducer(cardReducer, []);
  const { user, setUser } = useContext(UserContext);
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
      console.log(user);
      const lastLogin = user.login.lastLogin.valueOf();
      // one day in ms
      const oneday = 60 * 60 * 24 * 1000;
      const twodays = oneday * 2;
      const today = new Date().valueOf();

      const timeDiff = today - lastLogin;

      if (timeDiff <= oneday) {
        return;
      } else if (timeDiff > oneday && timeDiff <= twodays) {
        // const updateUser = user.map
        setUser((prev) => ({
          ...prev,
          login: {
            lastLogin: new Date(),
            streak: prev.login.streak++,
          },
        }));
      }
    }

  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* <Text>Home Page</Text>
      <Text>Hello {user[0]?.username}</Text> */}
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
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 15,
        }}
      >
        <Title style={{ color: colors.secondary }}>Login Bonus</Title>
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
