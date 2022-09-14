import { View, StyleSheet, Dimensions } from 'react-native';
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
      <View style={[styles.header, { backgroundColor: theme.headerColor }]}>
        <Title style={[styles.title, { color: 'white' }]}>
          {theme.name.toUpperCase()}
        </Title>
      </View>

      <View style={[styles.card, { backgroundColor: theme.cardColor }]}>
        <View style={[styles.btn, { backgroundColor: theme.accentColor }]} />
      </View>
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
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'grey',
  },
  title: {
    width: '100%',
    zIndex: 20,
    textAlign: 'center',
  },
  header: {
    height: '10%',
    width: '100%',
    backgroundColor: 'black',
    position: 'absolute',
    top: 0,
    justifyContent: 'center',
  },
  tab: {
    height: '10%',
    width: '100%',
    bottom: 0,
    backgroundColor: 'black',
    position: 'absolute',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  btn: {
    width: '85%',
    height: '20%',
    backgroundColor: 'black',
    position: 'absolute',
    bottom: '10%',
    borderRadius: 10,
    zIndex: 20,
  },
  card: {
    width: '90%',
    height: '60%',
    backgroundColor: 'black',
    borderRadius: 10,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
});
export default React.memo(ThemeDisplay);
