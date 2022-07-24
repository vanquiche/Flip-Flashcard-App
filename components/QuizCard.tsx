import { View, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Text,
  TextInput,
  Title,
  useTheme,
} from 'react-native-paper';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  SlideOutLeft,
  SlideInRight,
  FadeInUp,
  FadeInDown,
} from 'react-native-reanimated';
import fontColorContrast from 'font-color-contrast';

import { Flashcard } from './types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const FRONT_CARD_POSITION_DEFAULT = 0;
const BACK_CARD_POSITION_DEFAULT = 180;

interface Props {
  card: Flashcard;
  color: string;
  pattern: string;
  patternList: Record<string, any>;
  canFlip: boolean;
  next?: boolean;
  slideRemaining?: boolean;
  showSolution?: boolean;
  nextCard?: () => void;
  result?: boolean;
}

const Card = ({
  card,
  next,
  color,
  pattern,
  patternList,
  result,
  canFlip,
  nextCard,
  showSolution,
  slideRemaining,
}: Props) => {
  const [cardFacingFront, setCardFacingFront] = useState(true);

  const { colors } = useTheme();
  const _fontColor = fontColorContrast(color, 0.7);

  const cardFlip = useSharedValue(0);
  const frontCardPosition = useSharedValue(FRONT_CARD_POSITION_DEFAULT);
  const backCardPosition = useSharedValue(BACK_CARD_POSITION_DEFAULT);

  // card flip animation
  const rStyles_card_container = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: SCREEN_HEIGHT },
        { rotateX: cardFlip.value + 'deg' },
      ],
    };
  });

  // animation reveals back of card
  const rStyles_card_back = useAnimatedStyle(() => {
    return {
      transform: [{ rotateX: backCardPosition.value + 'deg' }],
    };
  });

  // animation reveals front of card
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

  // flip card when solution is submitted
  useEffect(() => {
    if (showSolution)
      setTimeout(() => {
        flipCard();
      }, 275);
    else return;
  }, [showSolution]);

  return (
    // CARD CONTAINER
    <>
      {showSolution && (
        <Animated.Text
          style={{ ...styles.points, color: result ? 'green' : 'tomato' }}
          entering={FadeInDown.delay(900)}
        >
          {result ? 'CORRECT!' : 'INCORRECT!'}
        </Animated.Text>
      )}
      <Animated.View
        style={[styles.container]}
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
            <ImageBackground
              resizeMode='repeat'
              imageStyle={[styles.image]}
              style={styles.cardPattern}
              source={patternList[pattern]}
            />
            <Title style={{ ...styles.cardTitle, color: _fontColor }}>
              Q .
            </Title>
            <Text style={{ ...styles.text, color: _fontColor }}>
              {card.prompt}
            </Text>
          </Animated.View>

          {/* back of card - solution */}
          <Animated.View style={[styles.textContainer, rStyles_card_back]}>
            <Text
              style={{
                ...styles.text,
                ...styles.cardBackText,
                color: _fontColor,
              }}
            >
              {card.solution}
            </Text>
            <Title
              style={{
                ...styles.cardBackText,
                ...styles.cardTitle,
                color: _fontColor,
              }}
            >
              A .
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
    </>
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
    width: 256,
    height: 190,
    padding: 15,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 20,
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
  cardPattern: {
    // flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  image: {
    tintColor: 'white',
    opacity: 0.3,
    borderRadius: 10,
  },
  points: {
    position: 'absolute',
    top: -50,
    // right: 65,
    zIndex: 100,
    fontSize: 28,
    fontFamily: 'BalooBhaiExtraBold',
  },
});

export default Card;
