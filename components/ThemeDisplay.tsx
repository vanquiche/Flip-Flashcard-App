import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { Theme } from './types';
import { IconButton, Title } from 'react-native-paper';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');

interface Props {
  theme: Theme;
  style?: Object;
}

const ThemeDisplay = ({ theme, style }: Props) => {
  const exampleIcons = ['home', 'cards', 'cart', 'heart'];

  return (
    <View
      style={[styles.container, { backgroundColor: theme.bgColor, ...style }]}
      accessible
      accessibilityRole='image'
      accessibilityLabel={`${theme.name} theme`}
      accessibilityElementsHidden={true}
    >
      <Title style={[styles.title, { color: 'white' }]}>
        {theme.name.toUpperCase()}
      </Title>
      <View style={[styles.header, { backgroundColor: theme.headerColor }]} />
      <View style={[styles.card1, { backgroundColor: theme.accentColor }]} />
      <View style={[styles.card4, { backgroundColor: theme.cardColor }]}>
        <Title
          style={{
            textAlign: 'center',
            color: theme.fontColor,
            paddingTop: 60,
          }}
        >
          FLIP
        </Title>
      </View>
      <View style={[styles.card2, { backgroundColor: theme.cardColor }]} />
      <View style={[styles.card3, { backgroundColor: theme.cardColor }]} />
      <View style={[styles.tab, { backgroundColor: theme.tabColor }]}>
        {exampleIcons.map((icon, index) => (
          <IconButton
            icon={icon}
            key={icon}
            style={index === 1 ? { transform: [{ scale: 1.1 }] } : {}}
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
    borderColor: 'grey',
  },
  title: {
    position: 'absolute',
    width: '100%',
    zIndex: 20,
    top: 8,
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
    width: '80%',
    height: '12%',
    backgroundColor: 'black',
    position: 'absolute',
    top: '65%',
    left: '10%',
    borderRadius: 10,
    zIndex: 20,
  },
  card2: {
    width: '42%',
    height: '20%',
    backgroundColor: 'black',
    position: 'absolute',
    top: '18%',
    right: '6%',
    borderRadius: 10,
    zIndex: 20,
  },
  card3: {
    width: '42%',
    height: '20%',
    backgroundColor: 'black',
    position: 'absolute',
    top: '18%',
    left: '5%',
    borderRadius: 10,
  },
  card4: {
    width: '90%',
    height: '40%',
    backgroundColor: 'black',
    position: 'absolute',
    top: '42%',
    left: '5%',
    borderRadius: 10,
    zIndex: 10,
  },
});
export default React.memo(ThemeDisplay);
