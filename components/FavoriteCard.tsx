import { Pressable, StyleSheet, ImageBackground } from 'react-native';
import { Title, Text } from 'react-native-paper';
import React, { useContext } from 'react';
import fontColorContrast from 'font-color-contrast';
import swatchContext from '../contexts/swatchContext';

interface FavoriteCard {
  _id: string;
  name: string;
  color: string;
  favorite?: boolean;
  createdAt: string | Date;
  categoryRef?: string;
  design?: string;
}

interface Props {
  card: FavoriteCard;
  parentName?: string;
  onPress?: () => void;
  width?: number | string;
}

const FavoriteCard = ({ card, onPress, width, parentName }: Props) => {
  const _fontColor = fontColorContrast(card.color, 0.6);
  const { patterns } = useContext(swatchContext);

  return (
    <Pressable
      style={[
        styles.card,
        { backgroundColor: card.color, width: width, aspectRatio: 1.2 },
      ]}
      onPress={onPress}
      accessible
      accessibilityLabel={'favorite set: ' + card.name}
      accessibilityHint={'navigate to set: ' + card.name}
    >
      <Text style={{ color: _fontColor, zIndex: 100, fontSize: 18 }}>{parentName}</Text>
      <Title style={[styles.textContent, { color: _fontColor }]}>
        {card.name}
      </Title>
      {card.design && (
        <ImageBackground
          source={patterns[card.design]}
          style={styles.patternWrapper}
          imageStyle={styles.pattern}
        />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 125,
    width: 160,
    padding: 15,
    margin: 5,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  textContent: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    zIndex: 100,
  },
  cardCount: {
    position: 'absolute',
    color: 'white',
    top: 5,
    right: 10,
  },
  patternWrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 0,
    overflow: 'hidden',
    borderRadius: 8,
  },
  pattern: {
    height: '100%',
    width: '100%',
    tintColor: 'white',
    opacity: 0.35,
    resizeMode: 'contain',
  },
});
export default React.memo(FavoriteCard, (prevProps, nextProps) => {
  if (
    prevProps.card.name === nextProps.card.name &&
    prevProps.card.color === nextProps.card.color &&
    prevProps.card.design === nextProps.card.design &&
    prevProps.parentName === nextProps.parentName &&
    prevProps.card.favorite === nextProps.card.favorite
  )
    return true;
  return false;
});
