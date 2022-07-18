import { View, ImageBackground, Pressable, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import React, {
  useState,
  useContext,
  useEffect,
} from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  Layout,
  SlideInLeft,
  ZoomOut,
  withSpring,
} from 'react-native-reanimated';

import AlertDialog from './AlertDialog';
import swatchContext from '../contexts/swatchContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Collection {
  _id: string;
  name: string;
  color: string;
  favorite?: boolean;
  design?: string;
  createdAt: Date | string;
  categoryRef?: string;
}

interface Props {
  card: Collection;
  color?: string;
  multiSelect?: boolean;
  handleEdit: (card: any) => void;
  handleDelete: (docId: string) => void;
  handleColor?: () => void;
  onPress?: () => void;
  markForDelete: (id: any, state: boolean) => void;
  shouldAnimateEntry?: boolean;
}

const TitleCard = ({
  card,
  multiSelect,
  handleEdit,
  handleDelete,
  onPress,
  markForDelete,
  shouldAnimateEntry,
}: Props) => {
  const [showAlert, setShowAlert] = useState(false);
  const [checked, setChecked] = useState(false);

  const { patterns } = useContext(swatchContext);

  // ANIMATION VALUES
  const cardOpacity = useSharedValue(1);
  const cardScaleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(cardOpacity.value),
    };
  });

  const fadeCard = () => {
    if (!checked) {
      cardOpacity.value = 0.5;
    } else {
      cardOpacity.value = 1;
    }
  };

  // highlights and selects card for deletion
  const toggleSelection = () => {
    fadeCard();
    setChecked((check) => !check);
    markForDelete(card._id, !checked);
  };

  useEffect(() => {
    return () => {
      cardOpacity.value = 1;
      setChecked(false);
    };
  }, [multiSelect]);

  return (
    <>
      <AlertDialog
        message={`Are you sure you want to delete ${card.name}?`}
        visible={showAlert}
        onDismiss={() => setShowAlert(false)}
        onConfirm={() => handleDelete(card._id)}
      />

      <AnimatedPressable
        key={card._id}
        style={[
          styles.card,
          {
            backgroundColor: card.color,
          },
          cardScaleAnimatedStyle,
        ]}
        // disable navigation when canMark is true
        onPress={multiSelect ? toggleSelection : onPress}
        exiting={ZoomOut}
        entering={
          shouldAnimateEntry ? SlideInLeft.delay(200).duration(350) : undefined
        }
        layout={Layout.springify().damping(15).delay(200)}
      >
        {/* indicator of card selection */}
        {multiSelect && (
          <IconButton
            icon='close-thick'
            size={42}
            color={checked ? 'white' : 'transparent'}
            style={{ position: 'absolute', zIndex: 100 }}
          />
        )}

        <Text style={[styles.textContent, { backgroundColor: card.color }]}>
          {card.name}
        </Text>
        <IconButton
          icon='close'
          color='white'
          size={17}
          style={styles.deleteBtn}
          onPress={() => setShowAlert(true)}
          disabled={multiSelect}
        />
        <IconButton
          icon='dots-horizontal'
          color='white'
          size={20}
          style={styles.editBtn}
          onPress={() => handleEdit(card)}
          disabled={multiSelect}
        />
        {card.design && card.design !== 'default' && (
          <ImageBackground
            source={patterns[card.design]}
            imageStyle={styles.pattern}
            style={styles.patternWrapper}
            resizeMode='cover'
          />
        )}
        {card.favorite && (
          <IconButton icon='heart' color='white' style={styles.favicon} />
        )}
      </AnimatedPressable>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '45%',
    height: 125,
    padding: 15,
    margin: 5,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  patternWrapper: {
    position: 'absolute',
    top: 12,
    left: 10,
    right: 10,
    bottom: 12,
    zIndex: 0,
  },
  pattern: {
    height: 100,
    aspectRatio: 1.45,
    tintColor: 'white',
    borderRadius: 8,
    opacity: 0.3,
  },
  favicon: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  textContent: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    zIndex: 80,
    // width: '80%',
  },
  popup: {
    display: 'flex',
    flexDirection: 'row',
  },
  deleteBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 80,
  },
  editBtn: {
    position: 'absolute',
    bottom: 0,
    zIndex: 80,
    // right: 0,
  },
});

export default React.memo(TitleCard, (prev, next) => {
  if (
    prev.card.name === next.card.name &&
    prev.card.color === next.card.color &&
    prev.card?.design === next.card?.design &&
    prev.card?.favorite === next.card?.favorite &&
    prev.multiSelect === next.multiSelect
  )
    return true;
  return false;
});
