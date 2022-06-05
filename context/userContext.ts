import React, { createContext } from 'react';
import { User } from '../components/types';

export interface UserContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

type Datatype = 'user';

export const initUser = {
  _id: '',
  type: 'user' as Datatype,
  experiencePoints: 0,
  username: '',
  level: 1,
  heartcoin: 100,
  categoryTrack: [],
  achievements: [],
  collections: {
    cardDesigns: [],
    cardColors: [],
    themes: [],
  },
  login: {
    lastLogin: new Date(),
    streak: 0,
  },
};

const initialValue = {
  user: initUser,
  setUser: (): void => {},
};

export const UserContext = createContext<UserContextType>(initialValue);
