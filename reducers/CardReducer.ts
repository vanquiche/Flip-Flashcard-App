import { Category, Set, Flashcard } from '../components/types';
import db from '../db-services';

type Collection = Category | Set | Flashcard;

export interface Action {
  type: 'insert' | 'remove' | 'remove-single' | 'update' | 'restore';
  payload?: any;
  query?: any;
}

const insertDoc = (state: any[], action: Action) => {
  db.insert(action.payload, (err: Error, newDoc: any) => {
    if (err) console.log(err);
  });

  const newState = [action.payload, ...state];
  return newState;
};

const removeDocs = (state: any[], action: Action) => {
  db.remove({ _id: action.payload }, {}, (err: Error, numRemoved: any) => {
    if (err) console.log(err);
  });
  //  delete sets and cards connected to category
  db.remove(
    { categoryRef: action.payload },
    { multi: true },
    (err: Error, numRemoved: number) => {
      if (err) console.log(err);
      // console.log(count + numRemoved);
    }
  );

  const newState = state.filter((item) => item._id !== action.payload);
  return newState;
};

const removeSingleDoc = (state: any[], action: Action) => {
  db.remove({ _id: action.payload }, {}, (err: Error, numRemoved: any) => {
    if (err) console.log(err);
  });

  const newState = state.filter((item) => item._id !== action.payload);
  return newState;
};

const updateDoc = (state: any[], action: Action) => {
  // const updateName = action.payload.name;
  // const updateColor = action.payload.color;
  const update = action.query;
  db.update(
    { _id: action.payload.id },
    {$set: update},
    (err: Error, numRemoved: number) => {
      if (err) console.log(err);
    }
  );

  const newState = state.map((item) => {
    if (item._id === action.payload.id) {
      return { ...item, ...update};
    }
    return item;
  });

  return newState;
};

export const cardReducer = (state: any[], action: Action): any[] => {
  switch (action.type) {
    case 'restore':
      return action.payload;
    case 'insert':
      return insertDoc(state, action);
    case 'remove':
      return removeDocs(state, action);
    case 'update':
      return updateDoc(state, action);
    case 'remove-single':
      return removeSingleDoc(state, action)
    default:
      return state;
  }
};
