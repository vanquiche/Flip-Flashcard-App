import { View, ScrollView, StyleSheet } from 'react-native';
import React, { useEffect, Suspense, useCallback, useContext } from 'react';
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
import swatchContext from '../../contexts/swatchContext';

interface Props extends StackNavigationTypes {}

const Home = ({ navigation, route }: Props) => {
  const { user, favoriteSets, levelUpCondition } = useSelector(
    (state: RootState) => state.store
  );
  const { theme } = useContext(swatchContext);
  const dispatch = useDispatch<AppDispatch>();

  const _cardColor = theme.cardColor;
  const _fontColor = theme.fontColor;

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
  }, [isSameDay]);

  return (
    <View style={s.screenWrapper}>
      <Suspense fallback={<ActivityIndicator />}>
        <View
          style={{
            ...styles.infoCardContainer,
            backgroundColor: _cardColor,
          }}
        >
          <Button
            color={_fontColor}
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
              color: _cardColor,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCardContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13,
    minHeight: 75,
    height: '15%',
  },
  favoriteMessage: {
    textAlign: 'center',
    paddingTop: 60,
  },
});

export default Home;
