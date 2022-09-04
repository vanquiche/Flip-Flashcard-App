import { StyleSheet, View } from 'react-native';
import { Title } from 'react-native-paper';
import React from 'react';
import { DateTime } from 'luxon';
import { Ionicons } from '@expo/vector-icons';
import { User } from './types';

interface Props {
  bgColor?: string;
  fontColor?: string;
  user: User;
  levelUpCondition: number;
  hour: number;
}
const StatusCard = ({
  bgColor,
  fontColor,
  user,
  levelUpCondition,
  hour,
}: Props) => {
  const dt = DateTime;
  const weekDay = dt.now().weekdayShort.toUpperCase();
  const dayCycle = hour >= 16 ? 'moon' : hour < 5 ? 'moon' : 'sunny';

  const level = user.xp / 100 < 1 ? 1 : Math.floor(user.xp / levelUpCondition);
  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: bgColor || 'black',
        },
      ]}
    >
      <Title style={{ color: fontColor || 'white' }}>
        HELLO {user.username?.toUpperCase()}
      </Title>

      <View style={styles.info}>
        <Ionicons
          name={dayCycle}
          size={28}
          color={fontColor || 'white'}
          style={{ paddingBottom: 5 }}
        />

        <Title style={{ color: fontColor || 'white' }}>LEVEL {level}</Title>

        <Title
          style={{
            color: fontColor || 'white',
          }}
        >
          {weekDay}
        </Title>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    height: '18%',
    marginHorizontal: 15,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 30,
    overflow: 'hidden',
  },
  info: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
});

export default StatusCard;
