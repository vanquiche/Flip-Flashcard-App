import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import React from 'react';
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
  const { renderCount } = useRenderCounter();
  renderCount.current++;

  const handleNewItem = () => {
    onPressNew();
  };

  const handleSelection = () => {
    onPressSelect();
  };

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
            labelStyle={{ color: _fontColor }}
            color={_cardColor}
            onPress={handleNewItem}
            disabled={sortMode}
          >
            NEW
          </Button>
          <Button
            mode='contained'
            style={s.cardActionButton}
            labelStyle={{ color: _fontColor }}
            color={_cardColor}
            onPress={onSort}
            disabled={disableSelection}
          >
            {sortMode ? 'done' : 'sort'}
          </Button>
          {children}
          <Button
            mode='contained'
            style={s.cardActionButton}
            labelStyle={[{ color: _fontColor }]}
            color={_cardColor}
            onPress={handleSelection}
            disabled={disableSelection || sortMode}
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
          >
            CLEAR
          </Button>
          <Button
            mode='contained'
            style={[s.cardActionButton, { width: 90 }]}
            color={_cardColor}
            onPress={onConfirmSelection}
          >
            {selections.length > 0 ? 'DELETE' : 'BACK'}
          </Button>
        </Animated.View>
      )}
    </View>
  );
};

export default ModifcationBar;
