import { View, Text, StyleSheet } from 'react-native';
import { Button, IconButton, TextInput } from 'react-native-paper';
import React, { useState } from 'react';

import CardActionDialog from './CardActionDialog';

import { StackNavigationTypes } from './types';

const CLOSE_NEW_DIALOG = 'close new-dialog';

interface Props extends StackNavigationTypes {}

const Categories: React.FC<Props> = ({ navigation }) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [categoryValue, setCategoryValue] = useState('');

  const handleCancel = (action: string) => {
    switch (action) {
      case 'close new-dialog':
        setCategoryValue('');
        setShowAddDialog(false);
        break;
      default:
        return;
    }
  };

  return (
    <View>
      <IconButton
        icon='card-plus-outline'
        onPress={() => setShowAddDialog(true)}
      />

      <Button onPress={() => navigation.navigate('Sets')} mode='text'>
        Sets
      </Button>

      {/* ADD NEW CATEGORY DIALOG */}
      <CardActionDialog
        visible={showAddDialog}
        dismiss={() => setShowAddDialog(false)}
        title='New Category'
        buttonTitle={['Cancel', 'Save']}
        onCancel={() => handleCancel(CLOSE_NEW_DIALOG)}
        onSubmit={() => {}}
        disableSubmit={categoryValue ? false : true}
      >
        <TextInput
          mode='outlined'
          label='Category Name'
          value={categoryValue}
          onChangeText={(text) => setCategoryValue(text)}
        />

      </CardActionDialog>
    </View>
  );
};

const styles = StyleSheet.create({

});

export default Categories;
