import { View } from 'react-native';
import React, {
  useState,
  useEffect,
  useRef,
  useContext,
} from 'react';
import { Button } from 'react-native-paper';
import ActionDialog from '../ActionDialog';
import Card from '../Card';
import Quiz from '../Quiz';
import AlertDialog from '../AlertDialog';

import { DateTime } from 'luxon';
import uuid from 'react-native-uuid';
import db from '../../db-services';
import useMarkSelection from '../../hooks/useMarkSelection';
import checkDuplicate from '../../utility/checkDuplicate';

import { CardPosition, Flashcard } from '../types';
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
import CustomTextInput from '../CustomTextInput';
import ModifcationBar from '../ModifcationBar';

import DragSortList from '../DragSortList';
import DraggableWrapper from '../DraggableWrapper';
import { useSharedValue } from 'react-native-reanimated';
import {
  addToPositions,
  measureOffset,
  moveObject,
  removeFromPositions,
  removeManyFromPositions,
  saveCardPosition,
} from '../../utility/dragAndSort';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAnimatedReaction, runOnJS } from 'react-native-reanimated';

const SCROLLVIEW_ITEM_HEIGHT = 210;

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
  const { setRef, categoryRef, color, design, screenTitle } = route.params;
  const [flashcard, setFlashcard] = useState(INITIAL_STATE);
  const animateEntryId = useRef('');

  // view states
  const [editMode, setEditMode] = useState(false);
  const [sortMode, setSortMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [startQuiz, setStartQuiz] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [multiSelectMode, setMultiSelectMode] = useState(false);

  // quiz references
  const setName = useRef('');
  const categoryXP = useRef(0);

  // redux store and context
  const { cards } = useSelector((state: RootState) => state.store);
  const dispatch = useDispatch<AppDispatch>();
  const { patterns, theme } = useContext(swatchContext);

  // drag and sort values
  const [scrollViewOffset, setScrollViewOffset] = useState(0);
  const scrollY = useSharedValue(0);
  const cardPosition = useSharedValue({});
  const insets = useSafeAreaInsets();

  // hooks
  const { selection, selectItem, clearSelection } = useMarkSelection();

  const closeDialog = () => {
    setShowDialog(false);
    // delay to prevent user from seeing state change in modal
    setTimeout(() => {
      setEditMode(false);
      setFlashcard(INITIAL_STATE);
    }, 300);
  };

  const addNewCard = () => {
    const exist = checkDuplicate(flashcard.prompt, 'prompt', cards.flashcard);

    if (!exist) {
      const id = uuid.v4().toString();
      animateEntryId.current = id;
      const newCard: Flashcard = {
        _id: id,
        type: 'flashcard',
        prompt: flashcard.prompt,
        solution: flashcard.solution,
        createdAt: DateTime.now().toISO(),
        categoryRef: categoryRef,
        setRef: setRef,
      };
      cardPosition.value = addToPositions(cardPosition.value, id);
      // delay adding card until cards have moved into their updated positions
      setTimeout(() => dispatch(addFlashCard(newCard)), 200);
    }
    closeDialog();
  };

  const deleteCard = (id: string) => {
    dispatch(removeCard({ id, type: 'flashcard' }));
    // once card has been removed then update positions for smooth transition
    setTimeout(() => {
      cardPosition.value = removeFromPositions(cardPosition.value, id);
    }, 300);
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
    cancelMultiDeletion();
    for (let i = 0; i < selection.length; i++) {
      dispatch(removeCard({ id: selection[i], type: 'flashcard' }));
      if (i === selection.length - 1) {
        // after operation has completed, update card positions
        setTimeout(() => {
          cardPosition.value = removeManyFromPositions(
            cardPosition.value,
            selection
          );
        }, 100);
      }
    }
  };

  const startMultiSelectMode = () => {
    clearSelection();
    setMultiSelectMode(true);
  };

  const toggleSortMode = () => {
    setSortMode((prev) => !prev);
  };

  const savePositions = () => {
    const list: CardPosition = {
      ref: setRef,
      type: 'position',
      root: categoryRef,
      positions: cardPosition.value,
    };
    saveCardPosition(list);
  };

  async function syncData() {
    const data: any = await dispatch(
      getCards({
        type: 'flashcard',
        query: { type: 'flashcard', setRef: setRef },
      })
    );
    cardPosition.value = data.payload.positions;

    if (screenTitle) {
      navigation.setOptions({
        title: screenTitle,
      });
      setName.current = screenTitle;
    }
    db.findOne({ _id: categoryRef }, (err: Error, doc: any) => {
      categoryXP.current = !err && doc ? doc.points : 0;
    });

    setIsLoading(false);
  }

  // listen for changes in cardPosition and save any changes
  useAnimatedReaction(
    () => cardPosition.value,
    (curPositions, prevPositions) => {
      if (!isLoading && !sortMode) {
        if (curPositions !== prevPositions) {
          runOnJS(savePositions)();
        }
      }
    },
    [cardPosition.value]
  );

  useEffect(() => {
    syncData();
  }, []);

  return (
    <View style={{ flex: 1 }}>
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
        sortMode={sortMode}
        onSort={toggleSortMode}
      >
        <Button
          mode='contained'
          color={theme.cardColor}
          style={[s.cardActionButton]}
          labelStyle={{
            color:
              cards.flashcard.length === 0 || sortMode
                ? 'grey'
                : theme.fontColor,
          }}
          onPress={() => setStartQuiz(true)}
          disabled={cards.flashcard.length === 0 || sortMode}
          accessibilityHint='start quiz'
          accessibilityState={{
            disabled: cards.flashcard.length === 0 || sortMode,
          }}
        >
          QUIZ
        </Button>
      </ModifcationBar>

      {startQuiz && (
        <Quiz
          set={setName.current}
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

      <DragSortList
        scrollY={scrollY}
        scrollViewHeight={cards.flashcard.length * SCROLLVIEW_ITEM_HEIGHT}
        onLayout={(e) => measureOffset(e, setScrollViewOffset)}
      >
        {!isLoading &&
          cards.flashcard.map((card: Flashcard) => {
            return (
              <DraggableWrapper
                key={card._id}
                itemHeight={205}
                itemWidth={128}
                dataLength={cards.flashcard.length}
                id={card._id}
                positions={cardPosition}
                moveObject={moveObject}
                scrollY={scrollY}
                yOffset={scrollViewOffset - insets.top}
                enableTouch={sortMode}
                onEnd={savePositions}
              >
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
                  selectedForDeletion={selection.includes(card._id)}
                  disableActions={sortMode || multiSelectMode}
                  animateEntry={animateEntryId.current === card._id}
                />
              </DraggableWrapper>
            );
          })}
      </DragSortList>

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

export default FlashCards;
