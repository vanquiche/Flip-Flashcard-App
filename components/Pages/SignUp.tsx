import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';

import { Title, Text, TextInput, useTheme, Button } from 'react-native-paper';
import db from '../../db-services';
import { UserContext } from '../../context/userContext';
import { User, StackNavigationTypes } from '../types';
import { DateTime } from 'luxon';

interface Props extends StackNavigationTypes {}

const SignUp: React.FC<Props> = ({navigation}) => {
  const [newUser, setNewUser] = useState({
    username: '',
    icon: '',
  });

  const { user, userDispatch } = useContext(UserContext);

  const { colors } = useTheme();

  const createUser = () => {
    const user: User = {
      type: 'user',
      username: newUser.username,
      level: 1,
      experiencePoints: 0,
      heartcoin: 100,
      achievements: [],
      collections: {
        cardDesigns: [],
        cardColors: [],
        themes: [],
      },
      login: {
        week: [DateTime.now().toISO()],
        streak: 0,
        notify: false
      }
    };

    db.insert(user, (err: Error, newDoc: User) => {
      if (err) console.log(err);
      userDispatch({type: 'create user', payload: newDoc})
    });
  };

  return (
    <KeyboardAvoidingView
      behavior='padding'
      style={[styles.container, { backgroundColor: colors.primary }]}
    >
      <View style={[]}>
        <Title
          style={{ textAlign: 'center', color: colors.secondary, fontSize: 22 }}
        >
          CREATE YOUR PROFILE
        </Title>
        <View
          style={[styles.icon, { backgroundColor: colors.secondary }]}
        ></View>
        {/* <TextInput
        label='NAME'
        mode='outlined'
        style={styles.input}
        outlineColor='transparent'
        activeOutlineColor={colors.secondary}
        value={newUser.name}
        onChangeText={(name) => setNewUser((prev) => ({ ...prev, name }))}
      /> */}

        <TextInput
          label='USER NAME'
          mode='outlined'
          style={styles.input}
          outlineColor='transparent'
          activeOutlineColor={colors.secondary}
          maxLength={32}
          value={newUser.username}
          onChangeText={(username) =>
            setNewUser((prev) => ({ ...prev, username }))
          }
        />

        <Button
          mode='contained'
          style={styles.button}
          color={colors.secondary}
          labelStyle={{ color: 'white', fontSize: 16 }}
          onPress={createUser}
          disabled={
            !newUser.username && newUser.username.length > 3 ? true : false
          }
        >
          CREATE
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    // paddingTop: 40,
    justifyContent: 'center',
  },
  input: {
    // height: 40
    marginVertical: 10,
  },
  icon: {
    height: 125,
    aspectRatio: 1,
    backgroundColor: 'tomato',
    borderRadius: 65,
    margin: 10,
    alignSelf: 'center',
  },
  button: {
    elevation: 0,
    padding: 8,
    marginVertical: 15,
  },
});

export default SignUp;
