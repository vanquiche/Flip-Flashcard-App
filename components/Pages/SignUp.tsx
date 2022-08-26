import { View, StyleSheet, KeyboardAvoidingView, Image } from 'react-native';
import React, { useState } from 'react';

import { Title, Text, TextInput, Button } from 'react-native-paper';
import { defaultTheme } from '../types';
import { DateTime } from 'luxon';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { createNewUser } from '../../redux/userThunkActions';

const SignUp = () => {
  const [newUser, setNewUser] = useState('');
  const logo = require('../../assets/adaptive-icon.png');

  const dispatch = useDispatch<AppDispatch>();
  const dt = DateTime;

  const createUser = () => {
    const createUser = {
      type: 'user',
      username: newUser ? newUser : 'user',
      xp: 0,
      heartcoin: 75,
      achievements: [],
      completedQuiz: [],
      login: [dt.now().toISO()],
      streak: 0,
      theme: defaultTheme,
      stats: [],
      collection: {
        themes: [],
        colors: [],
        patterns: {},
      },
    };
    dispatch(createNewUser(createUser));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFADC6' }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior='padding'
        keyboardVerticalOffset={50}
      >
        <View>
          <Image source={logo} style={styles.logo} />
          <Title
            style={{
              textAlign: 'center',
              color: 'white',
              fontSize: 22,
              marginTop: 20,
            }}
            accessibilityRole='text'
            accessibilityLabel='create your account'
          >
            CREATE YOUR ACCOUNT
          </Title>

          <TextInput
            label='USERNAME'
            mode='outlined'
            style={styles.input}
            outlineColor='transparent'
            activeOutlineColor='tomato'
            maxLength={32}
            value={newUser}
            onChangeText={(text) => setNewUser(text)}
          />

          <Button
            mode='contained'
            style={styles.button}
            color='#499feb'
            labelStyle={{ fontSize: 16, color: 'white' }}
            onPress={createUser}
            disabled={!newUser || newUser.length < 3}
            accessibilityRole='button'
            accessibilityLabel='create'
            accessibilityHint='confirm and create new user'
          >
            START!
          </Button>
        </View>
      </KeyboardAvoidingView>
      <Text style={{ color: 'white', textAlign: 'center', paddingBottom: 10 }}>
        HAPPY CLOVER STUDIO
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'center',
  },
  input: {
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
  logo: {
    height: 65,
    width: 65,
    alignSelf: 'center',
  },
});

export default SignUp;
