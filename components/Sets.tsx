import { View, ActivityIndicator, FlatList } from 'react-native';
import { Text, IconButton, TextInput, useTheme } from 'react-native-paper';
import React, { useState, useEffect } from 'react';

import uuid from 'react-native-uuid';

import useGetFirestoreCollection from '../hooks/useGetFirestoreCollection';

import TitleCard from './TitleCard';
import CardActionDialog from './CardActionDialog';
import CardSwatchDialog from './CardSwatchDialog';

import { Set, StackNavigationTypes } from './types';
import useAddDocToFirestore from '../hooks/useAddDocToFirestore';
import { Timestamp } from 'firebase/firestore';
import useDeleteDocFromFirestore from '../hooks/useDeleteDocFromFirestore';
import useUpdateDocToFirestore from '../hooks/useUpdateDocToFirestore';

interface Props extends StackNavigationTypes {}

const INITIAL_STATE = {
  name: '',
  color: 'tomato',
};

const Sets: React.FC<Props> = ({ navigation, route }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [cardSet, setCardSet] = useState(INITIAL_STATE);
  const [docId, setDocId] = useState('1');

  const { colors } = useTheme();
  const { categoryRef, categoryTitle, color } = route.params;

  // CRUD hooks
  const path = 'users/clover/sets';
  const queryKey = ['sets', categoryRef];

  const { queries } = useGetFirestoreCollection(
    path,
    queryKey,
    'categoryRef',
    categoryRef
  );
  const { addMutation } = useAddDocToFirestore(path, queryKey);
  const { deleteMutation } = useDeleteDocFromFirestore(path, docId, queryKey);
  const { updateMutation } = useUpdateDocToFirestore(path, docId, queryKey);

  // CRUD functions
  const closeDialog = async () => {
    await setCardSet(INITIAL_STATE);
    setShowDialog(false);
    setEditMode(false);
  };

  const addNewSet = async () => {
    const newSet: Set = {
      id: uuid.v4().toString(),
      createdAt: Timestamp.now().toDate(),
      categoryRef: categoryRef,
      ...cardSet,
    };
    addMutation.mutate(newSet);
    await closeDialog();
  };

  const deleteSet = async (id: string) => {
    await setDocId(id);
    deleteMutation.mutate();
  };

  const editSet = async (set: any, id: string) => {
    await setDocId(id);
    setCardSet(set);
    setEditMode(true);
    setShowDialog(true);
  };

  const submitEdit = () => {
    updateMutation.mutate(cardSet);
    closeDialog();
  };

  // useEffect(() => {
  //   navigation.setOptions({
  //     headerTitle: categoryTitle,
  //   });
  // }, [categoryTitle]);

  return (
    <View>
      <IconButton
        icon='card-plus-outline'
        onPress={() => setShowDialog(true)}
      />

      {queries.isError && <Text>Error</Text>}
      {queries.isLoading && <ActivityIndicator size='large' />}
      {queries.isSuccess && (
        <FlatList
          numColumns={2}
          data={queries.data.docs}
          columnWrapperStyle={{ justifyContent: 'center' }}
          contentContainerStyle={{ paddingBottom: 75 }}
          keyExtractor={(item) => item.data().id}
          ListEmptyComponent={<Text>No Sets</Text>}
          renderItem={({ item }) => (
            <TitleCard
              docId={item.id}
              card={item.data() as Set}
              color={color}
              handleEdit={editSet}
              handleDelete={deleteSet}
              onPress={() =>
                navigation.navigate('Cards', {
                  setRef: item.data().id,
                  setTitle: item.data().name,
                  setColor: item.data().color,
                  categoryRef
                })
              }
            />
          )}
        />
      )}

      {/* ADD NEW CATEGORY DIALOG */}
      <CardActionDialog
        visible={showDialog}
        title={editMode ? 'EDIT SET' : 'NEW SET'}
        dismiss={closeDialog}
        onCancel={closeDialog}
        onSubmit={editMode ? submitEdit : addNewSet}
        disableSubmit={cardSet.name ? false : true}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <TextInput
            mode='outlined'
            label='SET NAME'
            outlineColor='lightgrey'
            activeOutlineColor={colors.secondary}
            maxLength={32}
            value={cardSet.name}
            onChangeText={(name) => setCardSet((prev) => ({ ...prev, name }))}
            style={{ width: '80%', height: 40, margin: 0 }}
          />

          <CardSwatchDialog
            color={cardSet.color}
            setColor={(color) => setCardSet((prev) => ({ ...prev, color }))}
          />
        </View>
      </CardActionDialog>
    </View>
  );
};

export default Sets;
