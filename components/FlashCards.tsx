import { View, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, Suspense } from 'react';
import { IconButton, useTheme, Text, TextInput } from 'react-native-paper';

import db from '../db-services';

import ActionDialog from './ActionDialog';
import Card from './Card';

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

  const [editMode, setEditMode] = useState(false);

  const { colors } = useTheme();
  const { setRef, categoryRef, setTitle, color } = route.params;

  const closeDialog = () => {
    setFlashcard(INITIAL_STATE);
    setEditMode(false);
    setShowDialog(false);
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
      <IconButton
        icon='card-plus-outline'
        onPress={() => setShowDialog(true)}
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
                  // initial={}
                  key={card._id}
                  card={card}
                  color={color}
                  handleDelete={deleteCard}
                  handleEdit={editCard}
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
