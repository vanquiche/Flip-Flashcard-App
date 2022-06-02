import { View, Text } from 'react-native';
import React, { useContext } from 'react';
import { Button } from 'react-native-paper';
import { UserContext } from '../../context/userContext';
import db from '../../db-services';

const Profile = () => {
  const { user, setUser } = useContext(UserContext);

  const deleteUser = () => {
    db.remove({ type: 'user' }, {}, (err: Error, numRemoved: number) => {
      if (err) console.log(err);
      // console.log(numRemoved);
      setUser([]);
    });
  };

  return (
    <View>
      <Text>Hell {user[0].username}</Text>
      <Button mode='text' color='black' onPress={deleteUser}>
        Delete User
      </Button>
    </View>
  );
};

export default Profile;
