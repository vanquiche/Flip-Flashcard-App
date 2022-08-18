import {
  View,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import React, { Suspense, useCallback, useContext } from 'react';
import { ActivityIndicator, Button, Text, Title } from 'react-native-paper';

import { CommonActions, useFocusEffect } from '@react-navigation/native';

import FavoriteCard from '../FavoriteCard';

import { Set, StackNavigationTypes } from '../types';
import fontColorContrast from 'font-color-contrast';

import LoginGoal from '../LoginGoal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { checkLogin } from '../../redux/userThunkActions';
import s from '../styles/styles';
import useCheckDate from '../../hooks/useCheckDate';
import swatchContext from '../../contexts/swatchContext';

interface Props extends StackNavigationTypes {}

const Home = ({ navigation }: Props) => {
  const { user, favoriteSets } = useSelector((state: RootState) => state.store);
  const { theme } = useContext(swatchContext);
  const dispatch = useDispatch<AppDispatch>();

  const dimension = useWindowDimensions();

  const _cardColor = theme.cardColor;
  const _fontColor = theme.fontColor;
  const titleColor = fontColorContrast(theme.bgColor, 0.6);

  const navigateToFavorite = useCallback((set: Set) => {
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
  }, []);

  const { isSameDay } = useCheckDate(user.login[user.login.length - 1]);

  useFocusEffect(
    useCallback(() => {
      if (!isSameDay) {
        dispatch(
          checkLogin({
            streak: user.streak,
            login: user.login,
            heartcoin: user.heartcoin,
          })
        );
      }
    }, [isSameDay])
  );

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

        <Title style={{ textAlign: 'center', color: titleColor, height: '6%' }}>
          FAVORITE SETS
        </Title>

        <View
          style={{
            height: '34%',
            // alignItems: favoriteSets.length === 1 ? 'center' : undefined,
          }}
        >
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.favoritesContainer,
              {
                width:
                  favoriteSets.length === 0
                    ? '100%'
                    : (dimension.width / 2) * favoriteSets.length,
              },
            ]}
          >
            {favoriteSets.length === 0 && (
              <Text
                style={{
                  color: titleColor,
                  ...styles.favoriteMessage,
                }}
              >
                NO FAVORITES
              </Text>
            )}
            {favoriteSets
              .filter((fav) => fav.favorite === true)
              .map((set) => {
                return (
                  <FavoriteCard
                    key={set._id}
                    card={set}
                    onPress={() => navigateToFavorite(set)}
                    width={dimension.width * 0.45}
                  />
                );
              })}
          </ScrollView>
        </View>
      </Suspense>
    </View>
  );
};

const styles = StyleSheet.create({
  favoritesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    // height: '40%',
    // borderWidth: 2,
  },
  infoCardContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13,
    minHeight: 75,
    height: '15%',
  },
  favoriteMessage: {
    textAlign: 'center',
    // paddingTop: 60,
  },
});

export default Home;
