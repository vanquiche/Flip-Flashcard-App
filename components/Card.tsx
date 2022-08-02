import {
  View,
  Pressable,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { Text, Title } from 'react-native-paper';
import React, { useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Layout,
  SlideInLeft,
  ZoomOut,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';
import fontColorContrast from 'font-color-contrast';
import { IconButton } from 'react-native-paper';

import { Flashcard } from './types';

import AlertDialog from './AlertDialog';

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
  selectedForDeletion: boolean;
  shouldAnimateEntry?: boolean;
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
  multiSelect,
  shouldAnimateEntry,
  selectedForDeletion,
  handleEdit,
  handleDelete,
  markForDelete,
}: Props) => {
  const [showAlert, setShowAlert] = useState(false);
  const [cardFacingFront, setCardFacingFront] = useState(true);

  const _fontColor = color ? fontColorContrast(color, 0.6) : 'white';

  // animation values for card flip
  const cardFlip = useSharedValue(0);
  const frontCardPosition = useSharedValue(FRONT_CARD_POSITION_DEFAULT);
  const backCardPosition = useSharedValue(BACK_CARD_POSITION_DEFAULT);
  const cardOpacity = useSharedValue(1);
  const cardOpacityAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(cardOpacity.value, undefined, () =>
        selectedForDeletion
          ? (cardOpacity.value = 0.5)
          : (cardOpacity.value = 1)
      ),
    };
  }, [selectedForDeletion]);

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

  const toggleSelection = () => {
    markForDelete(card._id, !selectedForDeletion);
  };

  return (
    <>
      <AlertDialog
        message='Are you sure you want to delete this card?'
        visible={showAlert}
        onDismiss={() => setShowAlert(false)}
        onConfirm={() => handleDelete(card._id)}
      />

      {/* Card */}
      <AnimatedPressable
        style={[
          {
            ...styles.card,
            backgroundColor: color,
          },
          rStyles_card_container,
          cardOpacityAnimatedStyle,
        ]}
        // onPress={onPress}
        onPress={multiSelect ? toggleSelection : flipCard}
        exiting={ZoomOut}
        entering={shouldAnimateEntry ? SlideInLeft.delay(300) : undefined}
        layout={Layout.springify().damping(15).delay(200)}
      >
        {/* indicator of card selection */}
        {multiSelect && (
          <IconButton
            icon='close-thick'
            size={58}
            color={selectedForDeletion ? 'white' : 'transparent'}
            style={{ position: 'absolute', left: '35%', zIndex: 80 }}
          />
        )}
        {cardFacingFront && (
          <Animated.View style={styles.btnContainer} entering={FadeIn}>
            <IconButton
              icon='close'
              color={_fontColor}
              size={25}
              style={[styles.deleteBtn]}
              onPress={() => setShowAlert(true)}
              disabled={multiSelect}
            />
            <IconButton
              icon='dots-horizontal'
              color={_fontColor}
              size={25}
              style={[styles.editBtn]}
              onPress={() => handleEdit(card, card._id)}
              disabled={multiSelect}
            />
          </Animated.View>
        )}

        {/* FRONT OF CARD */}
        <Animated.View style={[styles.textContainer, rStyles_card_front]}>
          {/* CARD DESIGN */}

          <Title
            style={{
              ...styles.cardTitle,
              top: 0,
              left: 5,
              color: _fontColor,
            }}
          >
            Q .
          </Title>
          <Text
            style={{
              ...styles.textContent,
              color: _fontColor,
            }}
            numberOfLines={3}
          >
            {card.prompt}
          </Text>
          <ImageBackground
            style={styles.cardPattern}
            imageStyle={styles.image}
            source={patternList[pattern]}
            resizeMode='cover'
          />
        </Animated.View>

        {/* BACK OF CARD */}
        <Animated.View style={[styles.textContainer, rStyles_card_back]}>
          <Text
            style={{
              ...styles.textContent,
              ...styles.cardBackText,
              color: _fontColor,
            }}
          >
            {card.solution}
          </Text>
          <Title
            style={[
              styles.cardBackText,
              styles.cardTitle,
              {
                bottom: 0,
                left: 5,
                color: _fontColor,
              },
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
  btnContainer: {
    width: '100%',
    height: '100%',
    zIndex: 70,
  },
  deleteBtn: {
    position: 'absolute',
    top: -10,
    right: -10,
    zIndex: 80,
  },
  editBtn: {
    position: 'absolute',
    bottom: -10,
    left: '40%',
    zIndex: 80,
  },
  textContent: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    // marginVertical: 10,
    backfaceVisibility: 'hidden',
    lineHeight: 30,
    zIndex: 50,
  },
  textContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
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
    zIndex: 50,
  },

  popup: {
    display: 'flex',
    flexDirection: 'row',
  },
  cardPattern: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 10,
  },
  image: {
    tintColor: 'white',
    height: 160,
    width: 226,
    opacity: 0.25,
    borderRadius: 10
  },
});
export default React.memo(Card, (prev, next) => {
  if (
    prev.card.prompt === next.card.prompt &&
    prev.card.solution === next.card.solution &&
    prev.multiSelect === next.multiSelect &&
    prev.selectedForDeletion === next.selectedForDeletion
  )
    return true;
  return false;
});
