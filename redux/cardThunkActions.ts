import { createAsyncThunk } from '@reduxjs/toolkit';
import db from '../db-services';
import {
  Action,
  Flashcard,
  Category,
  Set,
  Collection,
  CardType,
  CardPosition,
} from '../components/types';
import { createPositionList } from '../utility/dragAndSort';

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

interface Query {
  type: CardType;
  [key: string]: string;
}

interface CardsPayload {
  type: CardType;
  cards: Collection[];
  positions: Record<string, number>;
}

export const getCards = createAsyncThunk(
  'store/getCardsByQuery',
  (payload: { query: Query; type: CardType }) => {
    return new Promise<CardsPayload>(async (resolve, reject) => {
      try {
        const data: CardsPayload = {
          type: payload.type,
          cards: [],
          positions: {},
        };

        await db.find(payload.query, (err: Error, docs: Collection[]) => {
          if (!err) data.cards = docs;
        });

        await db.findOne(
          { type: 'position', ref: payload.query.ref },
          (err: Error, doc: CardPosition) => {
            if (!err && doc) {
              data.positions = doc.positions;
            } else {
              data.positions = createPositionList(data.cards);
            }
          }
        );
        resolve(data);
      } catch (err) {
        reject(err);
      }
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
