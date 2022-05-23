import { View, ActivityIndicator, ScrollView } from 'react-native';
import { Text, IconButton, TextInput, useTheme } from 'react-native-paper';
import React, { useState, useEffect, useContext, Suspense } from 'react';

// UTILITIES
import uuid from 'react-native-uuid';
import db from '../db-services';

// COMPONENTS
import TitleCard from './TitleCard';
import ActionDialog from './ActionDialog';
import SwatchDialog from './SwatchDialog';

import { Set, StackNavigationTypes } from './types';


const INITIAL_STATE: { id?: string; name: string; color: string } = {
  id: '',
  name: '',
  color: 'tomato',
};

interface Props extends StackNavigationTypes {}

const Sets: React.FC<Props> = ({ navigation, route }) => {
  // data state
  const [cardSets, setCardSets] = useState<Set[]>([]);
  const [cardSet, setCardSet] = useState(INITIAL_STATE);
  // view state
  const [showDialog, setShowDialog] = useState(false);
  const [showSwatch, setShowSwatch] = useState(false);
  // edit state
  const [editMode, setEditMode] = useState(false);

  const { colors } = useTheme();
  const { categoryRef, categoryTitle } = route.params;

  // CRUD functions
  const closeDialog = async () => {
    await setCardSet(INITIAL_STATE);
    setShowDialog(false);
    setEditMode(false);
  };

  const addNewSet = () => {
    const newSet = {
      type: 'set',
      name: cardSet.name,
      color: cardSet.color,
      createdAt: new Date(),
      categoryRef: categoryRef,
    };
    db.insert(newSet, (err: Error, doc: any) => {
      if (err) console.log(err);
      setCardSets((prev) => [doc, ...prev]);
    });
    closeDialog();
  };

  const deleteSet = (id: string) => {
    db.remove({ _id: id }, {}, (err: Error, numRemoved: any) => {
      if (err) console.log(err);
      setCardSets((prev) => prev.filter((set) => set._id !== id));
    });
  };

  const editSet = async (set: Set) => {
    await setCardSet({
      id: set._id,
      name: set.name,
      color: set.color,
    });
    setEditMode(true);
    setShowDialog(true);
  };

  const submitEdit = () => {
    db.update(
      { _id: cardSet.id },
      { $set: { name: cardSet.name, color: cardSet.color } },
      (err: Error, numRemoved: number) => {
        if (err) console.log(err);
        setCardSets((prev) =>
          prev.map((item) => {
            if (item._id === cardSet.id) {
              return { ...item, name: cardSet.name, color: cardSet.color };
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
        { type: 'set', categoryRef: categoryRef },
        async (err: any, docs: any) => {
          const data = await docs.map((doc: Set) => {
            // convert date to number
            doc.createdAt = new Date(doc.createdAt).valueOf();
            return doc;
          });
          // sort by date
          const sorted = data.sort((a: any, b: any) => {
            return b.createdAt - a.createdAt;
          });
          setCardSets(sorted);
        }
      );
    };
    getData();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: categoryTitle.toUpperCase(),
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
                  handleEdit={editSet}
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
            label='CATEGORY NAME'
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
