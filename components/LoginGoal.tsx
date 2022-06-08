import { View, StyleSheet } from 'react-native';
import { Text, IconButton, useTheme, Title } from 'react-native-paper';
import React from 'react';

interface Props {
  dates: Date[];
}

const LoginGoal: React.FC<Props> = ({ dates }) => {
  // console.log(dates)
  const { colors } = useTheme();

  const displayWeek = [
    { name: 'S', date: 1 },
    { name: 'M', date: 2 },
    { name: 'T', date: 3 },
    { name: 'W', date: 4 },
    { name: 'T', date: 5 },
    { name: 'F', date: 6 },
    { name: 'S', date: 0 },
  ];

  // convert prop dates into day number i.e sunday === 0
  const convertDateToNumber = dates.map((date) => {
    const day = new Date(date).getDay();
    return day;
  });
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
            <Title style={{ position: 'absolute', color: colors.secondary }}>
              {d.name}
            </Title>
          </View>
        );
      })}
    </View>
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
