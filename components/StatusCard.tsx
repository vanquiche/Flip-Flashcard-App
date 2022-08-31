import { View } from 'react-native';
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
}
const StatusCard = ({ bgColor, fontColor, user, levelUpCondition }: Props) => {
  const dt = DateTime;
  const weekDay = dt.now().weekdayShort.toUpperCase();
  const dayCycle = dt.now().hour > 18 ? 'moon' : 'sunny';

  const level = user.xp / 100 < 1 ? 1 : Math.floor(user.xp / levelUpCondition);
  return (
    <View
      style={{
        height: '18%',
        backgroundColor: bgColor || 'black',
        marginHorizontal: 15,
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        paddingHorizontal: 30,
      }}
    >
      <Title style={{ color: fontColor || 'white' }}>
        HELLO {user.username?.toUpperCase()}
      </Title>

      <View
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          width: '100%',
        }}
      >
        <Ionicons
          name={dayCycle}
          size={28}
          color='white'
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

export default StatusCard;
