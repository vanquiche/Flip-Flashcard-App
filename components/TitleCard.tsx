import { View, Pressable, StyleSheet, Alert } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import React, { useState, useMemo } from 'react';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  FadeOut,
  Layout,
  LightSpeedInLeft,
  LightSpeedOutRight,
} from 'react-native-reanimated';
import { IconButton } from 'react-native-paper';
import Tooltip from 'react-native-walkthrough-tooltip';
import { Category, Set } from './types';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
interface Props {
  docId: string;
  card: any;
  color?: string;
  handleEdit: (card: Category | Set, id: string) => void;
  handleDelete: (docId: string) => void;
  handleColor?: () => void;
  onPress?: () => void;
}

const TitleCard: React.FC<Props> = React.memo(({
  card,
  docId,
  color,
  handleEdit,
  handleDelete,
  onPress,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
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
            handleDelete(docId);
            setShowTooltip(false);
          }}
        />
        <IconButton
          icon='pencil'
          color='white'
          onPress={() => {
            handleEdit(card, docId);
            setShowTooltip(false);
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
    <AnimatedPressable
      key={card.id}
      style={[
        styles.card,
        {
          backgroundColor: card.color || color,
        },
      ]}
      onPress={onPress}
      onLongPress={handleLongPress}
      layout={Layout.springify()}
      exiting={LightSpeedOutRight}
      entering={LightSpeedInLeft}
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
        contentStyle={{ borderRadius: 10, backgroundColor: colors.secondary }}
      >
        <Text style={styles.textContent}>{card.name}</Text>
      </Tooltip>
    </AnimatedPressable>
  );
}, (prevProps, nextProps) => {
  if (prevProps.card.id === nextProps.card.id) return true; return false
});

const styles = StyleSheet.create({
  card: {
    justifyContent: 'center',
    width: '45%',
    // height: 110,
    aspectRatio: 1.45,
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
