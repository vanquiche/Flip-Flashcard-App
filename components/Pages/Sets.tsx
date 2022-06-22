import { View, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import {
  Text,
  IconButton,
  TextInput,
  useTheme,
  Button,
  Title,
} from 'react-native-paper';
import React, {
  useState,
  useEffect,
  Suspense,
  useReducer,
  useCallback,
} from 'react';

// UTILITIES
import uuid from 'react-native-uuid';
import { DateTime } from 'luxon';
import db from '../../db-services';
import useMarkSelection from '../../hooks/useMarkSelection';
import checkDuplicate from '../../utility/checkDuplicate';
import getData from '../../utility/getData';
// REDUCER
import { cardReducer } from '../../reducers/CardReducer';

// COMPONENTS
import TitleCard from '../TitleCard';
import ActionDialog from '../ActionDialog';
import AlertDialog from '../AlertDialog';
import SwatchSelector from '../SwatchSelector';
import PatternSelector from '../PatternSelector';

import { Set, StackNavigationTypes } from '../types';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { addFavorite, removeFavorite } from '../../redux/preferenceSlice';

const INITIAL_STATE: {
  id: string;
  name: string;
  color: string;
  design: string;
  favorite: boolean;
} = {
  id: '',
  name: '',
  color: 'tomato',
  design: 'default',
  favorite: false,
};

interface Props extends StackNavigationTypes {}

const Sets: React.FC<Props> = ({ navigation, route }) => {
  // data state
  const [cardSets, cardDispatch] = useReducer(cardReducer, []);
  const [cardSet, setCardSet] = useState(INITIAL_STATE);
  // view state
  const [showDialog, setShowDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  // edit state
  const [editMode, setEditMode] = useState(false);
  const [multiSelectMode, setMultiSelectMode] = useState(false);

  const { selection, selectItem, clearSelection } = useMarkSelection();
  const { colors } = useTheme();
  const { categoryRef } = route.params;
  const dispatch = useDispatch<AppDispatch>();

  // CRUD functions
  const closeDialog = () => {
    setShowDialog(false);
    setTimeout(() => {
      setEditMode(false);
      setCardSet(INITIAL_STATE);
    }, 300);
  };

  const addNewSet = () => {
    // check for cards with matching names
    const exist = checkDuplicate(cardSet.name, 'name', cardSets);

    // create payload to dispatch into db
    if (!exist) {
      const newSet: Set = {
        _id: uuid.v4().toString(),
        type: 'set',
        name: cardSet.name,
        color: cardSet.color,
        design: cardSet.design,
        favorite: cardSet.favorite,
        createdAt: DateTime.now().toISO(),
        categoryRef: categoryRef,
      };
      cardDispatch({ type: 'insert', payload: newSet });

      // if set is favorited then add to preference store
      if (newSet.favorite) {
        dispatch(addFavorite(newSet));
      }
    }
    closeDialog();
  };

  const deleteSet = (id: string) => {
    cardDispatch({ type: 'remove', payload: id });
    // remove favorite from preference store
    dispatch(removeFavorite(id));
  };

  const editSet = (set: Set) => {
    // place selected card into current state of set
    setCardSet({
      id: set._id,
      name: set.name,
      color: set.color,
      design: set.design,
      favorite: set.favorite,
    });
    // turn on edit mode to switch function of action dialog
    setEditMode(true);
    setShowDialog(true);
  };

  const submitEdit = () => {
    // submit update to dispatch
    const docQuery = {
      name: cardSet.name,
      color: cardSet.color,
      design: cardSet.design,
      favorite: cardSet.favorite,
    };
    cardDispatch({ type: 'update', payload: cardSet, query: docQuery });

    // remove set from favorite store
    if (!cardSet.favorite) {
      dispatch(removeFavorite(cardSet.id));
    } else if (cardSet.favorite) {
      // search for set and add to favorite store
      db.find({ _id: cardSet.id }, (err: Error, docs: Set[]) => {
        if (err) console.log(err.message);
        // console.log(docs[0])
        const updated = Object.assign(docs[0], cardSet)
        // console.log(updated)
        dispatch(addFavorite(updated));
      });
    }
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
      cardDispatch({ type: 'remove', payload: selection.current[i] });
      // remove from favorites
      dispatch(removeFavorite(selection.current[i]));
    }
    cancelMultiDeletion();
  };

  const selectPattern = useCallback((design) => {
    setCardSet((prev) => ({ ...prev, design }));
  }, []);

  const selectColor = useCallback((color) => {
    setCardSet((prev) => ({ ...prev, color }));
  }, []);

  useEffect(() => {
    // find cards within the parent category
    getData({ type: 'set', categoryRef: categoryRef }, cardDispatch);
  }, [categoryRef]);

  useEffect(() => {
    // set title of screen to category name
    db.find({ _id: categoryRef }, (err: Error, docs: any) => {
      if (err) console.log(err);
      navigation.setOptions({
        title: docs[0].name.toUpperCase(),
      });
    });
  }, [categoryRef]);

  return (
    <View>
      {/* ACTION BUTTONS */}
      <View style={styles.buttonContainer}>
        {!multiSelectMode && (
          <Button color={colors.secondary} onPress={() => setShowDialog(true)}>
            NEW SET
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

      {/* ALERT USER OF DELETION */}
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
                      design: set.design,
                      categoryRef: categoryRef,
                    })
                  }
                />
              );
            })}
          </View>
        </ScrollView>
      </Suspense>

      {/* ADD/EDIT CATEGORY DIALOG */}
      <ActionDialog
        visible={showDialog}
        dismiss={() => setShowDialog(false)}
        title={editMode ? 'EDIT SET' : 'NEW SET'}
        onCancel={closeDialog}
        onSubmit={editMode ? submitEdit : addNewSet}
        disableSubmit={cardSet.name ? false : true}
      >
        <TextInput
          mode='outlined'
          label='SET NAME'
          outlineColor='lightgrey'
          activeOutlineColor={colors.secondary}
          maxLength={32}
          style={{ height: 40, margin: 0 }}
          value={cardSet.name}
          onChangeText={(name) => setCardSet((prev) => ({ ...prev, name }))}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 15,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SwatchSelector color={cardSet.color} setColor={selectColor} />
            <Title style={{ color: colors.secondary, marginLeft: 10 }}>
              COLOR
            </Title>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Title style={{ color: colors.secondary, marginRight: 10 }}>
              DESIGN
            </Title>
            <PatternSelector
              setPattern={selectPattern}
              pattern={cardSet.design}
              color={cardSet.color}
            />
          </View>
        </View>

        <IconButton
          size={30}
          color={colors.secondary}
          style={{
            margin: 0,
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 10,
          }}
          icon={cardSet.favorite ? 'star' : 'star-outline'}
          onPress={() =>
            setCardSet((prev) => ({ ...prev, favorite: !prev.favorite }))
          }
        />
      </ActionDialog>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 50,
  },
});

export default Sets;
