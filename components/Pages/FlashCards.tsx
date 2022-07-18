import { View, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import React, {
  useState,
  useEffect,
  Suspense,
  useRef,
  useContext,
} from 'react';
import { TextInput, Button } from 'react-native-paper';
import { DateTime } from 'luxon';

import uuid from 'react-native-uuid';
import db from '../../db-services';
import useMarkSelection from '../../hooks/useMarkSelection';
import checkDuplicate from '../../utility/checkDuplicate';

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
import s from '../styles/styles';
import swatchContext from '../../contexts/swatchContext';
import useRenderCounter from '../../hooks/useRenderCounter';

const INITIAL_STATE: Flashcard = {
  _id: '',
  prompt: '',
  setRef: '',
  solution: '',
  createdAt: '',
  categoryRef: '',
  type: 'flashcard',
};

interface Props extends StackNavigationTypes {}

const FlashCards = ({ navigation, route }: Props) => {
  const [flashcard, setFlashcard] = useState(INITIAL_STATE);
  const [showDialog, setShowDialog] = useState(false);
  const [setName, setSetName] = useState('');

  const [editMode, setEditMode] = useState(false);
  const [startQuiz, setStartQuiz] = useState(false);
  const [multiSelectMode, setMultiSelectMode] = useState(false);

  const [showAlert, setShowAlert] = useState(false);

  const categoryXP = useRef<number>(0);
  const { setRef, categoryRef, color, design } = route.params;
  const { selection, selectItem, clearSelection } = useMarkSelection();

  const { user, cards } = useSelector((state: RootState) => state.store);
  const dispatch = useDispatch<AppDispatch>();

  const { patterns } = useContext(swatchContext);

  const { renderCount } = useRenderCounter();
  renderCount.current++;

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
      ...card,
    });
    setEditMode(true);
    setShowDialog(true);
  };

  const submitEdit = () => {
    const docQuery = { prompt: flashcard.prompt, solution: flashcard.solution };
    dispatch(updateCard({ card: flashcard, query: docQuery }));
    closeDialog();
  };

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
      dispatch(removeCard({ id: selection[i], type: 'flashcard' }));
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
    // set title
    db.find({ _id: setRef }, (err: Error, docs: any) => {
      if (err) console.log(err);
      navigation.setOptions({
        title: docs[0].name,
      });
      setSetName(docs[0].name);
    });

    // get points of category to calculate xp progress
    db.find({ _id: categoryRef }, (err: Error, docs: any[]) => {
      if (docs.length > 0) {
        categoryXP.current = docs[0].points;
      }
    });
  }, [setRef, categoryRef]);

  return (
    <View>
      {/* CONTROL BUTTONS  */}
      <View style={s.cardButtonWrapper}>
        {!multiSelectMode ? (
          <>
            <Button
              mode='contained'
              style={s.cardActionButton}
              color={user.theme.cardColor}
              labelStyle={{ color: user.theme.fontColor }}
              onPress={() => setShowDialog(true)}
            >
              NEW
            </Button>

            <Button
              mode='contained'
              color={user.theme.cardColor}
              style={[s.cardActionButton]}
              labelStyle={{ color: user.theme.fontColor }}
              onPress={() => setStartQuiz(true)}
              disabled={cards.flashcard.length === 0}
            >
              QUIZ
            </Button>

            <Button
              mode='contained'
              style={s.cardActionButton}
              labelStyle={{ color: user.theme.fontColor }}
              color={user.theme.cardColor}
              onPress={() => {
                clearSelection();
                setMultiSelectMode(true);
              }}
              disabled={cards.flashcard.length === 0}
            >
              SELECT
            </Button>
          </>
        ) : (
          <>
          <Button
            mode='text'
            color='tomato'
            onPress={confirmAlert}
            style={[s.cardActionButton, { position: 'absolute', right: 12 }]}
            >
            {selection.length > 0 ? 'DELETE' : 'BACK'}
          </Button>
             <Button
            mode='text'
            color='tomato'
            onPress={clearSelection}
            style={[s.cardActionButton, { position: 'absolute', left: 12 }]}
            disabled={selection.length === 0}
            >
            CLEAR
          </Button>
            </>
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
          <View style={styles.cardContainer}>
            {cards.flashcard.map((card: Flashcard) => {
              return (
                <Card
                  key={card._id}
                  card={card}
                  color={color}
                  pattern={design}
                  patternList={patterns}
                  multiSelect={multiSelectMode}
                  handleEdit={editCard}
                  handleDelete={deleteCard}
                  markForDelete={selectItem}
                  shouldAnimateEntry={renderCount.current > 3 ? true : false}
                  selectedForDeletion={selection.includes(card._id)}
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
        <View>
          <TextInput
            mode='outlined'
            label='PROMPT'
            outlineColor='grey'
            activeOutlineColor='black'
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
            outlineColor='grey'
            activeOutlineColor='black'
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

const styles = StyleSheet.create({
  cardContainer: {
    paddingBottom: 150,
    alignItems: 'center',
  },
});

export default FlashCards;
