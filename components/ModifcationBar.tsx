import { View, Text, AccessibilityInfo } from 'react-native';
import { Button } from 'react-native-paper';
import React, { useEffect, useState } from 'react';
import s from './styles/styles';
import Animated, { SlideInLeft, SlideOutRight } from 'react-native-reanimated';
import useRenderCounter from '../hooks/useRenderCounter';

interface Props {
  buttonColor?: string;
  labelColor?: string;
  enableSelection: boolean;
  disableSelection: boolean;
  selections: string[];
  children?: React.ReactNode;
  onPressNew: () => void;
  clearSelection: () => void;
  onPressSelect: () => void;
  onConfirmSelection: () => void;
  onSort: () => void;
  sortMode: boolean;
}

const ModifcationBar = ({
  buttonColor,
  labelColor,
  selections,
  enableSelection,
  disableSelection,
  children,
  onPressNew,
  clearSelection,
  onPressSelect,
  onConfirmSelection,
  onSort,
  sortMode,
}: Props) => {
  const _cardColor = buttonColor;
  const _fontColor = labelColor;
  const disableFontColor = 'grey';
  const [screenReader, setScreenReader] = useState(false);
  const { renderCount } = useRenderCounter();
  renderCount.current++;

  const handleNewItem = () => {
    onPressNew();
  };

  const handleSelection = () => {
    onPressSelect();
  };

  useEffect(() => {
    const screenReaderChangedSubscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      (screenReaderEnabled) => {
        setScreenReader(screenReaderEnabled);
      }
    );

    AccessibilityInfo.isScreenReaderEnabled().then((screenReaderEnabled) => {
      setScreenReader(screenReaderEnabled);
    });

    return () => {
      screenReaderChangedSubscription.remove();
    };
  }, []);

  return (
    <View>
      {!enableSelection ? (
        <Animated.View
          style={s.cardButtonWrapper}
          entering={renderCount.current > 1 ? SlideInLeft : undefined}
          exiting={SlideOutRight}
          key={1}
        >
          <Button
            mode='contained'
            style={s.cardActionButton}
            labelStyle={{ color: sortMode ? disableFontColor : _fontColor }}
            color={_cardColor}
            onPress={handleNewItem}
            disabled={sortMode}
            accessibilityRole='button'
            accessibilityHint='create and add new card'
            accessibilityState={{ disabled: sortMode }}
          >
            new
          </Button>
          {!screenReader && (
            <Button
              mode='contained'
              style={s.cardActionButton}
              labelStyle={{
                color: disableSelection ? disableFontColor : _fontColor,
              }}
              color={_cardColor}
              onPress={onSort}
              disabled={disableSelection}
              accessibilityRole='button'
              accessibilityLabel={sortMode ? 'done' : 'sort'}
              accessibilityHint={
                sortMode ? 'complete sort' : 'sort order of cards'
              }
              accessibilityState={{ disabled: disableSelection }}
            >
              {sortMode ? 'done' : 'sort'}
            </Button>
          )}
          {children}
          <Button
            mode='contained'
            style={s.cardActionButton}
            labelStyle={[
              {
                color:
                  disableSelection || sortMode ? disableFontColor : _fontColor,
              },
            ]}
            color={_cardColor}
            onPress={handleSelection}
            disabled={disableSelection || sortMode}
            accessibilityRole='button'
            accessibilityHint='allow multiple selection to be removed'
            accessibilityState={{ disabled: sortMode || disableSelection }}
          >
            EDIT
          </Button>
        </Animated.View>
      ) : (
        <Animated.View
          style={s.cardButtonWrapper}
          key={2}
          entering={SlideInLeft}
          exiting={SlideOutRight}
        >
          <Button
            mode='contained'
            style={s.cardActionButton}
            color={_cardColor}
            onPress={clearSelection}
            disabled={selections.length === 0}
            accessibilityRole='button'
            accessibilityHint='clear selected cards'
          >
            CLEAR
          </Button>
          <Button
            mode='contained'
            style={[s.cardActionButton, { width: 90 }]}
            color={_cardColor}
            onPress={onConfirmSelection}
            accessibilityRole='button'
            accessibilityLabel={selections.length > 0 ? 'delete' : 'back'}
            accessibilityHint={
              selections.length > 0
                ? 'delete selected cards'
                : 'go back to previous toolbar'
            }
            accessibilityState={{ disabled: sortMode }}
          >
            {selections.length > 0 ? 'DELETE' : 'BACK'}
          </Button>
        </Animated.View>
      )}
    </View>
  );
};

export default ModifcationBar;
