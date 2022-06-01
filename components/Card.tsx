import { View, Pressable, StyleSheet, Alert, Dimensions } from 'react-native';
import { Text, useTheme, Title } from 'react-native-paper';
import React, { useState, useMemo } from 'react';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Layout,
  SlideInLeft,
  ZoomOut,
  SlideInRight,
  withSpring,
} from 'react-native-reanimated';
import { IconButton } from 'react-native-paper';
import Tooltip from 'react-native-walkthrough-tooltip';
import { Flashcard } from './types';

import AlertDialog from './AlertDialog';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const FRONT_CARD_POSITION_DEFAULT = 0;
const BACK_CARD_POSITION_DEFAULT = 180;

interface Props {
  card: Flashcard;
  color?: string;
  handleEdit: (card: Flashcard, id: string) => void;
  handleDelete: (docId: string) => void;
  handleColor?: () => void;
  onPress?: () => void;
  multiSelect: boolean;
  markForDelete: (id: any, state: boolean) => void;
}

const Card: React.FC<Props> = React.memo(
  ({ card, color, handleEdit, handleDelete, multiSelect, markForDelete }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [cardFacingFront, setCardFacingFront] = useState(true);
    const [checked, setChecked] = useState(false);

    const { colors } = useTheme();
    const cardFlip = useSharedValue(0);
    const frontCardPosition = useSharedValue(FRONT_CARD_POSITION_DEFAULT);
    const backCardPosition = useSharedValue(BACK_CARD_POSITION_DEFAULT);

    const cardOpacity = useSharedValue(1);
    const cardOpacityAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: withSpring(cardOpacity.value),
      };
    });

    const tooltipScale = useSharedValue(0);
    const tooltipAnimateStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: withTiming(tooltipScale.value) }],
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
      tooltipScale.value = 1;
      setShowTooltip(true);
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

    const PopupIcons = () => {
      return (
        <Animated.View style={[styles.popup, tooltipAnimateStyle]}>
          <IconButton
            icon='delete'
            color='white'
            onPress={() => {
              setShowTooltip(false);
              setShowAlert(true);
            }}
          />
          <IconButton
            icon='pencil'
            color='white'
            onPress={() => {
              setShowTooltip(false);
              handleEdit(card, card._id);
            }}
          />
          {/* <IconButton icon='palette' onPress={handleColor} /> */}
        </Animated.View>
      );
    };

    return (
      <>
        <AlertDialog
          message={`Are you sure you want to delete this card?`}
          visible={showAlert}
          onDismiss={() => setShowAlert(false)}
          onConfirm={() => handleDelete(card._id)}
        />

        {/* Card */}
        <AnimatedPressable
          style={[
            styles.card,
            { backgroundColor: color },
            rStyles_card_container,
            cardOpacityAnimatedStyle
          ]}
          // onPress={onPress}
          onPress={multiSelect ? toggleCheck : flipCard}
          onLongPress={handleLongPress}
          exiting={ZoomOut}
          entering={SlideInLeft.delay(300)}
          layout={Layout.springify().damping(15).delay(200)}
        >
          {/* indicator of card selection */}
          {multiSelect && (
            <IconButton
              icon='close-thick'
              color={checked ? 'white' : 'transparent'}
              style={{ position: 'absolute', left: 0, top: 0 }}
            />
          )}

          <Tooltip
            placement='top'
            isVisible={showTooltip}
            onClose={() => {
              setShowTooltip(false);
              tooltipScale.value = 0;
            }}
            content={<PopupIcons />}
            showChildInTooltip={false}
            childContentSpacing={30}
            disableShadow={true}
            contentStyle={{
              borderRadius: 10,
              backgroundColor: colors.secondary,
            }}
          >
            <Text />
          </Tooltip>
          {/* FRONT OF CARD */}
          <Animated.View style={[styles.textContainer, rStyles_card_front]}>
            <Title style={styles.cardTitle}>PROMPT</Title>
            <Text style={styles.textContent}>{card.prompt}</Text>
          </Animated.View>

          {/* BACK OF CARD */}
          <Animated.View style={[styles.textContainer, rStyles_card_back]}>
            <Text style={[styles.textContent, styles.cardBackText]}>
              {card.solution}
            </Text>
            <Title style={[styles.cardBackText, styles.cardTitle]}>
              SOLUTION
            </Title>
          </Animated.View>
        </AnimatedPressable>
      </>
    );
  },
  (prevProps, nextProps) => {
    if (
      prevProps.card.prompt === nextProps.card.prompt &&
      prevProps.card.solution === nextProps.card.solution &&
      prevProps.multiSelect === nextProps.multiSelect
    )
      return true;
    return false;
  }
);

const styles = StyleSheet.create({
  card: {
    justifyContent: 'center',
    width: '70%',
    aspectRatio: 1 / 0.7,
    // height: 185,
    // padding: 10,
    marginVertical: 12,
    borderRadius: 15,
    backgroundColor: 'white',
    // position: 'relative'
  },
  textContent: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    // marginVertical: 10,
    backfaceVisibility: 'hidden',
  },
  textContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    padding: 20
  },
  cardBackText: {
    transform: [{ scaleY: -1 }],
  },
  cardTitle: {
    color: 'white',
  },

  popup: {
    display: 'flex',
    flexDirection: 'row',
  },
});
export default Card;
