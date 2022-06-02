import { View, ActivityIndicator, ScrollView } from 'react-native';
import { Button, IconButton, TextInput, useTheme } from 'react-native-paper';
import React, {
  useState,
  useReducer,
  useEffect,
  Suspense,
} from 'react';
import uuid from 'react-native-uuid';

// UTILITIES
import db from '../../db-services';
import checkDuplicate from '../../utility/checkDuplicate';
import useMarkSelection from '../../hooks/useMarkSelection';
import getData from '../../utility/getData';

// COMPONENTS
import ActionDialog from '../ActionDialog';
import TitleCard from '../TitleCard';
import SwatchDialog from '../SwatchDialog';
import AlertDialog from '../AlertDialog';

// TYPES
import { Category, Set } from '../types';
import { StackNavigationTypes } from '../types';
import { cardReducer } from '../../reducers/CardReducer';

const INITIAL_STATE: { id?: string; name: string; color: string } = {
  name: '',
  color: 'tomato',
  id: '',
};

interface Props extends StackNavigationTypes {}

const Categories: React.FC<Props> = ({ navigation, route }) => {
  // data state
  const [categories, dispatch] = useReducer(cardReducer, []);
  const [category, setCategory] = useState(INITIAL_STATE);
  // view state
  const [showDialog, setShowDialog] = useState(false);
  const [showSwatch, setShowSwatch] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  // edit state
  const [editMode, setEditMode] = useState(false);
  const [multiSelectMode, setMultiSelectMode] = useState(false);

  const { colors } = useTheme();
  const { selection, selectItem, clearSelection } = useMarkSelection();

  const closeDialog = () => {
    setShowDialog(false);
    setTimeout(() => {
      setCategory(INITIAL_STATE);
      setEditMode(false);
    }, 300);
  };

  const addNewCategory = () => {
    const exist = checkDuplicate(category.name, 'name', categories);
    if (!exist) {
      const newDoc = {
        _id: uuid.v4(),
        name: category.name,
        color: category.color,
        type: 'category',
        createdAt: new Date(),
      };

      dispatch({ type: 'insert', payload: newDoc });
    } else return;
    closeDialog();
  };

  const editCategory = (category: Category | Set) => {
    setCategory({
      id: category._id,
      name: category.name,
      color: category.color,
    });
    setEditMode(true);
    setShowDialog(true);
  };

  const submitEdit = () => {
    dispatch({ type: 'update', payload: category });
    closeDialog();
  };

  const deleteCategory = (id: string) => {
    dispatch({ type: 'remove', payload: id });
  };

  const cancelMultiDeletion = () => {
    setMultiSelectMode(false);
    setShowAlert(false);
  };

  const confirmAlert = () => {
    if (selection.current.length > 0) {
      setShowAlert(true);
    } else {
      cancelMultiDeletion();
    }
  };

  const deleteSelection = () => {
    // cycle through selection and delete each ID
    for (let i = 0; i < selection.current.length; i++) {
      dispatch({ type: 'remove', payload: selection.current[i] });
    }
    cancelMultiDeletion();
  };

  useEffect(() => {
    getData({type: 'category'}, dispatch)
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: 'CATEGORIES',
    });
  }, []);

  return (
    <View>
      {/* button wrapper */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: 50,
        }}
      >
        {!multiSelectMode && (
          <Button color={colors.secondary} onPress={() => setShowDialog(true)}>
            NEW CATEGORY
          </Button>
        )}
        {/* start mode to mark for deletion */}
        {!multiSelectMode && (
          <Button
            mode='text'
            color={colors.secondary}
            onPress={() => {
              clearSelection();
              setMultiSelectMode(true);
            }}
            disabled={categories.length === 0}
          >
            EDIT
          </Button>
        )}

        {/* confirm selection for deletion */}
        {multiSelectMode && (
          <Button
            mode='text'
            color='red'
            onPress={confirmAlert}
            style={{ position: 'absolute', right: 0 }}
          >
            DELETE
          </Button>
        )}
      </View>

      <AlertDialog
        visible={showAlert}
        onDismiss={() => setShowAlert(false)}
        onConfirm={deleteSelection}
        message='DELETE SELECTED CATEGORIES?'
      />

      <Suspense fallback={<ActivityIndicator size='large' />}>
        <ScrollView>
          <View
            style={{
              paddingBottom: 150,
              flexWrap: 'wrap',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            {categories?.map((category: Category) => {
              return (
                <TitleCard
                  key={category._id}
                  card={category}
                  multiSelect={multiSelectMode}
                  handleEdit={editCategory}
                  markForDelete={selectItem}
                  handleDelete={deleteCategory}
                  onPress={() => {
                    navigation.navigate('Sets', {
                      categoryRef: category._id,
                      categoryTitle: category.name,
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
      </ActionDialog>
    </View>
  );
};

export default Categories;
