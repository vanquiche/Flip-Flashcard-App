import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import React, { useContext } from 'react';
import { IconButton, Title, Button } from 'react-native-paper';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { deleteUser } from '../../redux/userThunkActions';
import fontColorContrast from 'font-color-contrast';

import PointTracker from '../PointTracker';
import s from '../styles/styles';

import { StackNavigationTypes } from '../types';
import UserInfo from '../UserInfo';
import swatchContext from '../../contexts/swatchContext';
const profileImg = require('../../assets/images/profile-user.png');

interface Props extends StackNavigationTypes {}

const Profile = ({ navigation }: Props) => {
  const { user, cards, levelUpCondition } = useSelector(
    (state: RootState) => state.store
  );
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useContext(swatchContext);

  const level = user.xp / 100 < 1 ? 1 : Math.floor(user.xp / levelUpCondition);

  const fontColor = fontColorContrast(theme.bgColor, 0.6)

  // const lastLoginDate = DateTime.fromISO(
  //   user.login[user.login.length - 1]
  // ).toFormat('ff');

  const deleteCurrentUser = () => {
    dispatch(deleteUser());
  };

  return (
    <View style={s.screenWrapper}>
      <IconButton
        style={{ position: 'absolute', right: 0 }}
        size={32}
        icon='brush-variant'
        color={fontColor}
        onPress={() => navigation.navigate('Themes')}
      >
        themes
      </IconButton>
      {/* <Text>Last Login: {lastLoginDate}</Text> */}

      <Button
      mode='text'
      color='tomato'
      style={{ margin: 25, elevation: 0 }}
      labelStyle={{ color: 'black' }}
      onPress={deleteCurrentUser}
    >
      Delete User
    </Button>

      {/* USER PROFILE INFO */}
      <View style={styles.profileContainer}>
        <UserInfo
          xp={user.xp}
          level={level}
          color={fontColor}
          image={profileImg}
          coin={user.heartcoin}
          username={user.username}
        />
        <PointTracker
          points={user.xp}
          progressColor={fontColor}
          total={levelUpCondition}
        />
      </View>

      {/* CATEGORY POINT CONTAINER */}
      <ScrollView contentContainerStyle={styles.categoryContainer}>
        <Title style={{ color: fontColor }}>CATEGORIES</Title>
        {cards.category.map((c) => {
          return (
            <PointTracker
              key={c._id}
              title={c.name}
              points={c.points}
              progressColor={fontColor}
              total={100}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
    right: 5,
  },
});

export default Profile;
