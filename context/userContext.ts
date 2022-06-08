import React, { createContext } from 'react';
import { User } from '../components/types';
import { UserAction } from '../reducers/UserReducer';


export interface UserContextType {
  user: User;
  userDispatch: React.Dispatch<UserAction>;
}

type Datatype = 'user';

export const initUser = {
  _id: '',
  type: 'user' as Datatype,
  experiencePoints: 0,
  username: '',
  level: 1,
  heartcoin: 100,
  achievements: [],
  collections: {
    cardDesigns: [],
    cardColors: [],
    themes: [],
  },
  login: {
    week: [new Date()],
    streak: 0,
  },
};

const initialValue = {
  user: initUser,
  userDispatch: () => {},
};

export const UserContext = createContext<UserContextType>(initialValue);
