import { createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../components/types';
import db from '../db-services';
import { DateTime } from 'luxon';
import loginStreak from '../utility/loginStreak';
import sortWeek from '../utility/sortWeek';

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
    db.remove({}, { multi: true }, (err: Error, numRemoved: number) => {
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
  (payload: { lastLogin: string[]; streak: number; xp: number }) => {
    return new Promise<void | string[]>((resolve, reject) => {
      const dt = DateTime;
      const today = dt.now();
      const loggedInLast = payload.lastLogin[payload.lastLogin.length - 1];
      const { hours } = today
        .diff(dt.fromISO(loggedInLast), 'hours')
        .toObject();

      const updatedWeek = sortWeek(payload.lastLogin);

      if (hours) {
        // if checkin is no older than 24h then do nothing
        if (hours < 24) {
          resolve();
        } else if (hours > 24) {
          const inStreak = loginStreak(loggedInLast);
          const xp = inStreak ? payload.xp + 25 : payload.xp;
          const streak = inStreak
            ? payload.streak + 1
            : !inStreak
            ? 0
            : payload.streak;

          db.update(
            { type: 'user' },
            {
              $set: {
                xp: xp,
                streak: streak,
                completedQuiz: [],
                login: updatedWeek,
              },
            },
            (err: Error, numReplaced: number) => {
              if (err) reject(err);
              // if (err) console.log(err)
              resolve(updatedWeek);
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
