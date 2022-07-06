import { View, ScrollView, StyleSheet } from 'react-native';
import React, { useEffect, Suspense } from 'react';
import { ActivityIndicator, Text, Title } from 'react-native-paper';

import { CommonActions } from '@react-navigation/native';

import FavoriteCard from '../FavoriteCard';

import { Set, StackNavigationTypes } from '../types';

import LoginGoal from '../LoginGoal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { checkLogin } from '../../redux/userThunkActions';
import s from '../styles/styles';

interface Props extends StackNavigationTypes {}

const Home = ({ navigation, route }: Props) => {
  const { user, favoriteSets, levelUpCondition } = useSelector(
    (state: RootState) => state.store
  );
  const dispatch = useDispatch<AppDispatch>();

  const _cardColor = user.theme.cardColor;
  const _fontColor = user.theme.fontColor;

  const level = user.xp / 100 < 1 ? 1 : Math.floor(user.xp / levelUpCondition);

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

  // check users login
  useEffect(() => {
    dispatch(
      checkLogin({
        streak: user.streak,
        lastLogin: user.login,
        heartcoins: user.heartcoin,
      })
    );
  }, [checkLogin]);

  return (
    <View style={s.screenWrapper}>
      <View style={styles.infoCardContainer}>
        <View style={[styles.infoCard, { backgroundColor: _cardColor }]}>
          <Title style={{ color: user.theme.fontColor }}>LEVEL: {level}</Title>
        </View>

        <View style={[styles.infoCard, { backgroundColor: _cardColor }]}>
          <Title style={{ color: _fontColor }}>HEARTS: {user.heartcoin}</Title>
        </View>
      </View>

      <LoginGoal dates={user.login} streak={user.streak} />

      <Title style={{ textAlign: 'center', color: _cardColor }}>
        FAVORITE SETS
      </Title>

      <Suspense fallback={<ActivityIndicator />}>
        {favoriteSets.length === 0 && (
          <Text
            style={{
              color: user.theme.cardColor,
              ...styles.favoriteMessage,
            }}
          >
            NO FAVORITES
          </Text>
        )}
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
  infoCardContainer: {
    flexDirection: 'row',
    marginTop: 15,
    marginHorizontal: 10,
    justifyContent: 'space-around',
  },
  favoriteMessage: {
    textAlign: 'center',
    paddingTop: 50,
  },
});

export default Home;
