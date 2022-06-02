import React, { createContext } from 'react';
import { User } from '../components/types';

export interface UserContextType {
  user: User[];
  setUser: React.Dispatch<User[]>;
}

const initialValue = {
  user: [],
  setUser: () => {},
};

export const UserContext = createContext<UserContextType>(initialValue);
