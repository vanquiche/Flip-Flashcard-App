import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { IconButton, Text, TextInput, Title, useTheme } from 'react-native-paper';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
  LightSpeedInLeft,
  LightSpeedInRight,
  LightSpeedOutLeft,
  RollInRight,
  RollOutLeft,
  SlideInLeft,
  SlideOutLeft,
  SlideInRight,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { Flashcard } from './types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const FRONT_CARD_POSITION_DEFAULT = 0;
const BACK_CARD_POSITION_DEFAULT = 180;

interface PropTypes {
  card: Flashcard;
  color?: string;
  canFlip: boolean;
  next?: boolean;
  slideRemaining?: boolean;
  showSolution?: boolean;
  nextCard?: () => void;
}

const Card: React.FC<PropTypes> = ({
  card,
  next,
  color,
  canFlip,
  nextCard,
  showSolution,
  slideRemaining,
}) => {
  const [cardFacingFront, setCardFacingFront] = useState(true);

  const {colors} = useTheme()

  const cardFlip = useSharedValue(0);
  const frontCardPosition = useSharedValue(FRONT_CARD_POSITION_DEFAULT);
  const backCardPosition = useSharedValue(BACK_CARD_POSITION_DEFAULT);

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

  useEffect(() => {
    if (showSolution)
      setTimeout(() => {
        flipCard();
      }, 250);
    else return;
  }, [showSolution]);

  return (
    // CARD CONTAINER
    <Animated.View
      style={[styles.container, styles.shadow]}
      entering={SlideInRight.delay(250)}
      exiting={SlideOutLeft}
    >
      <Animated.View
        style={[
          styles.card,
          { backgroundColor: color },
          rStyles_card_container,
        ]}
      >
        {/* front of card - prompt */}
        <Animated.View style={[styles.textContainer, rStyles_card_front]}>
          <Title style={styles.cardTitle}>PROMPT</Title>
          <Text style={styles.text}>{card.prompt}</Text>
        </Animated.View>

        {/* back of card - solution */}
        <Animated.View style={[styles.textContainer, rStyles_card_back]}>
          <Text style={[styles.text, styles.cardBackText]}>
            {card.solution}
          </Text>
          <Title style={[styles.cardBackText, styles.cardTitle]}>
            SOLUTION
          </Title>
        </Animated.View>
      </Animated.View>

      <IconButton
        style={[styles.button, { bottom: 20 }]}
        icon='sync'
        color='white'
        onPress={flipCard}
        disabled={!canFlip}
      />
      {!slideRemaining && (
        <IconButton
          style={[styles.button, { right: -20 }]}
          icon='arrow-right-thick'
          color={colors.secondary}
          size={26}
          onPress={nextCard}
          disabled={!next}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: SCREEN_WIDTH - 50,
    height: 225,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'tomato',
    width: '85%',
    // height: 185,
    aspectRatio: 1 / 0.7,
    paddingVertical: 20,
    borderRadius: 15,
    justifyContent: 'center',
    zIndex: 20,
  },
  cardBackText: {
    transform: [{ scaleY: -1 }],
  },
  textContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    // margin: 15,
    color: 'white',
    backfaceVisibility: 'hidden',
  },
  cardTitle: {
    color: 'white',
  },

  button: {
    position: 'absolute',
    // padding: 20,
    // borderBottomRightRadius: 15,
    alignSelf: 'center',
    zIndex: 100,
  },
  shadow: {
    // shadowColor: 'black',
    // shadowOffset: { width: 2, height: 10 },
    // shadowOpacity: 0.15,
    // shadowRadius: 5,
  },
});

export default Card;
