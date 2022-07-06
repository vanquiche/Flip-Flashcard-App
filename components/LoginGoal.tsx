import { View, StyleSheet } from 'react-native';
import { Text, IconButton, useTheme, Title } from 'react-native-paper';
import React, { useMemo } from 'react';
import { DateTime, WeekdayNumbers } from 'luxon';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const displayWeek = [
  { name: 'S', date: 7 },
  { name: 'M', date: 1 },
  { name: 'T', date: 2 },
  { name: 'W', date: 3 },
  { name: 'T', date: 4 },
  { name: 'F', date: 5 },
  { name: 'S', date: 6 },
];

interface Props {
  dates: string[];
  streak: number;
}

const LoginGoal = ({ dates, streak }: Props) => {
  const { user } = useSelector((state: RootState) => state.store);
  const dt = DateTime;

  // create an object corresponding for each day of the week
  const days = useMemo(() => {
    return displayWeek.map((w) => {
      // convert prop dates into day number i.e sunday === 0
      const convertDateToNumber = dates.map((date) => dt.fromISO(date).weekday);

      // check to see if any day matches user login
      const exist = convertDateToNumber.includes(w.date as WeekdayNumbers);
      if (exist) {
        const date = {
          name: w.name,
          date: w.date,
          loggedIn: true,
        };
        return date;
      } else {
        const date = {
          name: w.name,
          date: w.date,
          loggedIn: false,
        };
        return date;
      }
    });
  }, [dates]);

  const checkDates = (day: number) => {
    return days.find((d) => {
      if (d.date === day) {
        return d;
      }
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: user.theme.cardColor }]}>
      <Title style={{ color: user.theme.fontColor }}>DAYS LOGGED IN</Title>

      <View style={styles.weekContainer}>
        {displayWeek.map((d, index) => {
          const loggedInDay = checkDates(d.date);
          return (
            <View key={index} style={[styles.dayCard]}>
              {loggedInDay?.loggedIn && (
                <IconButton
                  icon='star'
                  size={50}
                  color='yellow'
                  style={{ marginBottom: 13 }}
                />
              )}
              <Title
                style={[
                  { position: 'absolute' },
                  loggedInDay?.loggedIn
                    ? { color: user.theme.cardColor }
                    : { color: user.theme.fontColor },
                ]}
              >
                {d.name}
              </Title>
            </View>
          );
        })}
      </View>
      <Title style={{ color: user.theme.fontColor }}>
        LOGIN STREAK: {streak}
      </Title>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 185,
    borderRadius: 15,
    marginVertical: 15,
    marginHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  weekContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dayCard: {
    margin: 5,
    height: 35,
    aspectRatio: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoginGoal;
