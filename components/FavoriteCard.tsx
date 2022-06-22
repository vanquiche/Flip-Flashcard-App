import { View, Pressable, StyleSheet, Alert } from 'react-native';
import { Text, useTheme, IconButton, Title } from 'react-native-paper';
import React, { useEffect, useState } from 'react';
import Animated, {
  Layout,
  SlideInLeft,
  ZoomOut,
} from 'react-native-reanimated';
import db from '../db-services';

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

const TitleCard: React.FC<Props> = React.memo(
  ({ card, onPress }) => {
    const [count, setCount] = useState(0);
    const { colors } = useTheme();

    useEffect(() => {
      db.find(
        { type: 'flashcard', setRef: card._id },
        (err: Error, docs: any) => {
          if (err) console.log(err);
          setCount(docs.length);
        }
      );
    }, [card._id]);

    return (
      <Pressable
        style={[styles.card, { backgroundColor: colors.primary }]}
        onPress={onPress}
      >
        <Title style={[styles.cardCount, { color: colors.secondary }]}>
          {count}
        </Title>
        <Title style={[styles.textContent, { color: colors.secondary }]}>
          {card.name}
        </Title>
      </Pressable>
    );
  },
  (prevProps, nextProps) => {
    if (
      prevProps.card.name === nextProps.card.name &&
      prevProps.card.color === nextProps.card.color &&
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
    fontSize: 16,
  },
  cardCount: {
    position: 'absolute',
    color: 'white',
    top: 5,
    right: 10,
  },
});
export default TitleCard;
