import { View, Text } from 'react-native';
import React from 'react';
import { Button } from 'react-native-paper';

import { DateTime } from 'luxon';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { deleteUser } from '../../redux/userSlice';

const Profile = () => {
  const { user, loading, notification } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch<AppDispatch>()

  const lastLoginDate = DateTime.fromISO(
    user.login?.week[user.login.week.length - 1]
  ).toFormat('ff');

  const deleteCurrentUser = () => {
    dispatch(deleteUser())
  };

  return (
    <View>
      <Text>Hello {user?.username}</Text>
      <Text>Last Login: {lastLoginDate.toLocaleString()}</Text>
      <Text>Login Streak: {user?.login.streak}</Text>
      <Button
        mode='contained'
        color='tomato'
        style={{ margin: 25, elevation: 0 }}
        labelStyle={{ color: 'white' }}
        onPress={deleteCurrentUser}
      >
        Delete User
      </Button>
    </View>
  );
};

export default Profile;
