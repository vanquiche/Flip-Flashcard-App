import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Button, IconButton, TextInput, useTheme } from 'react-native-paper';
import React, { useState, useCallback, useEffect } from 'react';

// UTILITIES
import uuid from 'react-native-uuid';
import db from '../db-services';

// COMPONENTS
import CardActionDialog from './CardActionDialog';
import TitleCard from './TitleCard';
import SwatchDialog from './SwatchDialog';

// TYPES
import { Category, Set } from './types';
import { StackNavigationTypes } from './types';
import { ScrollView } from 'react-native-gesture-handler';

const INITIAL_STATE = {
  name: '',
  color: 'tomato',
};

interface Props extends StackNavigationTypes {}

const Categories: React.FC<Props> = ({ navigation }) => {
  // data state
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState(INITIAL_STATE);
  // view state
  const [showDialog, setShowDialog] = useState(false);
  const [showSwatch, setShowSwatch] = useState(false);
  // edit state
  const [editMode, setEditMode] = useState(false);
  const [updateId, setUpdateId] = useState('');
  // loading state
  const [loading, setLoading] = useState(true);

  const { colors } = useTheme();

  const closeDialog = async () => {
    await setCategory(INITIAL_STATE);
    setEditMode(false);
    setShowDialog(false);
  };

  const addNewCategory = () => {
    const newDoc = {
      ...category,
      type: 'category',
      createdAt: new Date(),
    };

    db.insert(newDoc, async (err: Error, doc: any) => {
      if (err) console.log(err);
      setCategories((prev) => [doc, ...prev]);
    });
    closeDialog();
  };

  const editCategory = async (category: Category | Set, id: string) => {
    await setUpdateId(id);
    await setCategory({
      name: category.name,
      color: category.color,
    });
    setEditMode(true);
    setShowDialog(true);
  };

  const submitEdit = () => {
    db.update(
      { _id: updateId },
      { $set: { name: category.name, color: category.color } },
      (err: Error, numRemoved: number) => {
        if (err) console.log(err);
        setCategories((prev) =>
          prev.map((item) => {
            if (item._id === updateId) {
              return { ...item, name: category.name, color: category.color };
            }
            return item;
          })
        );
      }
    );
    closeDialog();
  };

  const deleteCategory = (id: string) => {
    db.remove({ _id: id }, {}, (err: Error, numRemoved: any) => {
      if (err) console.log(err);
      setCategories((prev) => prev.filter((category) => category._id !== id));
    });
  };

  useEffect(() => {
    // fetch data from db 
    const getData = () => {
      db.find({ type: 'category' }, async (err: any, docs: any) => {
        const data = await docs.map((doc: Category) => {
          // convert date to number
          doc.createdAt = new Date(doc.createdAt).valueOf();
          return doc;
        });
        // sort by date
        const sorted = data.sort((a: any, b: any) => {
          return b.createdAt - a.createdAt;
        });
        setCategories(sorted);
        setLoading(false);
      });
    };
    getData();
  }, []);

  return (
    <View>
      <IconButton
        icon='card-plus-outline'
        onPress={() => setShowDialog(true)}
      />

      {!loading && (
        <ScrollView>
          <View
            style={{
              paddingBottom: 150,
              flexWrap: 'wrap',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            {categories.map((category) => {
              return (
                <TitleCard
                  key={category._id}
                  card={category as Category}
                  handleEdit={editCategory}
                  handleDelete={deleteCategory}
                  onPress={() =>
                    navigation.navigate('Sets', {
                      categoryRef: category._id,
                      categoryTitle: category.name,
                    })
                  }
                />
              );
            })}
          </View>
        </ScrollView>
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

          <SwatchDialog
            isVisible={showSwatch}
            onClose={() => setShowSwatch(false)}
            onOpen={() => setShowSwatch(true)}
            color={category.color}
            setColor={(color) => setCategory((prev) => ({ ...prev, color }))}
          />
        </View>
      </CardActionDialog>
    </View>
  );
};

export default Categories;
