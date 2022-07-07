import { View, ImageBackground, Pressable, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import React, {
  useState,
  useRef,
  useContext,
  useCallback,

} from 'react';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Layout,
  SlideInLeft,
  ZoomOut,
  withSpring,
} from 'react-native-reanimated';
import { useIsFocused } from '@react-navigation/native';

import AlertDialog from './AlertDialog';

import Popup from './Popup';
import swatchContext from '../contexts/swatchContext';
import { useFocusEffect } from '@react-navigation/native';

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
}

const TitleCard = ({
  card,
  multiSelect,
  handleEdit,
  handleDelete,
  onPress,
  markForDelete,
}: Props) => {
  const [showPopup, setShowPopup] = useState(false);
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

  // popup tooltip position coordinates
  const cardRef = useRef<View>(null);
  const popupX = useRef(0);
  const popupY = useRef(0);

  const showTooltip = () => {
    setShowPopup(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  // highlights and selects card for deletion
  const toggleSelection = () => {
    if (!checked) {
      cardOpacity.value = 0.5;
    } else {
      cardOpacity.value = 1;
    }
    setChecked((check) => !check);
    markForDelete(card._id, !checked);
  };

  // determine where to position tooltip
  const measureCardPosition = (delay: number) => {
    setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.measure((width, height, px, py, fx, fy) => {
          popupY.current = fy;
          popupX.current = fx;
        });
      }
    }, delay);
  };

  // remeasure when screen is focused
  // used when user presses on shortcut
  // to favorite set. Sets and Categories screen
  // gets mounted and measurement is incorrect
  // requiring remeasure on-focus
  useFocusEffect(
    useCallback(() => {
      measureCardPosition(150);
    }, [])
  );

  return (
    <>
      <AlertDialog
        message={`Are you sure you want to delete ${card.name}?`}
        visible={showAlert}
        onDismiss={() => setShowAlert(false)}
        onConfirm={() => handleDelete(card._id)}
      />

      <Popup
        layout={{x: popupX.current, y: popupY.current}}
        visible={showPopup}
        dismiss={() => setShowPopup(false)}
        onEditPress={() => handleEdit(card)}
        onDeletePress={() => setShowAlert(true)}
      />

      <AnimatedPressable
        key={card._id}
        ref={cardRef}
        onLayout={() => measureCardPosition(550)}
        style={[
          styles.card,
          {
            backgroundColor: card.color,
          },
          cardScaleAnimatedStyle,
        ]}
        // disable navigation when canMark is true
        onPress={multiSelect ? toggleSelection : onPress}
        onLongPress={showTooltip}
        exiting={ZoomOut}
        entering={SlideInLeft.delay(200).duration(350)}
        layout={Layout.springify().damping(15).delay(200)}
      >
        {/* indicator of card selection */}
        {multiSelect && (
          <IconButton
            icon='close-thick'
            color={checked ? 'white' : 'transparent'}
            style={{ position: 'absolute', right: 0, top: 0 }}
          />
        )}

        <Text style={[styles.textContent, { backgroundColor: card.color }]}>
          {card.name}
        </Text>
        {card.design && (
          <ImageBackground
            source={patterns[card.design] || null}
            imageStyle={styles.pattern}
            style={styles.patternWrapper}
            resizeMode='cover'
          />
        )}
        {card.favorite && (
          <IconButton icon='star' color='yellow' style={styles.favicon} />
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
    // aspectRatio: 1.45,
    padding: 15,
    margin: 5,
    borderRadius: 12,
    backgroundColor: 'white',
    // position: 'relative',
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
    zIndex: 100,
    // width: '80%',
  },
  popup: {
    display: 'flex',
    flexDirection: 'row',
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
