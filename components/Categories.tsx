import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Button, IconButton, TextInput, useTheme } from 'react-native-paper';
import React, { useState, useCallback } from 'react';

// UTILITIES
import uuid from 'react-native-uuid';
import { useQueryClient } from 'react-query';
import { useFirestoreDocumentDeletion } from '@react-query-firebase/firestore';
import { Timestamp } from 'firebase/firestore';

// COMPONENTS
import CardActionDialog from './CardActionDialog';
import TitleCard from './TitleCard';
import CardSwatchDialog from './CardSwatchDialog';

// HOOKS
import useGetFirestoreCollection from '../hooks/useGetFirestoreCollection';
import useAddDocToFirestore from '../hooks/useAddDocToFirestore';
import useUpdateDocToFirestore from '../hooks/useUpdateDocToFirestore';
import useDeleteDocFromFirestore from '../hooks/useDeleteDocFromFirestore';

// TYPES
import { Category } from './types';
import { StackNavigationTypes } from './types';

const INITIAL_STATE = {
  name: '',
  color: 'tomato',
};

interface Props extends StackNavigationTypes {}

const Categories: React.FC<Props> = ({ navigation }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [updateId, setUpdateId] = useState('1');
  const [category, setCategory] = useState(INITIAL_STATE);

  const path = 'users/clover/categories';
  const { colors } = useTheme();

  const { queries } = useGetFirestoreCollection(path, ['categories']);
  const { addMutation } = useAddDocToFirestore(path, ['categories']);
  const { updateMutation } = useUpdateDocToFirestore(path, updateId, [
    'categories',
  ]);
  const { deleteMutation } = useDeleteDocFromFirestore(path, updateId, [
    'categories',
  ]);

  const closeDialog = async () => {
    await setCategory(INITIAL_STATE);
    setEditMode(false);
    setShowDialog(false);
  };

  const addNewCategory = useCallback(() => {
    if (category.name) {
      const newDoc: Category = {
        ...category,
        id: uuid.v4().toString(),
        createdAt: Timestamp.now().toDate(),
      };
      addMutation.mutate(newDoc);
    }
    closeDialog();
  }, [category]);

  const editCategory = async (category: Category, docId: string) => {
    await setUpdateId(docId);
    setCategory({
      name: category.name,
      color: category.color,
    });
    setEditMode(true);
    setShowDialog(true);
  };

  const submitEdit = () => {
    updateMutation.mutate(category);
    closeDialog();
  };

  const deleteCategory = async (id: string) => {
    await setUpdateId(id);
    deleteMutation.mutate();
  };

  return (
    <View >
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
          columnWrapperStyle={{justifyContent: 'center'}}
          contentContainerStyle={{ paddingBottom: 75 }}
          keyExtractor={(item) => item.data().id}
          ListEmptyComponent={<Text>No Categories</Text>}
          renderItem={({ item }) => (
            <TitleCard
              card={item.data() as Category}
              docId={item.id}
              handleEdit={editCategory}
              handleDelete={deleteCategory}
              onPress={() =>
                navigation.navigate('Sets', {
                  categoryRef: item.data().id,
                  categoryTitle: item.data().name,

                })
              }
            />
          )}
        />
      )}

      {/* ADD NEW CATEGORY DIALOG */}
      <CardActionDialog
        visible={showDialog}
        dismiss={() => setShowDialog(false)}
        title={editMode ? 'Edit Category' : 'NEW CATEGORY'}
        onCancel={closeDialog}
        onSubmit={editMode ? submitEdit : addNewCategory}
        disableSubmit={category.name ? false : true}
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
            label='CATEGORY NAME'
            outlineColor='lightgrey'
            activeOutlineColor={colors.secondary}
            maxLength={32}
            value={category.name}
            onChangeText={(name) => setCategory((prev) => ({ ...prev, name }))}
            style={{ width: '80%', height: 40, margin: 0 }}
          />

          <CardSwatchDialog
            color={category.color}
            setColor={(color) => setCategory((prev) => ({ ...prev, color }))}
          />
        </View>
      </CardActionDialog>
    </View>
  );
};

export default Categories;
