import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { IconButton } from 'react-native-paper';
import React, { useState } from 'react';

import { useFirestoreDocumentDeletion } from '@react-query-firebase/firestore';
import { useQueryClient } from 'react-query';
import { collection, doc, where, query } from 'firebase/firestore';
import { firestore } from '../firebase';

import * as Haptics from 'expo-haptics';
import Tooltip from 'react-native-walkthrough-tooltip';

import { Category } from './types';

interface Props {
  docId: string;
  category: Category,
  handleEdit?: () => void;
  handleDelete?: () => void;
  handleColor?: () => void;
  onPress?: () => void;
}

const CategoryCard: React.FC<Props> = ({ category, handleEdit, handleDelete, handleColor, onPress }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // const queryClient = useQueryClient();

  // const path = collection(firestore, 'users/clover/categories');
  // const ref = doc(path, docId);
  // const deleteMutation = useFirestoreDocumentDeletion(ref, {
  //   onSuccess() {
  //     queryClient.invalidateQueries('categories');
  //     alert('deleted category successfully');
  //   },
  //   onError(error) {
  //     alert('Failed: ' + error.message);
  //   },
  // });

  const PopupIcons = () => {


    return (
      <View style={styles.popup}>
        <IconButton icon='delete' onPress={handleDelete} />
        <IconButton icon='pencil' onPress={handleEdit} />
        <IconButton icon='palette' onPress={handleColor}/>
      </View>
    );
  };

  const handleLongPress = () => {
    setShowTooltip(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  // TODOS
  // add dialog to delete and edit category card
  return (
    <Pressable
      key={category.id}
      style={[styles.card, {backgroundColor: category.color}]}
      onPress={onPress}
      onLongPress={handleLongPress}
    >
      <Tooltip
        placement='top'
        isVisible={showTooltip}
        onClose={() => setShowTooltip(false)}
        content={<PopupIcons />}
        showChildInTooltip={false}
        childContentSpacing={10}
        closeOnContentInteraction={true}
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
    color: 'black',
  },
  popup: {
    display: 'flex',
    flexDirection: 'row',
  },
});

export default CategoryCard;
