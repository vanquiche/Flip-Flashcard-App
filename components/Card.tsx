import { View, Pressable, StyleSheet, Alert } from 'react-native';
import {Text} from 'react-native-paper'
import React, { useState } from 'react';
import * as Haptics from 'expo-haptics';

import { IconButton } from 'react-native-paper';
import Tooltip from 'react-native-walkthrough-tooltip';

import { Category } from './types';

interface Props {
  docId: string;
  category: Category;
  handleEdit: (category: Category, id: string) => void;
  handleDelete: (docId: string) => void;
  handleColor?: () => void;
  onPress?: () => void;
}

const Card: React.FC<Props> = ({
  category,
  docId,
  handleEdit,
  handleDelete,
  handleColor,
  onPress,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const PopupIcons = () => {
    return (
      <View style={styles.popup}>
        <IconButton
          icon='delete'
          onPress={() => {
            handleDelete(docId);
            setShowTooltip(false);
          }}
        />
        <IconButton
          icon='pencil'
          onPress={() => {
            handleEdit(category, docId);
            setShowTooltip(false);
          }}
        />
        {/* <IconButton icon='palette' onPress={handleColor} /> */}
      </View>
    );
  };

  const handleLongPress = () => {
    setShowTooltip(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <Pressable
      key={category.id}
      style={[
        styles.card,
        {
          backgroundColor: category.color,
        },
      ]}
      onPress={onPress}
      onLongPress={handleLongPress}
    >
      <Tooltip
        placement='top'
        isVisible={showTooltip}
        onClose={() => setShowTooltip(false)}
        content={<PopupIcons />}
        showChildInTooltip={false}
        childContentSpacing={10} // closeOnContentInteraction={true}
        disableShadow={true}
      >
        <Text style={styles.textContent}>{category.name}</Text>
      </Tooltip>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    display: 'flex',
    justifyContent: 'center',
    width: '45%',
    height: 100,
    padding: 15,
    margin: 5,
    borderRadius: 10,
    backgroundColor: 'tomato',
  },
  textContent: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18
  },
  popup: {
    display: 'flex',
    flexDirection: 'row',
  },
});
export default Card;
