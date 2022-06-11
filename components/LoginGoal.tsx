import { View, StyleSheet } from 'react-native';
import { Text, IconButton, useTheme, Title } from 'react-native-paper';
import React, { useContext } from 'react';
import { UserContext } from '../context/userContext';
import AlertNotification from './AlertNotification';

interface Props {
  dates: Date[];
  streak: number;
  notify: boolean;
  onDismiss: () => void;
}

const LoginGoal: React.FC<Props> = ({ dates, streak, notify, onDismiss }) => {
  // console.log(dates)
  const { user, userDispatch } = useContext(UserContext);
  const { colors } = useTheme();
  // console.log(user.login.notify)

  const displayWeek = [
    { name: 'S', date: 0 },
    { name: 'M', date: 1 },
    { name: 'T', date: 2 },
    { name: 'W', date: 3 },
    { name: 'T', date: 4 },
    { name: 'F', date: 5 },
    { name: 'S', date: 6 },
  ];

  // console.log(user.login.notify)

  // const closeAlert = () => {
  //   userDispatch({ type: 'set login', payload: { login: { notify: false } } });
  //   console.log(user.login.notify)
  // };

  // convert prop dates into day number i.e sunday === 0
  const convertDateToNumber = dates.map((date) => {
    const day = new Date(date).getDay();
    return day;
  });

  // console.log(convertDateToNumber)
  // create an object corresponding for each day of the week
  const days = displayWeek.map((w) => {
    const exist = convertDateToNumber.includes(w.date);
    // console.log(exist)
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

  // console.log(days);
  const compareDate = (day: number) => {
    return days.find((d) => {
      if (d.date === day) {
        return d;
      }
    });
  };

  return (
    <>
      <AlertNotification
        visible={user.login.notify}
        dismiss={onDismiss}
        message='YOU EARNED 50 POINTS FOR LOGGING IN CONSECUTIVELY'
      />
      <View
        style={{
          backgroundColor: colors.primary,
          marginHorizontal: 15,
          marginVertical: 15,
          height: 185,
          justifyContent: 'space-evenly',
          alignItems: 'center',
          borderRadius: 15,
        }}
      >
        <Title style={{ color: colors.secondary }}>LOGIN GOAL</Title>
        <View style={styles.container}>
          {displayWeek.map((d, index) => {
            const day = compareDate(d.date);
            return (
              <View key={index} style={[styles.dayCard]}>
                {day?.loggedIn && (
                  <IconButton
                    icon='star'
                    size={50}
                    color='yellow'
                    style={{ marginBottom: 13 }}
                  />
                )}
                <Title
                  style={{ position: 'absolute', color: colors.secondary }}
                >
                  {d.name}
                </Title>
              </View>
            );
          })}
        </View>
        <Title style={{ color: colors.secondary }}>
          LOGIN STREAK: {streak}
        </Title>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  dayCard: {
    height: 35,
    margin: 5,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
});
export default LoginGoal;
