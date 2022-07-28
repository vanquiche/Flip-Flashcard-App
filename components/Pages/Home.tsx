import { View, ScrollView, StyleSheet } from 'react-native';
import React, { useEffect, Suspense, useCallback } from 'react';
import { ActivityIndicator, Button, Text, Title } from 'react-native-paper';

import { CommonActions, useFocusEffect } from '@react-navigation/native';

import FavoriteCard from '../FavoriteCard';

import { Set, StackNavigationTypes } from '../types';

import LoginGoal from '../LoginGoal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { checkLogin } from '../../redux/userThunkActions';
import s from '../styles/styles';
import useCheckDate from '../../hooks/useCheckDate';
import loginStreak from '../../utility/loginStreak';
import { showNotification } from '../../redux/storeSlice';

interface Props extends StackNavigationTypes {}

const Home = ({ navigation, route }: Props) => {
  const { user, favoriteSets, levelUpCondition } = useSelector(
    (state: RootState) => state.store
  );
  const dispatch = useDispatch<AppDispatch>();

  const _cardColor = user.theme.cardColor;
  const _fontColor = user.theme.fontColor;

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

  const { isSameDay } = useCheckDate(user.login[user.login.length - 1]);

  useEffect(() => {
    if (!isSameDay) {
      dispatch(
        checkLogin({
          streak: user.streak,
          login: user.login,
          heartcoin: user.heartcoin,
        })
      );
    }
    return;
  }, [isSameDay]);

  return (
    <View style={s.screenWrapper}>
      <Suspense fallback={<ActivityIndicator />}>
        <View
          style={{
            ...styles.infoCardContainer,
            backgroundColor: user.theme.cardColor,
          }}
        >
          <Button
            color={user.theme.fontColor}
            labelStyle={{ fontSize: 20 }}
            onPress={() => navigation.navigate('Stats')}
          >
            STATISTICS
          </Button>
        </View>

        <LoginGoal dates={user.login} streak={user.streak} />

        <Title style={{ textAlign: 'center', color: _cardColor }}>
          FAVORITE SETS
        </Title>

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
  // infoCard: {
  //   width: '45%',
  //   height: 75,
  //   borderRadius: 10,
  //   margin: 10,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  infoCardContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13,
    height: 75,
  },
  favoriteMessage: {
    textAlign: 'center',
    paddingTop: 60,
  },
});

export default Home;
