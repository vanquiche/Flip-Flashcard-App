import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Button, IconButton, TextInput } from 'react-native-paper';
import React, { useState } from 'react';

// UTILITIES
import uuid from 'react-native-uuid';
import { useQueryClient } from 'react-query';
import { useFirestoreDocumentDeletion } from '@react-query-firebase/firestore';
import { Timestamp } from 'firebase/firestore';

// COMPONENTS
import CardActionDialog from './CardActionDialog';
import Card from './Card';
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

  const queryClient = useQueryClient();

  const path = 'users/clover/categories';

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

  const addNewCategory = () => {
    if (category.name) {
      const newDoc: Category = {
        ...category,
        id: uuid.v4().toString(),
        createdAt: Timestamp.now().toDate(),
      };
      addMutation.mutate(newDoc);
    }
    closeDialog();
  };

  const editCategory = (category: Category, docId: string) => {
    setUpdateId(docId);
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
          contentContainerStyle={{ paddingBottom: 75 }}
          keyExtractor={(item) => item.data().id}
          renderItem={({ item }) => (
            <Card
              category={item.data() as Category}
              docId={item.id}
              handleEdit={editCategory}
              handleDelete={deleteCategory}
              onPress={() => navigation.navigate('Sets')}
            />
          )}
        />
      )}

      {/* ADD NEW CATEGORY DIALOG */}
      <CardActionDialog
        visible={showDialog}
        dismiss={() => setShowDialog(false)}
        title={editMode ? 'Edit Category' : 'New Category'}
        buttonTitle={['Cancel', editMode ? 'Update' : 'Save']}
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
            label='Category Name'
            outlineColor='lightgrey'
            activeOutlineColor='tomato'
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
