import { View, Pressable, StyleSheet, Alert } from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import React, { useEffect, useState } from 'react';
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
import Tooltip from 'react-native-walkthrough-tooltip';

import { Category, Set } from './types';

import AlertDialog from './AlertDialog';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Collection {
  _id: string;
  name: string;
  color: string;
  favorite?: boolean;
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

const TitleCard: React.FC<Props> = React.memo(
  ({ card, multiSelect, handleEdit, handleDelete, onPress, markForDelete }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [checked, setChecked] = useState(false);

    // ANIMATION VALUES
    const cardScale = useSharedValue(1);
    const cardOpacity = useSharedValue(1);
    const cardScaleAnimatedStyle = useAnimatedStyle(() => {
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

    const { colors } = useTheme();

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
              handleEdit(card);
            }}
          />
        </Animated.View>
      );
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

    return (
      <>
        <AlertDialog
          message={`Are you sure you want to delete ${card.name}?`}
          visible={showAlert}
          onDismiss={() => setShowAlert(false)}
          onConfirm={() => handleDelete(card._id)}
        />
        <AnimatedPressable
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
          entering={SlideInLeft.delay(200)}
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
            childContentSpacing={10}
            disableShadow={true}
            contentStyle={{
              borderRadius: 10,
              backgroundColor: colors.secondary,
            }}
          >
            <Text style={styles.textContent}>{card.name}</Text>
          </Tooltip>
        </AnimatedPressable>
      </>
    );
  },
  (prevProps, nextProps) => {
    if (
      prevProps.card.name === nextProps.card.name &&
      prevProps.card.color === nextProps.card.color &&
      prevProps.card?.favorite === nextProps.card?.favorite &&
      prevProps.multiSelect === nextProps.multiSelect
    )
      return true;
    return false;
  }
);

const styles = StyleSheet.create({
  card: {
    justifyContent: 'center',
    width: '45%',
    height: 125,
    // aspectRatio: 1.45,
    padding: 15,
    margin: 5,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  textContent: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
  },
  popup: {
    display: 'flex',
    flexDirection: 'row',
  },
});
export default TitleCard;
