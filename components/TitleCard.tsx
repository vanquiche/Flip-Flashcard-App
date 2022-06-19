import { View, ImageBackground, Pressable, StyleSheet } from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import React, { useState } from 'react';
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

import AlertDialog from './AlertDialog';

import Images from '../assets/patterns/images';

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
  const [showTooltip, setShowTooltip] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [checked, setChecked] = useState(false);

  // ANIMATION VALUES
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
          {/* <View style={{zIndex: 100}}> */}

          <Text style={[styles.textContent, { backgroundColor: card.color }]}>
            {card.name}
          </Text>
          {/* </View> */}
        </Tooltip>
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
    right: 0,
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
