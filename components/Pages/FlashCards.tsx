import { View, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import React, {
  useState,
  useEffect,
  Suspense,
  useRef,
  useContext,
} from 'react';
import { Button } from 'react-native-paper';
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
import CustomTextInput from '../CustomTextInput';
import ModifcationBar from '../ModifcationBar';

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

  const { cards } = useSelector((state: RootState) => state.store);
  const dispatch = useDispatch<AppDispatch>();

  const { patterns, theme } = useContext(swatchContext);

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

  const startMultiSelectMode = () => {
    clearSelection();
    setMultiSelectMode(true);
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
    db.findOne({ _id: setRef }, (err: Error, doc: any) => {
      if (err) console.log(err);
      navigation.setOptions({
        title: doc.name,
      });
      setSetName(doc.name);
    });

    // get points of category to calculate xp progress
    db.findOne({ _id: categoryRef }, (err: Error, doc: any) => {
      categoryXP.current = !err ? doc.points : 0;
    });
  }, [setRef, categoryRef]);

  return (
    <View>
      {/* CONTROL BUTTONS  */}
      <ModifcationBar
        selections={selection}
        labelColor={theme.fontColor}
        buttonColor={theme.cardColor}
        enableSelection={multiSelectMode}
        disableSelection={cards.flashcard.length === 0}
        clearSelection={clearSelection}
        onPressNew={() => setShowDialog(true)}
        onPressSelect={startMultiSelectMode}
        onConfirmSelection={confirmAlert}
      >
        <Button
          mode='contained'
          color={theme.cardColor}
          style={[s.cardActionButton]}
          labelStyle={{ color: theme.fontColor }}
          onPress={() => setStartQuiz(true)}
          disabled={cards.flashcard.length === 0}
        >
          QUIZ
        </Button>
      </ModifcationBar>

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
          <CustomTextInput
            label='PROMPT'
            style={{ height: 40, marginBottom: 5 }}
            defaultValue={editMode ? flashcard.prompt : undefined}
            onChange={(prompt) => setFlashcard((prev) => ({ ...prev, prompt }))}
          />
          <CustomTextInput
            label='SOLUTION'
            style={{ height: 40, marginTop: 5 }}
            defaultValue={editMode ? flashcard.solution : undefined}
            onChange={(solution) =>
              setFlashcard((prev) => ({ ...prev, solution }))
            }
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
