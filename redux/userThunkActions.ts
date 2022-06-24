import { createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../components/types';
import db from '../db-services';
import { DateTime } from 'luxon';

export const createNewUser = createAsyncThunk(
  'user/createUser',
  (newUser: any) => {
    return new Promise<User>((resolve, reject) => {
      db.insert(newUser, (err: Error, newDoc: User) => {
        if (err) reject(err.message);
        resolve(newDoc);
      });
    });
  }
);

export const getUserData = createAsyncThunk('store/getUser', () => {
  return new Promise<User>((resolve, reject) => {
    db.find({ type: 'user' }, (err: Error, docs: User[]) => {
      if (err) reject(err.message);
      if (docs.length > 0) resolve(docs[0]);
    });
  });
});

export const deleteUser = createAsyncThunk('store/deleteCurrentUser', () => {
  return new Promise<void>((resolve, reject) => {
    db.remove({}, {multi: true}, (err: Error, numRemoved: number) => {
      if (err) reject(err.message);
      resolve();
    });
  });
});

export const updateUser = createAsyncThunk(
  'store/updateUserByField',
  (update: Object) => {
    return new Promise<Object>((resolve, reject) => {
      db.update(
        { type: 'user' },
        { $set: update },
        (err: Error, numRemoved: number) => {
          if (err) reject(err.message);
          resolve(update);
        }
      );
    });
  }
);

export const checkLogin = createAsyncThunk(
  'store/checkLogin',
  (lastLogin: string) => {
    return new Promise<void | string>((resolve, reject) => {
      const dt = DateTime;
      const today = dt.now();
      const { hours } = today.diff(dt.fromISO(lastLogin), 'hours').toObject();

      if (hours) {
        if (hours < 24) {
          resolve();
        } else if (hours > 24) {
          db.update(
            { type: 'user' },
            { $push: { login: today.toISO() } },
            (err: Error, numReplaced: number) => {
              if (err) reject(err.message);
              resolve(today.toISO());
            }
          );
        }
      }
    });
  }
);

export const completeQuiz = createAsyncThunk(
  'store/markSetComplete',
  (setRef: string) => {
    return new Promise<string>((resolve, reject) => {
      db.update(
        { type: 'user' },
        { $push: { completedQuiz: { setRef } } },
        (err: Error, numRemoved: number) => {
          if (err) reject(err.message);
          resolve(setRef);
        }
      );
    });
  }
);