import { View, Text, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import { Button, Title, useTheme } from 'react-native-paper';

import { DateTime } from 'luxon';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { deleteUser } from '../../redux/userThunkActions';
import { getCards } from '../../redux/cardThunkActions';
import PointTracker from '../PointTracker';
import { StackNavigationTypes } from '../types';

interface Props extends StackNavigationTypes {}

const Profile:React.FC<Props> = ({navigation}) => {
  const { user, loading, cards } = useSelector(
    (state: RootState) => state.store
  );
  const { colors } = useTheme();

  const dispatch = useDispatch<AppDispatch>();

  const lastLoginDate = DateTime.fromISO(
    user.login[user.login.length - 1]
  ).toFormat('ff');

  const deleteCurrentUser = () => {
    dispatch(deleteUser());
  };

  // create button that goes to themes screen
  return (
    <View>
      <Button onPress={() => navigation.navigate('Themes')}>Theme</Button>
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
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        <Title style={{ color: colors.secondary }}>CATEGORIES</Title>
        {cards.category.map((c) => {
          return (
            <PointTracker
              key={c._id}
              title={c.name}
              points={c.points}
              total={100}
              progressColor={colors.secondary}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default Profile;
