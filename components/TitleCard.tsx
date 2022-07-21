import { View, ImageBackground, Pressable, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import React, { useState, useContext } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  Layout,
  SlideInLeft,
  ZoomOut,
  withSpring,
} from 'react-native-reanimated';
import fontColorContrast from 'font-color-contrast';

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
  color?: string;
  card: Collection;
  multiSelect?: boolean;
  shouldAnimateEntry?: boolean;
  selectedForDeletion: boolean;
  onPress?: () => void;
  handleColor?: () => void;
  handleEdit: (card: any) => void;
  handleDelete: (docId: string) => void;
  markForDelete: (id: any, state: boolean) => void;
}

const TitleCard = ({
  card,
  multiSelect,
  shouldAnimateEntry,
  selectedForDeletion,
  onPress,
  handleEdit,
  handleDelete,
  markForDelete,
}: Props) => {
  const [showAlert, setShowAlert] = useState(false);
  const { patterns } = useContext(swatchContext);

  // ANIMATION VALUES
  const cardOpacity = useSharedValue(1);
  const cardScaleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(cardOpacity.value, undefined, () =>
        selectedForDeletion
          ? (cardOpacity.value = 0.5)
          : (cardOpacity.value = 1)
      ),
    };
  }, [selectedForDeletion]);

  // highlights and selects card for deletion
  const toggleSelection = () => {
    markForDelete(card._id, !selectedForDeletion);
  };

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
          {
            ...styles.card,
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
        {selectedForDeletion && (
          <IconButton
            icon='close-thick'
            size={42}
            color={'white'}
            style={{ position: 'absolute', zIndex: 100 }}
          />
        )}

        <Text
          style={[
            styles.textContent,
            { color: fontColorContrast(card.color, 0.7) },
          ]}
        >
          {card.name}
        </Text>
        <IconButton
          icon='close'
          color={fontColorContrast(card.color, 0.7)}
          size={17}
          style={styles.deleteBtn}
          onPress={() => setShowAlert(true)}
          disabled={multiSelect}
        />
        <IconButton
          icon='dots-horizontal'
          color={fontColorContrast(card.color, 0.7)}
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
          <IconButton
            icon='heart'
            color={fontColorContrast(card.color, 0.7)}
            style={styles.favicon}
          />
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
    prev.multiSelect === next.multiSelect &&
    prev.card?.design === next.card?.design &&
    prev.card?.favorite === next.card?.favorite &&
    prev.selectedForDeletion === next.selectedForDeletion
  )
    return true;
  return false;
});
