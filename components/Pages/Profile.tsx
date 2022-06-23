import { View, Text, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import { Button } from 'react-native-paper';

import { DateTime } from 'luxon';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { deleteUser } from '../../redux/userThunkActions';
import { getCards } from '../../redux/cardThunkActions';

const Profile = () => {
  const { user, loading, cards } = useSelector(
    (state: RootState) => state.store
  );

  const dispatch = useDispatch<AppDispatch>();

  const lastLoginDate = DateTime.fromISO(
    user.login[user.login.length - 1]
  ).toFormat('ff');

  const deleteCurrentUser = () => {
    dispatch(deleteUser());
  };

  useEffect(() => {
    if (cards.category.length === 0) {
      dispatch(getCards({ type: 'category', query: { type: 'category' } }));
    } else return;
  }, []);

  // console.log(user.login.week)
  return (
    <View>
      <Text>Hello {user.username}</Text>
      <Text>Last Login: {lastLoginDate}</Text>
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
      </Button>
      <View>
        <Text>CATEGORIES</Text>
        {cards.category.map((c) => {
          const level = c.points / 150;
          return (
            <View key={c._id}>
              <Text>CATEGORY: {c.name}</Text>
              <Text>POINTS: {c.points}</Text>
              <Text>LEVEL: {level < 1 ? 1 : Math.floor(level)}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default Profile;
