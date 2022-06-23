import { createAsyncThunk } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';
import { CompletedRef, Login, User } from '../components/types';
import db from '../db-services';
import loginStreak from '../utility/loginStreak';

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

// export const getCompleteQuizes = createAsyncThunk(
//   'store/getCompletedQuiz',
//   (lastLogin: string) => {
//     return new Promise<string[] | void>((resolve, reject) => {
//       const dt = DateTime;
//       const today = dt.now();
//       const diff = today.diff(dt.fromISO(lastLogin), 'days').toObject();
//       if (diff.days) {
//         if (diff.days < 24) {
//           db.find(
//             { type: 'completed' },
//             async (err: Error, docs: CompletedRef[]) => {
//               if (err) reject(err.message);
//               if (docs.length > 0) {
//                 const refs = docs.map((r) => r.set);
//                 resolve(refs);
//               } else resolve();
//             }
//           );
//         } else if (diff.days > 24) {
//           db.remove({ type: 'completed' }, (err: Error, numRemoved: number) => {
//             if (err) reject(err.message);
//             resolve();
//           });
//         }
//       }
//     });
//   }
// );
