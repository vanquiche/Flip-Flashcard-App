import {
  View,
  ImageBackground,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import React, { useState, useRef } from 'react';
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

import AlertDialog from './AlertDialog';

import Images from '../assets/patterns/images';
import Popup from './Popup';

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

const TitleCard: React.FC<Props> = ({
  card,
  multiSelect,
  handleEdit,
  handleDelete,
  onPress,
  markForDelete,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [checked, setChecked] = useState(false);

  // ANIMATION VALUES
  const cardOpacity = useSharedValue(1);
  const cardScaleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(cardOpacity.value),
    };
  });

  const { colors } = useTheme();
  const cardRef = useRef<View>(null);
  const popupX = useRef(0);
  const popupY = useRef(0);

  const handleLongPress = () => {
    setShowPopup(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const toggleCheck = () => {
    if (!checked) {
      cardOpacity.value = 0.5;
    } else {
      cardOpacity.value = 1;
    }
    setChecked((check) => !check);
    markForDelete(card._id, !checked);
  };

  const measureCard = () => {
    setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.measure((width, height, px, py, fx, fy) => {
          // const measurements = { width, height, px, py, fx, fy };
          // console.log(measurements)
          popupY.current = fy;
          popupX.current = fx;
        });
      }
    }, 550);
  };

  return (
    <>
      <AlertDialog
        message={`Are you sure you want to delete ${card.name}?`}
        visible={showAlert}
        onDismiss={() => setShowAlert(false)}
        onConfirm={() => handleDelete(card._id)}
      />

      <Popup
        layout={{ x: popupX.current, y: popupY.current }}
        visible={showPopup}
        dismiss={() => setShowPopup(false)}
        onEditPress={() => handleEdit(card)}
        onDeletePress={() => setShowAlert(true)}
      />

      <AnimatedPressable
        ref={cardRef}
        onLayout={measureCard}
        style={[
          styles.card,
          {
            backgroundColor: card.color,
          },
          cardScaleAnimatedStyle,
        ]}
        // disable navigation when canMark is true
        onPress={multiSelect ? toggleCheck : onPress}
        onLongPress={handleLongPress}
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
            source={Images[card.design] || null}
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
