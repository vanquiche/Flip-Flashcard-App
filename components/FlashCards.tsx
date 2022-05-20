import { View } from 'react-native';
import React, { useState } from 'react';
import { IconButton, useTheme, Text } from 'react-native-paper';

import { StackNavigationTypes } from './types';
interface Props extends StackNavigationTypes {}

const FlashCards: React.FC<Props> = ({ navigation, route }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [docId, setDocId] = useState('1')

  const { colors } = useTheme();
  const { setRef, categoryRef, setTitle, color } = route.params;

  // CRUD hooks
  const path = 'users/clover/flashcards';
  const queryKey = ['flashcards', setRef];

  // const { addMutation } = useAddDocToFirestore(path, queryKey);
  // const { deleteMutation } = useDeleteDocFromFirestore(path, docId, queryKey);
  return (
    <View>
      <IconButton
        icon='card-plus-outline'
        onPress={() => setShowDialog(true)}
      />
      <Text>{setTitle}</Text>
      <Text>Set: {setRef}</Text>
      <Text>Category: {categoryRef}</Text>
    </View>
  );
};

export default FlashCards;
