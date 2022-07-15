import { View, StyleSheet, Image } from 'react-native';
import React from 'react';
import { Title, Text } from 'react-native-paper';

interface Props {
  username: string;
  xp: number;
  level: number;
  coin: number;
  color?: string;
  image: any;
}

const UserInfo = ({ username, xp, level, coin, color, image }: Props) => {
  const propStyle = {
    color: color,
  };
  return (
    <>
      <Title style={{ color: color, marginBottom: 10 }}>
        {username.toUpperCase()}
      </Title>

      <Image source={image} style={[styles.image, { tintColor: color }]} />
      
      <View style={styles.container}>
        <View style={styles.itemContainer}>
          <Title style={propStyle}>LEVEL</Title>
          <Title style={propStyle}>{level}</Title>
        </View>
        <View style={styles.itemContainer}>
          <Title style={propStyle}>XP</Title>
          <Title style={propStyle}>{xp}</Title>
        </View>

        <View style={styles.itemContainer}>
          <Title style={propStyle}>COINS</Title>
          <Title style={propStyle}>{coin}</Title>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 15,
  },
  itemContainer: {
    // flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 2,
  },
  image: {
    width: 72,
    height: 72,
  },
});

export default UserInfo;
