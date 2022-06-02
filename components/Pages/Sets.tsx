import { View, ActivityIndicator, ScrollView } from 'react-native';
import {
  Text,
  IconButton,
  TextInput,
  useTheme,
  Button,
} from 'react-native-paper';
import React, { useState, useEffect, Suspense, useReducer } from 'react';

// UTILITIES
import uuid from 'react-native-uuid'
import db from '../../db-services';
import useMarkSelection from '../../hooks/useMarkSelection';

// COMPONENTS
import TitleCard from '../TitleCard';
import ActionDialog from '../ActionDialog';
import SwatchDialog from '../SwatchDialog';
import AlertDialog from '../AlertDialog';

import { Set, StackNavigationTypes } from '../types';
import getData from '../../utility/getData';
import { cardReducer } from '../../reducers/CardReducer';
import checkDuplicate from '../../utility/checkDuplicate';

const INITIAL_STATE: { id?: string; name: string; color: string } = {
  id: '',
  name: '',
  color: 'tomato',
};

interface Props extends StackNavigationTypes {}

const Sets: React.FC<Props> = ({ navigation, route }) => {
  // data state
  const [cardSets, dispatch] = useReducer(cardReducer, []);
  const [cardSet, setCardSet] = useState(INITIAL_STATE);
  // view state
  const [showDialog, setShowDialog] = useState(false);
  const [showSwatch, setShowSwatch] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  // edit state
  const [editMode, setEditMode] = useState(false);
  const [multiSelectMode, setMultiSelectMode] = useState(false);

  const { selection, selectItem, clearSelection } = useMarkSelection();
  const { colors } = useTheme();
  const { categoryRef, categoryTitle } = route.params;

  // CRUD functions
  const closeDialog = async () => {
    setShowDialog(false);
    setTimeout(() => {
      setEditMode(false);
      setCardSet(INITIAL_STATE);
    }, 300);
  };

  const addNewSet = () => {
    const exist = checkDuplicate(cardSet.name, 'name', cardSets);

    if (!exist) {
      const newSet: Set = {
        _id: uuid.v4().toString(),
        type: 'set',
        name: cardSet.name,
        color: cardSet.color,
        createdAt: new Date(),
        categoryRef: categoryRef,
      };
      dispatch({type: 'insert', payload: newSet})
    }
    closeDialog();
  };

  const deleteSet = (id: string) => {
    dispatch({type: 'remove', payload: id})
  };

  const editSet = (set: Set) => {
    setCardSet({
      id: set._id,
      name: set.name,
      color: set.color,
    });
    setEditMode(true);
    setShowDialog(true);
  };

  const submitEdit = () => {
    const docQuery = { name: cardSet.name, color: cardSet.color }
    dispatch({type: 'update', payload: cardSet, query: docQuery})
    closeDialog();
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
      dispatch({type: 'remove', payload: selection.current[i]})
    }
    cancelMultiDeletion();
  };

  useEffect(() => {
    getData({type: 'set', categoryRef: categoryRef }, dispatch)
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: categoryTitle.toUpperCase(),
    });
  }, []);

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: 50,
        }}
      >
        {!multiSelectMode && (
          <Button
            color={colors.secondary}
            onPress={() => setShowDialog(true)}
          >NEW SET</Button>
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
            disabled={cardSets.length === 0}
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
        message='DELETE SELECTED SETS?'
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
            {cardSets.map((set: Set) => {
              return (
                <TitleCard
                  key={set._id}
                  card={set}
                  multiSelect={multiSelectMode}
                  handleEdit={editSet}
                  markForDelete={selectItem}
                  handleDelete={deleteSet}
                  onPress={() =>
                    navigation.navigate('Cards', {
                      color: set.color,
                      setRef: set._id,
                      setTitle: set.name,
                      categoryRef: categoryRef,
                    })
                  }
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
        title={editMode ? 'EDIT SET' : 'NEW SET'}
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

          <SwatchDialog
            isVisible={showSwatch}
            onClose={() => setShowSwatch(false)}
            onOpen={() => setShowSwatch(true)}
            color={cardSet.color}
            setColor={(color) => setCardSet((prev) => ({ ...prev, color }))}
          />
        </View>
      </ActionDialog>
    </View>
  );
};

export default Sets;
