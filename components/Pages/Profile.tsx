import { View, Text, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import { Button } from 'react-native-paper';

import { DateTime } from 'luxon';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { deleteUser } from '../../redux/userSlice';
import { getPoints } from '../../redux/categoryPointSlice';

const Profile = () => {
  const { user, loading } = useSelector((state: RootState) => state.user);
  const { categories } = useSelector((state: RootState) => state.categoryPoint);
  const dispatch = useDispatch<AppDispatch>();

  const lastLoginDate = DateTime.fromISO(
    user.login?.week[user.login.week.length - 1]
  ).toFormat('ff');

  const deleteCurrentUser = () => {
    dispatch(deleteUser());
  };

  // useEffect(() => {
  //   dispatch(getPoints());
  // }, []);

  // console.log(user.login.week)
  return (
    <View>
      <Text>Hello {user.username}</Text>
      <Text>Last Login: {lastLoginDate.toLocaleString()}</Text>
      <Text>Login Streak: {user.login.streak}</Text>
      <Text>XP: {user.experiencePoints}</Text>
      <Button
        mode='contained'
        color='tomato'
        style={{ margin: 25, elevation: 0 }}
        labelStyle={{ color: 'white' }}
        onPress={deleteCurrentUser}
      >
        Delete User
      </Button>
      <View>
        <Text>CATEGORIES</Text>
        {categories.map((category) => {
          const level = category.points / 150
          return (
            <View key={category._id}>
              <Text>CATEGORY: {category.name}</Text>
              <Text>POINTS: {category.points}</Text>
              <Text>LEVEL: {level < 1 ? 1 : Math.floor(level)}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default Profile;
