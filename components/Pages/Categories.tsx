import { View, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import React, { useState, Suspense, useCallback, useContext } from 'react';
import uuid from 'react-native-uuid';
import { DateTime } from 'luxon';

// UTILITIES
import checkDuplicate from '../../utility/checkDuplicate';
import useMarkSelection from '../../hooks/useMarkSelection';

// COMPONENTS
import ActionDialog from '../ActionDialog';
import TitleCard from '../TitleCard';
import AlertDialog from '../AlertDialog';
import SwatchSelector from '../SwatchSelector';

// TYPES
import { Category } from '../types';
import { StackNavigationTypes } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import {
  addCategoryCard,
  removeCard,
  updateCard,
} from '../../redux/cardThunkActions';
import { removeFavorite } from '../../redux/storeSlice';
import s from '../styles/styles';
import swatchContext from '../../contexts/swatchContext';
import CustomTextInput from '../CustomTextInput';
import ModifcationBar from '../ModifcationBar';

const INITIAL_STATE: Category = {
  _id: '',
  name: '',
  color: 'tomato',
  createdAt: '',
  type: 'category',
  points: 0,
};

interface Props extends StackNavigationTypes {}

const Categories = ({ navigation, route }: Props) => {
  const [category, setCategory] = useState(INITIAL_STATE);
  // view state
  const [showDialog, setShowDialog] = useState(false);
  // const [showSwatch, setShowSwatch] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  // edit state
  const [editMode, setEditMode] = useState(false);
  const [multiSelectMode, setMultiSelectMode] = useState(false);

  const { cards } = useSelector((state: RootState) => state.store);
  const { colors, theme } = useContext(swatchContext);

  const { selection, selectItem, clearSelection } = useMarkSelection();

  const dispatch = useDispatch<AppDispatch>();

  const closeDialog = () => {
    setShowDialog(false);
    setTimeout(() => {
      setCategory(INITIAL_STATE);
      setEditMode(false);
    }, 300);
  };

  const addNewCategory = () => {
    const exist = checkDuplicate(category.name, 'name', cards.category);

    if (!exist) {
      const newDoc: Category = {
        _id: uuid.v4().toString(),
        name: category.name,
        color: category.color,
        type: 'category',
        createdAt: DateTime.now().toISO(),
        points: 0,
      };

      dispatch(addCategoryCard(newDoc));
    }
    closeDialog();
  };

  const editCategory = (category: Category) => {
    setCategory({
      ...category,
    });
    setEditMode(true);
    setShowDialog(true);
  };

  const submitEdit = () => {
    const docQuery = { name: category.name, color: category.color };
    dispatch(updateCard({ card: category, query: docQuery }));
    closeDialog();
  };

  const deleteCategory = (id: string) => {
    dispatch(removeCard({ id, type: 'category' }));
    dispatch(removeFavorite(id));
  };

  const selectColor = useCallback((color: string) => {
    setCategory((prev) => ({ ...prev, color }));
  }, []);

  const cancelMultiDeletion = () => {
    setMultiSelectMode(false);
    setShowAlert(false);
  };

  const confirmAlert = () => {
    if (selection.length > 0) {
      setShowAlert(true);
    } else {
      cancelMultiDeletion();
    }
  };

  const deleteSelection = () => {
    // cycle through selection and delete each ID
    for (let i = 0; i < selection.length; i++) {
      dispatch(removeCard({ id: selection[i], type: 'category' }));
      // remove all favorites that belong to
      // delete category
      dispatch(removeFavorite(selection[i]));
    }
    cancelMultiDeletion();
  };

  const startMultiSelectMode = () => {
    clearSelection();
    setMultiSelectMode(true);
  };

  return (
    <View>
      {/* button wrapper */}
      <ModifcationBar
        selections={selection}
        labelColor={theme.fontColor}
        buttonColor={theme.cardColor}
        enableSelection={multiSelectMode}
        disableSelection={cards.category.length === 0}
        clearSelection={clearSelection}
        onPressNew={() => setShowDialog(true)}
        onPressSelect={startMultiSelectMode}
        onConfirmSelection={confirmAlert}
      />

      <AlertDialog
        visible={showAlert}
        onDismiss={() => setShowAlert(false)}
        onConfirm={deleteSelection}
        message='DELETE SELECTED CATEGORIES?'
      />

      <Suspense fallback={<ActivityIndicator size='large' />}>
        <ScrollView>
          <View style={s.cardListContainer}>
            {cards.category?.map((category: Category) => {
              return (
                <TitleCard
                  key={category._id}
                  card={category}
                  multiSelect={multiSelectMode}
                  handleEdit={editCategory}
                  markForDelete={selectItem}
                  handleDelete={deleteCategory}
                  shouldAnimateEntry={true}
                  selectedForDeletion={selection.includes(category._id)}
                  onPress={() => {
                    navigation.navigate('Sets', {
                      categoryRef: category._id,
                    });
                  }}
                />
              );
            })}
          </View>
        </ScrollView>
      </Suspense>

      {/* ADD NEW CATEGORY DIALOG */}
      <ActionDialog
        visible={showDialog}
        dismiss={() => setShowDialog(false)}
        title={editMode ? 'EDIT CATEGORY' : 'NEW CATEGORY'}
        onCancel={closeDialog}
        onSubmit={editMode ? submitEdit : addNewCategory}
        disableSubmit={category.name ? false : true}
      >
        <View style={s.actionDialogChildrenContainer}>
          <CustomTextInput
            style={styles.textInput}
            label='CATEGORY NAME'
            defaultValue={editMode ? category.name : undefined}
            onChange={(name) => setCategory((prev) => ({ ...prev, name }))}
          />

          <SwatchSelector
            color={category.color}
            setColor={selectColor}
            swatches={colors}
          />
        </View>
      </ActionDialog>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    width: '80%',
    height: 40,
    margin: 0,
    marginBottom: 6,
  },
});

export default Categories;
