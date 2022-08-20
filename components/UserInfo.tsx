import { View, StyleSheet, Image, StyleProp, TextStyle } from 'react-native';
import React from 'react';
import { Title } from 'react-native-paper';

interface Props {
  username: string;
  xp: number;
  level: number;
  coin: number;
  color?: string;
  image: any;
}

const UserInfo = ({ username, xp, level, coin, color, image }: Props) => {
  const propStyle: StyleProp<TextStyle> = {
    color: color,
  };
  return (
    <>
      <Title
        style={{ color: color, marginBottom: 10 }}
        accessible
        accessibilityRole='text'
      >
        {username.toUpperCase()}
      </Title>

      <Image source={image} style={[styles.image, { tintColor: color }]} />

      <View style={styles.container}>
        <View style={styles.itemContainer}>
          <Title style={propStyle}>LEVEL</Title>
          <Title
            style={propStyle}
            accessible
            accessibilityRole='text'
            accessibilityLabel={`level ${level}`}
          >
            {level}
          </Title>
        </View>
        <View style={styles.itemContainer}>
          <Title style={propStyle}>XP</Title>
          <Title
            style={propStyle}
            accessible
            accessibilityRole='text'
            accessibilityLabel={`${xp} xp`}
          >
            {xp}
          </Title>
        </View>

        <View style={styles.itemContainer}>
          <Title style={propStyle}>COINS</Title>
          <Title
            style={propStyle}
            accessible
            accessibilityRole='text'
            accessibilityLabel={`${coin} coin`}
          >
            {coin}
          </Title>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 15,
  },
  itemContainer: {
    alignItems: 'center',
  },
  image: {
    width: 72,
    height: 72,
  },
});

export default UserInfo;
