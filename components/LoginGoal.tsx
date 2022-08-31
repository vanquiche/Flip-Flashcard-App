import { View, StyleSheet } from 'react-native';
import { Title, Text } from 'react-native-paper';
import React, { useContext, useMemo } from 'react';
import { DateTime, WeekdayNumbers } from 'luxon';
import { AntDesign } from '@expo/vector-icons';
import swatchContext from '../contexts/swatchContext';

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
  const { theme } = useContext(swatchContext);
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

  const getDateName = (dayNumber: number) => {
    switch (dayNumber) {
      case 1:
        return 'monday';
      case 2:
        return 'tuesday';
      case 3:
        return 'wednsday';
      case 4:
        return 'thursday';
      case 5:
        return 'friday';
      case 6:
        return 'saturday';
      case 7:
        return 'sunday';
      default:
        return undefined;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.cardColor }]}>
      <Title
        style={{ color: theme.fontColor }}
        accessible={true}
        accessibilityRole='text'
        accessibilityLabel='days logged in'
      >
        DAYS LOGGED IN
      </Title>

      <View style={styles.weekContainer}>
        {displayWeek.map((d, index) => {
          const loggedInDay = checkDates(d.date);
          const dateName = getDateName(d.date);
          return (
            <View
              key={index}
              style={[styles.dayCard]}
              accessible
              accessibilityRole='text'
              accessibilityLabel={
                loggedInDay?.loggedIn ? `logged in ${dateName}` : dateName
              }
            >
              <Text
                style={[
                  {
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    zIndex: 30,
                  },
                  loggedInDay?.loggedIn
                    ? { color: theme.cardColor }
                    : { color: theme.fontColor },
                ]}
              >
                {d.name}
              </Text>
              {loggedInDay?.loggedIn && (
                <View style={{ position: 'absolute', top: -3, right: 1, zIndex: 10 }}>
                  <AntDesign name='star' size={38} color='yellow' />
                </View>
              )}
            </View>
          );
        })}
      </View>
      <Title
        style={{ color: theme.fontColor }}
        accessible={true}
        accessibilityRole='text'
        accessibilityLabel={`login streak ${streak}`}
      >
        LOGIN STREAK: {streak}
      </Title>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 150,
    height: '30%',
    borderRadius: 15,
    marginVertical: 10,
    marginHorizontal: 15,
    marginBottom: 0,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    overflow: 'visible'
  },
  weekContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  dayCard: {
    margin: 5,
    // height: 35,
    // aspectRatio: 1,
    // position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'column',
    // borderWidth: 2,
  },
});

export default React.memo(LoginGoal, (prev, next) => {
  if (prev.dates[prev.dates.length - 1] === next.dates[next.dates.length - 1])
    return true;
  return false;
});
