import { View, ScrollView, StyleSheet } from 'react-native';
import React, {
  useEffect,
  useReducer,
  Suspense,
} from 'react';
import {
  ActivityIndicator,
  Button,
  Text,
  Title,
  useTheme,
} from 'react-native-paper';

import { CommonActions, useIsFocused } from '@react-navigation/native';

import { cardReducer } from '../../reducers/CardReducer';

import getData from '../../utility/getData';
import FavoriteCard from '../FavoriteCard';

import { Set, StackNavigationTypes, User } from '../types';
import loginStreak from '../../utility/loginStreak';
import sortWeek from '../../utility/sortWeek';
import LoginGoal from '../LoginGoal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { updateUser } from '../../redux/userSlice';

interface Props extends StackNavigationTypes {}

const Home: React.FC<Props> = ({ navigation, route }) => {
  const [favorites, cardDispatch] = useReducer(cardReducer, []);
  const { user, loading, notification } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch<AppDispatch>();

  const isFocused = useIsFocused();
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
    if (isFocused) {
      // console.log('useEffect: getting favorites');
      getData({ type: 'set', favorite: true }, cardDispatch);
    } else return;
  }, [isFocused]);

  useEffect(() => {
    if (user._id) {
      const lastLogin = user.login.week;
      // get date of last login from week
      const streak = loginStreak(lastLogin[lastLogin.length - 1]);
      console.log('streak: ' + streak);

      if (streak === null) {
        // login is less than 24hrs old then do nothing
        return;
      } else if (streak === false) {
        // login is older than 2days
        // set streak to 0
        const updateLogin = {
          login: {
            week: sortWeek(user.login.week),
            streak: 0,
          },
        };
        dispatch(updateUser(updateLogin));
      } else if (streak) {
        // login is greater than one day but less than 2days
        // increment streak
        const updateLogin = {
          experiencePoints: user.experiencePoints + 50,
          login: {
            week: sortWeek(user.login.week),
            streak: user.login.streak + 1,
          },
        };
        dispatch(updateUser(updateLogin));
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
            XP: {user?.experiencePoints}
          </Title>
        </View>
      </View>

      <LoginGoal dates={user.login.week} streak={user.login.streak} />

      <Title style={{ textAlign: 'center', color: colors.secondary }}>
        FAVORITE SETS
      </Title>

      <Suspense fallback={<ActivityIndicator />}>
        <ScrollView
          horizontal={true}
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
