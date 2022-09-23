import {
  View,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import React, { useCallback, useContext, useState } from 'react';
import { Button, Text, Title } from 'react-native-paper';

import { CommonActions, useFocusEffect } from '@react-navigation/native';

import FavoriteCard from '../FavoriteCard';

import { Set, StackNavigationTypes } from '../types';
import fontColorContrast from 'font-color-contrast';

import LoginGoal from '../LoginGoal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { checkLogin } from '../../redux/userThunkActions';
import s from '../styles/styles';
import checkDate from '../../utility/checkDate';
import swatchContext from '../../contexts/swatchContext';
import StatusCard from '../StatusCard';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DateTime } from 'luxon';

interface Props extends StackNavigationTypes {}

const Home = ({ navigation }: Props) => {
  const { user, favoriteSets, levelUpCondition, cards } = useSelector(
    (state: RootState) => state.store
  );
  const dt = DateTime;
  const [dayCycle, setDayCycle] = useState(dt.now().hour);
  const { theme } = useContext(swatchContext);
  const dispatch = useDispatch<AppDispatch>();

  const dimension = useWindowDimensions();

  const _cardColor = theme.cardColor;
  const _fontColor = theme.fontColor;
  const titleColor = fontColorContrast(theme.bgColor, 0.6);

  const navigateToFavorite = useCallback((set: Set) => {
    const parent = cards.category.find((c) => c._id === set.categoryRef);
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
                    screenTitle: parent?.name,
                  },
                },
                {
                  name: 'Cards',
                  params: {
                    color: set.color,
                    design: set.design,
                    setRef: set._id,
                    categoryRef: set.categoryRef,
                    screenTitle: set.name,
                  },
                },
              ],
            },
          },
        ],
      }),
    });
  }, []);

  const isSameDay = checkDate(user.login[user.login.length - 1]);

  useFocusEffect(
    useCallback(() => {
      const hour = dt.now().hour;
      if (hour !== dayCycle) {
        setDayCycle(hour);
      }
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
      <View style={styles.buttonCardContainer}>
        <View
          style={{
            ...styles.buttonCard,
            backgroundColor: _cardColor,
          }}
        >
          <Button
            color={_fontColor}
            labelStyle={{ fontSize: 18, color: _fontColor }}
            onPress={() => navigation.navigate('Stats')}
            accessibilityLabel='statistics'
            accessibilityHint='navigate to stats screen'
          >
            STATS
          </Button>
          <Ionicons
            name='stats-chart'
            size={24}
            color={_fontColor}
            style={{ position: 'absolute', right: 30, paddingBottom: 10 }}
          />
        </View>

        <View
          style={{
            ...styles.buttonCard,
            backgroundColor: _cardColor,
          }}
        >
          <Button
            color={_fontColor}
            labelStyle={{ fontSize: 18, color: _fontColor }}
            onPress={() => navigation.navigate('Themes')}
            accessibilityLabel='themes'
            accessibilityHint='navigate to themes screen'
          >
            THEMES
          </Button>
          <MaterialCommunityIcons
            name='brush-variant'
            size={24}
            color={_fontColor}
            style={{ position: 'absolute', right: 23, paddingBottom: 5 }}
          />
        </View>
      </View>

      <StatusCard
        bgColor={_cardColor}
        fontColor={theme.fontColor}
        user={user}
        levelUpCondition={levelUpCondition}
        hour={dayCycle}
      />

      <LoginGoal dates={user.login} streak={user.streak} />

      <View style={styles.favoritesCardContainer}>
        <Title style={{ textAlign: 'center', color: titleColor }}>
          FAVORITE SETS
        </Title>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.favoritesContainer,
            {
              width:
                favoriteSets.length === 0
                  ? dimension.width
                  : (dimension.width / 2) * favoriteSets.length,
            },
          ]}
        >
          {favoriteSets.length === 0 && (
            <Text
              style={{
                color: titleColor,
                ...styles.favoriteMessage,
                width: dimension.width
              }}
              accessibilityElementsHidden
            >
              NO FAVORITES
            </Text>
          )}

          {favoriteSets
            .filter((fav) => fav.favorite === true)
            .map((set) => {
              const parent = cards.category.find(
                (c) => c._id === set.categoryRef
              );
              return (
                <FavoriteCard
                  key={set._id}
                  card={set}
                  onPress={() => navigateToFavorite(set)}
                  width={dimension.width * 0.45}
                  parentName={parent?.name}
                />
              );
            })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  favoritesContainer: {
    alignItems: 'center',
    // justifyContent: 'center',
    // borderWidth: 2,
    padding: 10,
  },
  buttonCard: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    height: '100%',
    width: '49%',
  },
  favoriteMessage: {
    textAlign: 'center',
    position: 'absolute',
    // borderWidth: 2,
  },
  buttonCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
    marginVertical: 10,
    height: '10%',
  },
  favoritesCardContainer: {
    height: '35%',
  },
});

export default Home;
