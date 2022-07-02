import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import React from 'react';
import { Button, Title } from 'react-native-paper';

import { DateTime } from 'luxon';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { deleteUser } from '../../redux/userThunkActions';

import PointTracker from '../PointTracker';
import s from '../styles/styles';

import { StackNavigationTypes } from '../types';

interface Props extends StackNavigationTypes {}

const Profile: React.FC<Props> = ({ navigation }) => {
  const { user, cards, levelUpCondition } = useSelector(
    (state: RootState) => state.store
  );

  const _color = user.theme.cardColor;

  const profileImg = require('../../assets/images/profile-user.png');

  const dispatch = useDispatch<AppDispatch>();

  const lastLoginDate = DateTime.fromISO(
    user.login[user.login.length - 1]
  ).toFormat('ff');

  const deleteCurrentUser = () => {
    dispatch(deleteUser());
  };

  return (
    <View style={s.screenWrapper}>
      <Button
        mode='text'
        color={_color}
        style={[
          // s.cardActionButton,
          styles.themeButton
        ]}
        labelStyle={{ color: _color }}
        onPress={() => navigation.navigate('Themes')}
      >
        themes
      </Button>
      <Text>Last Login: {lastLoginDate}</Text>
      {/*
      <Text>Hello {user.username}</Text>
      <Text>Login Streak: {user.streak}</Text>
      <Text>XP: {user.xp}</Text>
      <Button
        mode='contained'
        color='tomato'
        style={{ margin: 25, elevation: 0 }}
        labelStyle={{ color: 'white' }}
        onPress={deleteCurrentUser}
      >
        Delete User
      </Button> */}

      {/* USER PROFILE INFO */}
      <View style={styles.profileContainer}>
        <Title style={{color: _color}}>{user.username.toUpperCase()}</Title>
        <Image
          source={profileImg}
          style={[styles.image, { tintColor: _color }]}
        />
        <PointTracker
          // title={user.username}
          points={user.xp}
          total={levelUpCondition}
          progressColor={_color}
        />
      </View>

      {/* CATEGORY POINT CONTAINER */}
      <ScrollView contentContainerStyle={styles.categoryContainer}>
        <Title style={{ color: _color }}>CATEGORIES</Title>
        {cards.category.map((c) => {
          return (
            <PointTracker
              key={c._id}
              title={c.name}
              points={c.points}
              progressColor={_color}
              total={100}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 72,
    height: 72,
  },
  categoryContainer: {
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 30,
    marginBottom: 15,
  },
  themeButton: {
    position: 'absolute',
    right: 5
  }
});

export default Profile;
