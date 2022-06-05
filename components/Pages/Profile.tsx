import { View, Text } from 'react-native';
import React, { useContext } from 'react';
import { Button } from 'react-native-paper';
import { initUser, UserContext } from '../../context/userContext';
import db from '../../db-services';

const Profile = () => {
  const { user, setUser } = useContext(UserContext);

  const deleteUser = () => {
    db.remove({ type: 'user' }, {}, (err: Error, numRemoved: number) => {
      if (err) console.log(err);
      // console.log(numRemoved);
      setUser(initUser);
    });
  };

  return (
    <View>
      <Text>Hello {user?.username}</Text>
      <Text>Last Login: {user?.login.lastLogin.toLocaleString()}</Text>
      <Text>Login Streak: {user?.login.streak}</Text>
      <Button
        mode='contained'
        color='tomato'
        style={{margin: 25, elevation: 0}}
        labelStyle={{ color: 'white' }}
        onPress={deleteUser}
      >
        Delete User
      </Button>
    </View>
  );
};

export default Profile;
