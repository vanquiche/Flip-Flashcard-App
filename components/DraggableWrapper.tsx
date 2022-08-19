import { View, Text, useWindowDimensions, StyleSheet } from 'react-native';
import React from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  SharedValue,
  withSpring,
  withTiming,
  cancelAnimation,
  runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

interface Props {
  children?: React.ReactNode;
  onEnd?: () => void;
  moveObject: (
    list: Record<string, number>,
    from: number,
    to: number
  ) => Record<string, number>;
  positions: SharedValue<Record<string, number>>;
  itemHeight: number;
  itemWidth?: number;
  scrollY: SharedValue<number>;
  dataLength: number;
  id: string;
  yOffset: number;
  enableTouch: boolean;
}

const DraggableWrapper = ({
  id,
  children,
  positions,
  itemHeight,
  itemWidth,
  scrollY,
  dataLength,
  yOffset,
  onEnd,
  enableTouch,
  moveObject,
}: Props) => {
  const isMoving = useSharedValue(false);
  const itemPosition = useSharedValue(positions.value[id] * itemHeight);
  const dimensions = useWindowDimensions();

  useAnimatedReaction(
    () => positions.value[id],
    (currentPosition, previousPosition) => {
      if (currentPosition !== previousPosition) {
        if (!isMoving.value) {
          itemPosition.value = withSpring(currentPosition * itemHeight, {
            damping: 30,
          });
        }
      }
    },
    [isMoving.value]
  );

  const wrapperAnimatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      top: itemPosition.value,
      left: '50%',
      right: 0,
      zIndex: isMoving.value ? 1 : 0,
      shadowColor: 'black',
      shadowOffset: {
        height: 0,
        width: 0,
      },
      shadowOpacity: withSpring(isMoving.value ? 0.5 : 0),
      shadowRadius: 10,
    };
  }, [isMoving.value]);

  const clamp = (value: number, lowerBound: number, upperBound: number) => {
    'worklet';
    return Math.max(lowerBound, Math.min(value, upperBound));
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart(_, ctx: any) {
      isMoving.value = true;
      ctx.startPos = positions.value[id];
      ctx.endPos = ctx.startPos;
    },
    onActive(e, ctx) {
      const positionY = e.absoluteY + scrollY.value - yOffset;

      if (positionY <= scrollY.value + itemHeight + yOffset) {
        // scroll up
        scrollY.value = withTiming(0);
        // console.log('top!')
      } else if (
        positionY >=
        scrollY.value + dimensions.height - itemHeight - yOffset
      ) {
        // scroll down
        // console.log('bottom');
        const contentHeight = dataLength * itemHeight;
        const screenHeight = dimensions.height;
        const maxScroll = contentHeight - screenHeight + itemHeight - yOffset;
        scrollY.value = withTiming(maxScroll);
      } else {
        cancelAnimation(scrollY);
      }

      itemPosition.value = withTiming(positionY - itemHeight, { duration: 16 });

      // this will return between 0 - list.length
      const newPosition = clamp(
        Math.floor(positionY / itemHeight),
        0,
        dataLength - 1
      );

      // update position list when user
      // drags item to new position
      if (newPosition !== positions.value[id]) {
        positions.value = moveObject(
          positions.value,
          positions.value[id],
          newPosition
        );
      }

      ctx.endPos = newPosition;
    },
    onFinish(_, ctx) {
      isMoving.value = false;
      itemPosition.value = positions.value[id] * itemHeight;
      if (ctx.startPos !== ctx.endPos) {
        onEnd && runOnJS(onEnd)();
      }
    },
  });
  return (
    <PanGestureHandler onGestureEvent={gestureHandler} enabled={enableTouch}>
      <Animated.View
        style={[
          styles.wrapper,
          wrapperAnimatedStyle,
          { transform: [{ translateX: (itemWidth && -itemWidth) || 0 }] },
        ]}
      >
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 200,
  },
});

export default DraggableWrapper;
