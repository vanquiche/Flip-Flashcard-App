import { View, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, Suspense } from 'react';
import {
  IconButton,
  useTheme,
  Text,
  TextInput,
  Button,
} from 'react-native-paper';

import db from '../db-services';
import useMarkSelection from '../hooks/useMarkSelection';

import ActionDialog from './ActionDialog';
import Card from './Card';
import Quiz from './Quiz';
import AlertDialog from './AlertDialog';

import { Flashcard } from './types';
import { StackNavigationTypes } from './types';

const INITIAL_STATE: { id?: string; prompt: string; solution: string } = {
  id: '',
  prompt: '',
  solution: '',
};

interface Props extends StackNavigationTypes {}

const FlashCards: React.FC<Props> = ({ navigation, route }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flashcard, setFlashcard] = useState(INITIAL_STATE);
  const [showDialog, setShowDialog] = useState(false);
  const [startQuiz, setStartQuiz] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [multiSelectMode, setMultiSelectMode] = useState(false);

  const [showAlert, setShowAlert] = useState(false);

  const { colors } = useTheme();
  const { setRef, categoryRef, setTitle, color } = route.params;
  const { selection, selectItem, clearSelection } = useMarkSelection();

  const closeDialog = () => {
    setShowDialog(false);
    setTimeout(() => {
      setEditMode(false);
      setFlashcard(INITIAL_STATE);
    }, 300);
  };

  const addNewCard = () => {
    const newCard = {
      type: 'flashcard',
      prompt: flashcard.prompt,
      solution: flashcard.solution,
      createdAt: new Date(),
      categoryRef: categoryRef,
      setRef: setRef,
    };
    db.insert(newCard, (err: Error, doc: any) => {
      if (err) console.log(err);
      setFlashcards((prev) => [doc, ...prev]);
    });
    closeDialog();
  };

  const deleteCard = (id: string) => {
    db.remove({ _id: id }, {}, (err: Error, numRemoved: any) => {
      if (err) console.log(err);
      setFlashcards((prev) => prev.filter((card) => card._id !== id));
    });
  };

  const editCard = async (card: Flashcard) => {
    await setFlashcard({
      id: card._id,
      prompt: card.prompt,
      solution: card.solution,
    });
    setEditMode(true);
    setShowDialog(true);
  };

  const submitEdit = () => {
    db.update(
      { _id: flashcard.id },
      { $set: { prompt: flashcard.prompt, solution: flashcard.solution } },
      (err: Error, numRemoved: number) => {
        if (err) console.log(err);
        setFlashcards((prev) =>
          prev.map((item: Flashcard) => {
            if (item._id === flashcard.id) {
              return {
                ...item,
                prompt: flashcard.prompt,
                solution: flashcard.solution,
              };
            }
            return item;
          })
        );
      }
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
      deleteCard(selection.current[i]);
    }
    cancelMultiDeletion();
  };

  useEffect(() => {
    // fetch data from db
    const getData = () => {
      db.find(
        { type: 'flashcard', setRef: setRef },
        async (err: any, docs: any) => {
          const data = await docs.map((doc: Flashcard) => {
            // convert date to number
            doc.createdAt = new Date(doc.createdAt).valueOf();
            return doc;
          });
          // sort by date
          const sorted = data.sort((a: any, b: any) => {
            return b.createdAt - a.createdAt;
          });
          setFlashcards(sorted);
        }
      );
    };
    getData();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: setTitle.toUpperCase(),
    });
  }, []);

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
            disabled={flashcards.length === 0}
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
            disabled={flashcards.length === 0}
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
          color={color}
          cards={flashcards}
          navigation={navigation}
          onDismiss={() => setStartQuiz(false)}
          set={setTitle}
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
            {flashcards.map((card: Flashcard) => {
              return (
                <Card
                  key={card._id}
                  card={card}
                  color={color}
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
