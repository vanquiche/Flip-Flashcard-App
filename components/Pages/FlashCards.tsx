import { View, ScrollView, ActivityIndicator } from 'react-native';
import React, {
  useState,
  useEffect,
  Suspense,
  useReducer,
  useRef,
} from 'react';
import {
  IconButton,
  useTheme,
  Text,
  TextInput,
  Button,
} from 'react-native-paper';
import { DateTime } from 'luxon';

import uuid from 'react-native-uuid';
import db from '../../db-services';
import useMarkSelection from '../../hooks/useMarkSelection';
import checkDuplicate from '../../utility/checkDuplicate';
import getData from '../../utility/getData';

import ActionDialog from '../ActionDialog';
import Card from '../Card';
import Quiz from '../Quiz';
import AlertDialog from '../AlertDialog';

import { Flashcard } from '../types';
import { StackNavigationTypes } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import {
  addFlashCard,
  getCards,
  removeCard,
  updateCard,
} from '../../redux/cardThunkActions';

const INITIAL_STATE: { id: string; prompt: string; solution: string } = {
  id: '',
  prompt: '',
  solution: '',
};

interface Props extends StackNavigationTypes {}

const FlashCards: React.FC<Props> = ({ navigation, route }) => {
  const [flashcard, setFlashcard] = useState(INITIAL_STATE);
  const [showDialog, setShowDialog] = useState(false);
  const [setName, setSetName] = useState('');

  const [editMode, setEditMode] = useState(false);
  const [startQuiz, setStartQuiz] = useState(false);
  const [multiSelectMode, setMultiSelectMode] = useState(false);

  const [showAlert, setShowAlert] = useState(false);

  const categoryXP = useRef<number>(0);
  const { colors } = useTheme();
  const { selection, selectItem, clearSelection } = useMarkSelection();

  const { cards } = useSelector((state: RootState) => state.store);
  const dispatch = useDispatch<AppDispatch>();
  const { setRef, categoryRef, color, design } = route.params;

  const closeDialog = () => {
    setShowDialog(false);
    setTimeout(() => {
      setEditMode(false);
      setFlashcard(INITIAL_STATE);
    }, 300);
  };

  const addNewCard = () => {
    const exist = checkDuplicate(flashcard.prompt, 'prompt', cards.flashcard);

    if (!exist) {
      const newCard: Flashcard = {
        _id: uuid.v4().toString(),
        type: 'flashcard',
        prompt: flashcard.prompt,
        solution: flashcard.solution,
        createdAt: DateTime.now().toISO(),
        categoryRef: categoryRef,
        setRef: setRef,
      };
      dispatch(addFlashCard(newCard));
    }
    closeDialog();
  };

  const deleteCard = (id: string) => {
    dispatch(removeCard({ id, type: 'flashcard' }));
  };

  const editCard = (card: Flashcard) => {
    setFlashcard({
      id: card._id,
      prompt: card.prompt,
      solution: card.solution,
    });
    setEditMode(true);
    setShowDialog(true);
  };

  const submitEdit = () => {
    const docQuery = { prompt: flashcard.prompt, solution: flashcard.solution };
    dispatch(
      updateCard({ id: flashcard.id, type: 'flashcard', query: docQuery })
    );
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
      dispatch(removeCard({ id: selection.current[i], type: 'flashcard' }));
    }
    cancelMultiDeletion();
  };

  useEffect(() => {
    // fetch data from db
    dispatch(
      getCards({
        type: 'flashcard',
        query: { type: 'flashcard', setRef: setRef },
      })
    );
  }, [setRef]);

  useEffect(() => {
    db.find({ _id: setRef }, (err: Error, docs: any) => {
      if (err) console.log(err);
      navigation.setOptions({
        title: docs[0].name.toUpperCase(),
      });
      setSetName(docs[0].name);
    });

    db.find({ _id: categoryRef }, (err: Error, docs: any[]) => {
      if (docs.length > 0) {
        categoryXP.current = docs[0].points;
      }
    });
  }, [setRef, categoryRef]);

  return (
    <View>
      {/* CONTROL BUTTONS  */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: 50,
        }}
      >
        {/* ADD NEW FLASHCARD */}
        {!multiSelectMode && (
          <Button color={colors.secondary} onPress={() => setShowDialog(true)}>
            NEW CARD
          </Button>
        )}

        {/* BUTTON TO START QUIZ */}
        {!multiSelectMode && (
          <Button
            color={colors.secondary}
            onPress={() => setStartQuiz(true)}
            disabled={cards.flashcard.length === 0}
          >
            QUIZ
          </Button>
        )}

        {/* START MULTI-SELECT */}
        {!multiSelectMode && (
          <Button
            mode='text'
            color={colors.secondary}
            onPress={() => {
              clearSelection();
              setMultiSelectMode(true);
            }}
            disabled={cards.flashcard.length === 0}
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

      {startQuiz && (
        <Quiz
          set={setName}
          cards={cards.flashcard}
          pattern={design as string}
          color={color as string}
          setRef={setRef}
          categoryRef={categoryRef}
          categoryXP={categoryXP.current}
          navigation={navigation}
          onDismiss={() => setStartQuiz(false)}
        />
      )}

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
              alignItems: 'center',
            }}
          >
            {cards.flashcard.map((card: Flashcard) => {
              return (
                <Card
                  key={card._id}
                  card={card}
                  color={color}
                  pattern={design}
                  handleDelete={deleteCard}
                  handleEdit={editCard}
                  multiSelect={multiSelectMode}
                  markForDelete={selectItem}
                />
              );
            })}
          </View>
        </ScrollView>
      </Suspense>

      <ActionDialog
        visible={showDialog}
        dismiss={() => setShowDialog(false)}
        title={editMode ? 'EDIT CARD' : 'NEW CARD'}
        onCancel={closeDialog}
        onSubmit={editMode ? submitEdit : addNewCard}
        disableSubmit={flashcard.prompt && flashcard.solution ? false : true}
      >
        <View style={{}}>
          <TextInput
            mode='outlined'
            label='PROMPT'
            outlineColor='lightgrey'
            activeOutlineColor={colors.secondary}
            maxLength={32}
            value={flashcard.prompt}
            onChangeText={(prompt) =>
              setFlashcard((prev) => ({ ...prev, prompt }))
            }
            style={{ height: 40, marginBottom: 5 }}
          />

          <TextInput
            mode='outlined'
            label='SOLUTION'
            outlineColor='lightgrey'
            activeOutlineColor={colors.secondary}
            maxLength={32}
            value={flashcard.solution}
            onChangeText={(solution) =>
              setFlashcard((prev) => ({ ...prev, solution }))
            }
            style={{ height: 40, marginTop: 5 }}
          />
        </View>
      </ActionDialog>
    </View>
  );
};

export default FlashCards;
