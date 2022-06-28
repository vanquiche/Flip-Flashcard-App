import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import React from 'react';
import { Theme } from './types';
import { IconButton, Title } from 'react-native-paper';
import { onChange } from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');

interface Props {
  theme: Theme;
}

const ThemeDisplay: React.FC<Props> = ({ theme }) => {
  const icons = ['home', 'card', 'cart', 'heart'];

  return (
    <View style={[styles.container, { backgroundColor: theme.bgColor }]}>
      <Title style={[styles.title, { color: theme.fontColor }]}>
        {theme.name.toUpperCase()}
      </Title>
      <View style={[styles.header, { backgroundColor: theme.headerColor }]} />
      <View style={[styles.card1, { backgroundColor: theme.cardColor }]} />
      <View style={[styles.card2, { backgroundColor: theme.cardColor }]} />
      <View style={[styles.card3, { backgroundColor: theme.cardColor }]} />
      <View style={[styles.card4, { backgroundColor: theme.cardColor }]} />
      <View style={[styles.tab, { backgroundColor: theme.tabColor }]}>
        {icons.map((icon, index) => (
          <IconButton
            icon={icon}
            key={icon}
            style={index === 1 ? {transform: [{translateY: -5}]} : {}}
            size={18}
            color={index === 1 ? theme.actionIconColor : theme.iconColor}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_HEIGHT * 0.6,
    backgroundColor: 'lightblue',
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'grey'
    // marginHorizontal: SCREEN_WIDTH * 0.25
  },
  title: {
    position: 'absolute',
    width: '100%',
    zIndex: 20,
    // left: '25%',
    top: 8,
    // borderWidth: 2,
    textAlign: 'center',
  },
  header: {
    height: '12%',
    width: '100%',
    backgroundColor: 'black',
    position: 'absolute',
    top: 0,
  },
  tab: {
    height: '12%',
    width: '100%',
    bottom: 0,
    backgroundColor: 'black',
    position: 'absolute',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  card1: {
    width: '43%',
    height: '20%',
    backgroundColor: 'black',
    position: 'absolute',
    top: '40%',
    left: '5%',
    borderRadius: 10,
  },
  card2: {
    width: '43%',
    height: '20%',
    backgroundColor: 'black',
    position: 'absolute',
    top: '40%',
    right: '5%',
    borderRadius: 10,
  },
  card3: {
    width: '90%',
    height: '20%',
    backgroundColor: 'black',
    position: 'absolute',
    top: '17%',
    left: '5%',
    borderRadius: 10,
  },
  card4: {
    width: '90%',
    height: '20%',
    backgroundColor: 'black',
    position: 'absolute',
    top: '63%',
    left: '5%',
    borderRadius: 10,
  },
});
export default React.memo(ThemeDisplay);
