import { View, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import React, { useRef, useState, useMemo } from 'react';
import Tooltip from 'react-native-walkthrough-tooltip';
import Palette from './Palette';
const COLORS = [
  '#C0392B',
  '#E74C3C',
  '#9B59B6',
  '#8E44AD',
  '#2980B9',
  '#3498DB',
  '#1ABC9C',
  '#16A085',
  '#27AE60',
  '#2ECC71',
  '#F1C40F',
  '#F39C12',
  '#E67E22',
  '#D35400',
  '#FFFFFF',
  '#BDC3C7',
  '#95A5A6',
  '#7F8C8D',
  '#34495E',
  '#2C3E50',
];
interface Props {
  color: string;
  isVisible: boolean;
  onClose: () => void;
  onOpen: () => void;
  setColor: (color: string) => void;
}

const SwatchDialog: React.FC<Props> = ({
  color,
  setColor,
  isVisible,
  onClose,
  onOpen,
}) => {

  const paletteColors = useMemo(() => {
    return COLORS
  }, []);

  // const { colors } = useTheme();

  // console.log('render swatch dialog');
  return (
    <Tooltip
      placement='top'
      isVisible={isVisible}
      onClose={onClose}
      content={
        <Palette
          selection={color}
          setColor={(color: string) => setColor(color)}
          palette={paletteColors}
        />
      }
      showChildInTooltip={false}
      childContentSpacing={-10}
      closeOnContentInteraction={false}
      disableShadow={true}
      tooltipStyle={{
        width: 250,
      }}
      contentStyle={{
        borderRadius: 12,
      }}
      arrowStyle={{
        left: 200,
      }}
    >
      <Pressable
        style={[
          styles.dialogSwatch,
          {
            backgroundColor: color || 'tomato',
          },
        ]}
        onPress={onOpen}
      />
    </Tooltip>
  );
};

const styles = StyleSheet.create({
  dialogSwatch: {
    height: 40,
    width: 40,
    borderRadius: 6,
    marginTop: 5,
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
  },
});
export default SwatchDialog;
