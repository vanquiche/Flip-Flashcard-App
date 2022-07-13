import { createAsyncThunk } from '@reduxjs/toolkit';
import db from '../db-services';
import {
  Action,
  Flashcard,
  Category,
  Set,
  Collection,
  CardType,
} from '../components/types';

export const addCategoryCard = createAsyncThunk(
  'store/addCategoryCard',
  (card: Category) => {
    return new Promise<Category>((resolve, reject) => {
      db.insert(card, (err: Error, newDoc: any) => {
        if (err) reject(err.message);
        resolve(newDoc);
      });
    });
  }
);

export const addSetCard = createAsyncThunk('store/addSetCard', (card: Set) => {
  return new Promise<Set>((resolve, reject) => {
    db.insert(card, (err: Error, newDoc: any) => {
      if (err) reject(err.message);
      resolve(newDoc);
    });
  });
});

export const addFlashCard = createAsyncThunk(
  'store/addFlashCard',
  (card: Flashcard) => {
    return new Promise<Flashcard>((resolve, reject) => {
      db.insert(card, (err: Error, newDoc: any) => {
        if (err) reject(err.message);
        resolve(newDoc);
      });
    });
  }
);

export const removeCard = createAsyncThunk(
  'store/removeCardByID',
  (payload: { id: string; type: 'category' | 'set' | 'flashcard' }) => {
    return new Promise<{ id: string; type: 'category' | 'set' | 'flashcard' }>(
      (resolve, reject) => {
        db.remove({ _id: payload.id }, {}, (err: Error, numRemoved: any) => {
          if (err) reject(err.message);
        });
        //  delete sets and cards connected to category
        if (payload.type !== 'flashcard') {
          db.remove(
            { categoryRef: payload.id },
            { multi: true },
            (err: Error, numRemoved: number) => {
              if (err) reject(err.message);
              // console.log(numRemoved)
            }
          );
        }
        resolve(payload);
      }
    );
  }
);

export const updateCard = createAsyncThunk(
  'store/updateCard',
  (payload: { card: Collection; query: Record<string, unknown> }) => {
    return new Promise<{ card: Collection; query: Record<string, unknown> }>(
      (resolve, reject) => {
        db.update(
          { _id: payload.card._id },
          { $set: payload.query },
          (err: Error, numRemoved: number) => {
            if (err) reject(err.message);
            resolve(payload);
          }
        );
      }
    );
  }
);

export const getCards = createAsyncThunk(
  'store/getCardsByQuery',
  (payload: { query: Object; type: 'category' | 'set' | 'flashcard' }) => {
    return new Promise<{
      type: 'category' | 'set' | 'flashcard';
      cards: Collection[];
    }>((resolve, reject) => {
      db.find(payload.query, (err: Error, docs: Collection[]) => {
        if (err) reject(err.message);
        resolve({ type: payload.type, cards: docs });
      });
    });
  }
);

export const getFavoriteSets = createAsyncThunk('store/getFavoriteSets', () => {
  return new Promise<Set[]>((resolve, reject) => {
    db.find({ type: 'set', favorite: true }, (err: Error, docs: Set[]) => {
      if (err) reject(err.message);
      resolve(docs);
    });
  });
});

export const toggleFavoriteSet = createAsyncThunk(
  'store/toggleFavoritSet',
  (payload) => {}
);
