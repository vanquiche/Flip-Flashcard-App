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
import { AntDesign } from '@expo/vector-icons';

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
  disableActions?: boolean;
}

const TitleCard = ({
  card,
  multiSelect,
  shouldAnimateEntry,
  selectedForDeletion,
  disableActions,
  onPress,
  handleEdit,
  handleDelete,
  markForDelete,
}: Props) => {
  const [showAlert, setShowAlert] = useState(false);
  const { patterns } = useContext(swatchContext);

  const _fontColor = fontColorContrast(card.color, 0.6);

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
        onPress={
          multiSelect ? toggleSelection : disableActions ? null : onPress
        }
        exiting={ZoomOut}
        entering={
          shouldAnimateEntry ? SlideInLeft.delay(200).duration(350) : undefined
        }
        layout={Layout.springify().damping(15).delay(200)}
        accessible
        accessibilityRole='button'
        accessibilityLabel={`card for ${card.name}`}
        accessibilityHint={`navigate to: ${card.name} cardset`}
        accessibilityActions={
          multiSelect
            ? undefined
            : [
                { name: 'delete', label: 'delete card' },
                { name: 'edit', label: 'edit card' },
              ]
        }
        onAccessibilityAction={(e) => {
          switch (e.nativeEvent.actionName) {
            case 'delete':
              setShowAlert(true);
              break;
            case 'edit':
              handleEdit(card);
              break;
          }
        }}
      >
        {/* indicator of card selection */}
        {selectedForDeletion && (
          <IconButton
            icon='close-thick'
            size={42}
            color={'white'}
            style={{ position: 'absolute', zIndex: 100 }}
            accessible
            accessibilityRole='image'
            accessibilityLabel='selected for deletion'
          />
        )}

        <Text
          style={[styles.textContent, { color: _fontColor }]}
          accessible
          accessibilityRole='text'
        >
          {card.name}
        </Text>
        <IconButton
          icon='close'
          color={_fontColor}
          size={20}
          style={styles.deleteBtn}
          onPress={() => setShowAlert(true)}
          disabled={disableActions}
          // accessible
          // accessibilityRole='imagebutton'
          // accessibilityLabel='delete card'
          // accessibilityHint='open modal to confirm delete'
          // accessibilityState={{ disabled: disableActions }}
        />
        <IconButton
          icon='dots-horizontal'
          color={_fontColor}
          size={25}
          style={styles.editBtn}
          onPress={() => handleEdit(card)}
          disabled={disableActions}
          // accessible
          // accessibilityRole='imagebutton'
          // accessibilityLabel='edit card'
          // accessibilityHint='open modal to edit card'
          // accessibilityState={{ disabled: disableActions }}
        />
        {card.design && card.design !== 'default' && (
          <ImageBackground
            source={patterns[card.design]}
            imageStyle={styles.pattern}
            style={styles.patternWrapper}
          />
        )}
        {card.favorite && (
          <AntDesign
            name='heart'
            size={20}
            color={_fontColor}
            style={styles.favicon}
            accessible
            accessibilityRole='imagebutton'
            accessibilityLabel='favorite'
            accessibilityHint='toggle favorite'
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
    width: 200,
    // aspectRatio: 1 / 1.2,
    // minHeight: 135,
    height: 150,
    padding: 15,
    // margin: 5,
    borderRadius: 12,
    backgroundColor: 'white',
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
    // height: 125,
    height: '100%',
    width: '100%',
    tintColor: 'white',
    opacity: 0.35,
    resizeMode: 'contain',
  },
  favicon: {
    position: 'absolute',
    top: 10,
    left: 10,
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
    prev.disableActions === next.disableActions &&
    prev.selectedForDeletion === next.selectedForDeletion
  )
    return true;
  return false;
});
