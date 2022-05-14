import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Button, IconButton, TextInput } from 'react-native-paper';
import React, { useState } from 'react';

// UTILITIES
import uuid from 'react-native-uuid';
import { useQueryClient } from 'react-query';
import { Timestamp } from 'firebase/firestore';

// COMPONENTS
import CardActionDialog from './CardActionDialog';
import CategoryCard from './CategoryCard';

// HOOKS
import useGetFirestoreCollection from '../hooks/useGetFirestoreCollection';
import useSetDocToFirestore from '../hooks/useSetDocToFirestore';

// TYPES
import { Category } from './types';
import { StackNavigationTypes } from './types';

const CLOSE_NEW_DIALOG = 'close new-dialog';

interface Props extends StackNavigationTypes {}

const Categories: React.FC<Props> = ({ navigation }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [categoryValue, setCategoryValue] = useState('');
  const [colorValue, setColorValue] = useState('');

  const queryClient = useQueryClient();

  const path = 'users/clover/categories';

  const { query } = useGetFirestoreCollection(path, ['categories']);
  const { mutation } = useSetDocToFirestore(path);


  const handleCancel = (action: string) => {
    switch (action) {
      case 'close new-dialog':
        setCategoryValue('');
        setShowDialog(false);
        break;
      default:
        return;
    }
  };

  const addNewCategory = () => {
    if (categoryValue) {
      const newDoc: Category = {
        id: uuid.v4().toString(),
        name: categoryValue,
        color: 'tomato',
        favorite: false,
        createdAt: Timestamp.now().toDate()
      };
      mutation.mutate(newDoc, {
        onSuccess: () => {
          alert('successfully added category');
        },
        onError: (error) => {
          alert('Failed: ' + error.message);
        },
        onSettled: () => {
          queryClient.invalidateQueries('categories');
        },
      });
    }

    handleCancel(CLOSE_NEW_DIALOG);
  };


  return (
    <View>
      <IconButton
        icon='card-plus-outline'
        onPress={() => setShowDialog(true)}
      />

      {query.isError && <Text>Error</Text>}
      {query.isLoading && <Text>Loading...</Text>}
      {query.isSuccess && (
        <FlatList
          numColumns={2}
          data={query.data.docs}
          contentContainerStyle={{}}
          keyExtractor={(item) => item.data().id}
          renderItem={({ item }) => (
            <CategoryCard category={item.data() as Category} docId={item.id} />
          )}
        />
      )}

      {/* ADD NEW CATEGORY DIALOG */}
      <CardActionDialog
        visible={showDialog}
        dismiss={() => setShowDialog(false)}
        title='New Category'
        buttonTitle={['Cancel', 'Save']}
        onCancel={() => handleCancel(CLOSE_NEW_DIALOG)}
        onSubmit={addNewCategory}
        disableSubmit={categoryValue ? false : true}
      >
        <TextInput
          mode='outlined'
          label='Category Name'
          maxLength={32}
          value={categoryValue}
          onChangeText={(text) => setCategoryValue(text)}
        />
      </CardActionDialog>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Categories;
