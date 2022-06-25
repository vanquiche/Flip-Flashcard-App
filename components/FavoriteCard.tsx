import { View, Pressable, StyleSheet, Alert } from 'react-native';
import { Text, useTheme, IconButton, Title } from 'react-native-paper';
import React, { useEffect, useState } from 'react';
import Animated, {
  Layout,
  SlideInLeft,
  ZoomOut,
} from 'react-native-reanimated';
import db from '../db-services';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Collection {
  _id: string;
  name: string;
  color: string;
  favorite?: boolean;
  createdAt: string | Date;
  categoryRef?: string;
}

interface Props {
  card: Collection;
  color?: string;
  onPress?: () => void;
}

const FavoriteCard: React.FC<Props> = React.memo(
  ({ card, onPress }) => {
    const { colors } = useTheme();
    // const {cards} = useSelector((state: RootState) => state.store)

    // const cardCount = cards.flashcard.filter(f => f.setRef === card._id)

    return (
      <Pressable
        style={[styles.card, { backgroundColor: colors.primary }]}
        onPress={onPress}
      >
        {/* <Title style={[styles.cardCount, { color: colors.secondary }]}>
          {cardCount.length}
        </Title> */}
        <Title style={[styles.textContent, { color: colors.secondary }]}>
          {card.name}
        </Title>
      </Pressable>
    );
  },
  (prevProps, nextProps) => {
    if (
      prevProps.card.name === nextProps.card.name &&
      prevProps.card?.favorite === nextProps.card?.favorite
    )
      return true;
    return false;
  }
);

const styles = StyleSheet.create({
  card: {
    justifyContent: 'center',
    // width: '45%',
    height: 125,
    aspectRatio: 1.3,
    padding: 15,
    margin: 5,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  textContent: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
  },
  cardCount: {
    position: 'absolute',
    color: 'white',
    top: 5,
    right: 10,
  },
});
export default FavoriteCard;
