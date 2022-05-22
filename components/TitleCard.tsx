import { View, Pressable, StyleSheet, Alert } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import React, { useState, useMemo } from 'react';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Layout,
  SlideInLeft,
  ZoomOut,
} from 'react-native-reanimated';
import { IconButton } from 'react-native-paper';
import Tooltip from 'react-native-walkthrough-tooltip';
import { Category, Set } from './types';

import AlertDialog from './AlertDialog';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  card: Category | Set;
  color?: string;
  handleEdit: (card: Category | Set, id: string) => void;
  handleDelete: (docId: string) => void;
  handleColor?: () => void;
  onPress?: () => void;
}

const TitleCard: React.FC<Props> = React.memo(
  ({ card, handleEdit, handleDelete, onPress }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const tooltipScale = useSharedValue(0);
    const tooltipAnimateStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            scale: withTiming(tooltipScale.value),
          },
        ],
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
              handleEdit(card, card._id);
            }}
          />
          {/* <IconButton icon='palette' onPress={handleColor} /> */}
        </Animated.View>
      );
    };

    const handleLongPress = () => {
      tooltipScale.value = 1;
      setShowTooltip(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
          ]}
          onPress={onPress}
          onLongPress={handleLongPress}
          exiting={ZoomOut}
          entering={SlideInLeft.delay(200)}
          layout={Layout.springify().damping(15).delay(200)}
        >
          <Tooltip
            placement='top'
            isVisible={showTooltip}
            onClose={() => {
              setShowTooltip(false);
              tooltipScale.value = 0;
            }}
            content={<PopupIcons />}
            showChildInTooltip={false}
            childContentSpacing={10} // closeOnContentInteraction={true}
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
      prevProps.card.color === nextProps.card.color
    )
      return true;
    return false;
  }
);

const styles = StyleSheet.create({
  card: {
    justifyContent: 'center',
    width: '45%',
    height: 115,
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
