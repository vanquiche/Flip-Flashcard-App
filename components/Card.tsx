import {
  View,
  Pressable,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { Text, useTheme, Title } from 'react-native-paper';
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
import { IconButton } from 'react-native-paper';

import { Flashcard } from './types';

import AlertDialog from './AlertDialog';

import Popup from './Popup';
import { transform } from '@babel/core';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');
const FRONT_CARD_POSITION_DEFAULT = 0;
const BACK_CARD_POSITION_DEFAULT = 180;

interface Props {
  card: Flashcard;
  color?: string;
  pattern?: any;
  patternList: Record<string, any>;
  multiSelect: boolean;
  handleEdit: (card: Flashcard, id: string) => void;
  handleDelete: (docId: string) => void;
  handleColor?: () => void;
  onPress?: () => void;
  markForDelete: (id: any, state: boolean) => void;
}

const Card = ({
  card,
  color,
  pattern,
  patternList,
  handleEdit,
  handleDelete,
  multiSelect,
  markForDelete,
}: Props) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [cardFacingFront, setCardFacingFront] = useState(true);
  const [checked, setChecked] = useState(false);

  const cardRef = useRef<View>(null);
  // popup tooltip coordinates
  const popupX = useRef(0);
  const popupY = useRef(0);

  // animation values for card flip
  const cardFlip = useSharedValue(0);
  const frontCardPosition = useSharedValue(FRONT_CARD_POSITION_DEFAULT);
  const backCardPosition = useSharedValue(BACK_CARD_POSITION_DEFAULT);
  const cardOpacity = useSharedValue(1);
  const cardOpacityAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(cardOpacity.value),
    };
  });

  const rStyles_card_container = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: SCREEN_HEIGHT },
        { rotateX: cardFlip.value + 'deg' },
      ],
    };
  });

  const rStyles_card_back = useAnimatedStyle(() => {
    return {
      transform: [{ rotateX: backCardPosition.value + 'deg' }],
    };
  });

  const rStyles_card_front = useAnimatedStyle(() => {
    return {
      transform: [{ rotateX: frontCardPosition.value + 'deg' }],
    };
  });

  const flipCard = () => {
    if (cardFacingFront === true) {
      cardFlip.value = withSpring(180, { damping: 20 });
      frontCardPosition.value = withTiming(180);
      backCardPosition.value = withTiming(0);
    } else {
      cardFlip.value = withSpring(0, { damping: 20 });
      frontCardPosition.value = withTiming(FRONT_CARD_POSITION_DEFAULT);
      backCardPosition.value = withTiming(BACK_CARD_POSITION_DEFAULT);
    }
    setCardFacingFront((prev) => !prev);
  };

  const handleLongPress = () => {
    // console.log('long press')
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
    // wait for entering animation to end before measuring card
    setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.measure((width, height, px, py, fx, fy) => {
          popupY.current = fy + 25;
          popupX.current = fx + 40;
        });
      }
    }, 600);
  };

  return (
    <>
      <AlertDialog
        message={`Are you sure you want to delete this card?`}
        visible={showAlert}
        onDismiss={() => setShowAlert(false)}
        onConfirm={() => handleDelete(card._id)}
      />

      <Popup
        visible={showPopup}
        dismiss={() => setShowPopup(false)}
        onEditPress={() => handleEdit(card, card._id)}
        onDeletePress={() => setShowAlert(true)}
        popoverStyle={{ transform: [{ translateY: 80 }] }}
      />

      {/* Card */}
      <AnimatedPressable
        style={[
          styles.card,
          { backgroundColor: color },
          rStyles_card_container,
          cardOpacityAnimatedStyle,
        ]}
        // onPress={onPress}
        onPress={multiSelect ? toggleCheck : flipCard}
        onLongPress={handleLongPress}
        exiting={ZoomOut}
        entering={SlideInLeft.delay(300)}
        layout={Layout.springify().damping(15).delay(200)}
        onLayout={measureCard}
        ref={cardRef}
      >
        {/* indicator of card selection */}
        {multiSelect && (
          <IconButton
            icon='close-thick'
            color={checked ? 'white' : 'transparent'}
            style={{ position: 'absolute', right: 0, top: 0 }}
          />
        )}
        {/* FRONT OF CARD */}
        <Animated.View style={[styles.textContainer, rStyles_card_front]}>
          {/* CARD DESIGN */}
          <ImageBackground
            resizeMode='repeat'
            imageStyle={[styles.image]}
            style={styles.cardPattern}
            source={patternList[pattern]}
          />

          <Title style={[styles.cardTitle, { top: 0, left: 5 }]}>Q .</Title>
          <View style={[styles.textBG, { backgroundColor: color }]}>
            <Text style={[styles.textContent]} numberOfLines={3}>
              {card.prompt}
            </Text>
          </View>
        </Animated.View>

        {/* BACK OF CARD */}
        <Animated.View style={[styles.textContainer, rStyles_card_back]}>
          <Text style={[styles.textContent, styles.cardBackText]}>
            {card.solution}
          </Text>
          <Title
            style={[
              styles.cardBackText,
              styles.cardTitle,
              { bottom: 0, left: 5 },
            ]}
          >
            A .
          </Title>
        </Animated.View>
      </AnimatedPressable>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 256,
    height: 190,
    // aspectRatio: 1.35,
    padding: 15,
    marginVertical: 12,
    borderRadius: 15,
    backgroundColor: 'white',
    flex: 1,
    // position: 'relative'
    overflow: 'hidden',
  },
  textContent: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    // marginVertical: 10,
    backfaceVisibility: 'hidden',
    lineHeight: 30,
  },
  textContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    // padding: 20,
  },
  cardBackText: {
    transform: [{ scaleY: -1 }],
  },
  textBG: {
    borderRadius: 10,
    padding: 5,
    paddingTop: 7,
  },
  cardTitle: {
    color: 'white',
    position: 'absolute',
    fontSize: 26,
  },

  popup: {
    display: 'flex',
    flexDirection: 'row',
  },
  cardPattern: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  image: {
    tintColor: 'white',
    opacity: 0.3,
    borderRadius: 10,
  },
});
export default React.memo(Card, (prevProps, nextProps) => {
  if (
    prevProps.card.prompt === nextProps.card.prompt &&
    prevProps.card.solution === nextProps.card.solution &&
    prevProps.multiSelect === nextProps.multiSelect
  )
    return true;
  return false;
});
