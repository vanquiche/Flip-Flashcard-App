import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import React from 'react';
import s from './styles/styles';

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
}: Props) => {
  const _cardColor = buttonColor;
  const _fontColor = labelColor;

  const handleNewItem = () => {
    onPressNew();
  };

  const handleSelection = () => {
    onPressSelect();
  };

  return (
    <View style={s.cardButtonWrapper}>
      {!enableSelection ? (
        <>
          <Button
            mode='contained'
            style={s.cardActionButton}
            labelStyle={{ color: _fontColor }}
            color={_cardColor}
            onPress={handleNewItem}
          >
            NEW
          </Button>
          {children}
          <Button
            mode='contained'
            style={s.cardActionButton}
            labelStyle={[{ color: _fontColor }]}
            color={_cardColor}
            onPress={handleSelection}
            disabled={disableSelection}
          >
            SELECT
          </Button>
        </>
      ) : (
        <>
          <Button
            mode='text'
            style={[
              s.cardActionButton,
              { position: 'absolute', right: 0, width: 100 },
            ]}
            color='tomato'
            onPress={onConfirmSelection}
          >
            {selections.length > 0 ? 'DELETE' : 'BACK'}
          </Button>

          <Button
            mode='text'
            style={s.cardActionButton}
            color='tomato'
            onPress={clearSelection}
            disabled={selections.length === 0}
          >
            CLEAR
          </Button>
        </>
      )}
    </View>
  );
};

export default ModifcationBar;
